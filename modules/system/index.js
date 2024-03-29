const { scripts, license } = global.config.files;

const express = require('express');
const path = require('path');
const multer = require('multer');
const child_process = require('child_process');
const exceljs = require('exceljs');

const file = require(`${scripts}/file`);
const mysql = require(`${scripts}/mysql`);

const config = require('./config.json');

const app = express();

app.get('/news-content', async (req, res) => {
    let { id } = req.query;
    res.sendFile(`${id}.html`, { root: `${__dirname}/resources/html/news` });
});

app.get('/manual', async (req, res) => {
    let identity = req.query.identity || req.session.identity;
    res.sendFile(`${identity}.html`, { root: `${__dirname}/resources/html/manual` });
});

app.get('/img', async (req, res) => {
    res.sendFile(req.query.file, { root: `${__dirname}/resources/img` });
});

app.get('/news-list', async (req, res) => {
    let { length: limit, start: offset } = req.query,
        sql_query = 'SELECT * FROM news ORDER BY top DESC,id DESC LIMIT ? OFFSET ?';
    let result = await mysql.query(sql_query, [Number(limit), Number(offset)]);
    res.json({
        status: true,
        news: result
    });
});

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, 'tmp'));
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
});

let receiver = upload.single('file');

app.post('/editor-img', receiver, async (req, res) => {
    let { filename, path: from } = req.file;
    let newName = `${Date.now()}-${filename}`;
    console.log(filename);
    console.log(from);
    await file.move(from, path.resolve(__dirname, 'resources/img', newName));
    res.json({
        errno: 0,
        data: ['system/img?file=' + newName]
    });
});

app.post('/write-news', receiver, async (req, res) => {
    let { top, title, content } = req.body,
        sql_insert = 'INSERT INTO news (top,title,date) VALUES (?,?,CURDATE())';
    let rst = await mysql.query(sql_insert, [top, title]);
    await file.writeFile(`${__dirname}/resources/html/news/${rst.insertId}.html`, content);
    res.json({
        status: true,
        msg: '通知发布成功！'
    });
});

app.post('/write-license', receiver, async (req, res) => {
    let { content } = req.body;
    await file.writeFile(license, content);
    res.json({
        status: true,
        msg: '协议发布成功！'
    });
});

app.post('/write-manual', receiver, async (req, res) => {
    let b = req.body;
    for (const k of Object.keys(b)) {
        await file.writeFile(`${__dirname}/resources/html/manual/${k}.html`, b[k]);
    }
    res.json({
        status: true,
        msg: '手册发布成功！'
    });
});

app.get('/user-manage', async (req, res) => {
    let sql_query = 'SELECT id,name,gender,schoolNum,specialty,SUBSTR(`group`,3) `group`,class,postGraduate FROM student;SELECT id,name,gender,schoolNum,proTitle,SUBSTR(`group`,3) `group`,department,ifDean,ifHead FROM teacher;SELECT id,name,gender,priv FROM admin;';
    let users = await mysql.query(sql_query);
    res.json({
        status: true,
        users
    });
});

app.post('/add-user', async (req, res) => {
    let { identity, info } = req.body,
        sql_insert = 'INSERT INTO ?? SET ?';
    if ('group' in info) {
        info.group = `${config.group[info.group || 0]}-${info.group}`;
    }
    let rst = await mysql.query(sql_insert, [identity, info]);
    res.json({
        status: true,
        msg: '增加用户成功！',
        insertId: rst.insertId
    });
});

app.post('/edit-user', async (req, res) => {
    let { id, identity, info } = req.body,
        sql_update = 'UPDATE ?? SET ? WHERE id=?';
    if ('group' in info) {
        info.group = `${config.group[info.group] || 0}-${info.group}`;
    }
    await mysql.query(sql_update, [identity, info, id]);
    res.json({
        status: true,
        msg: '修改用户信息成功！'
    });
});

app.post('/del-user', async (req, res) => {
    let { id, identity } = req.body,
        sql_update = `DELETE FROM ?? WHERE id in (${id.join(',')})`;

    await mysql.query(sql_update, identity);
    res.json({
        status: true,
        msg: '删除用户成功！'
    });
});

app.post('/import-user', receiver, async (req, res) => {
    let { identity, mode } = req.body,
        { path: tmp } = req.file,
        sql_truncate = 'SET FOREIGN_KEY_CHECKS=0;TRUNCATE TABLE ??;SET FOREIGN_KEY_CHECKS=1;',
        sql_insert = `INSERT INTO ${identity} (name,gender,schoolNum,\`group\`,${identity == 'teacher' ? 'proTitle,department,ifDean,ifHead' : 'specialty,`class`,postGraduate'}) VALUES `;
    let wb = new exceljs.Workbook();
    await wb.xlsx.readFile(tmp);
    let ws = wb.getWorksheet(1);

    for (let i = 2; i <= ws.rowCount; i++) {
        let r = ws.getRow(i).values;
        sql_insert += `('${r[1]}','${r[2]}','${r[3]}','${config.group[r[4]] || 0}-${r[4]}','${r[5]}','${r[6]}','${r[7] || '否'}'${identity == 'teacher' ? `,'${r[8] || '否'}'` : ''})${i == ws.rowCount ? '' : ','}`;
    }

    let conn = await mysql.transaction();
    if (mode == 'overwrite') {
        await conn.query(sql_truncate, identity);
    }
    await conn.query(sql_insert);
    await conn.commit();
    await file.unlink(tmp);
    res.json({
        status: true,
        msg: '导入用户成功！'
    });
});

app.post('/import-ifdean', receiver, async (req, res) => {
    let { mode } = req.body,
        { path: tmp } = req.file,
        sql_update1 = `UPDATE teacher SET ifDean='否';`,
        sql_update2 = `UPDATE teacher SET ifDean='是' WHERE schoolNum in `;
    let wb = new exceljs.Workbook();
    await wb.xlsx.readFile(tmp);
    let ws = wb.getWorksheet(1);
    let teachers = [];
    for (let i = 2; i <= ws.rowCount; i++) {
        let r = ws.getRow(i).values;
        teachers.push(r[2]);//读第二栏工号
    }

    let conn = await mysql.transaction();
    if (mode == 'overwrite') {
        await conn.query(sql_update1);
    }
    await conn.query(sql_update2 + `('${teachers.join("','")}')`);
    await conn.commit();
    await file.unlink(tmp);
    res.json({
        status: true,
        msg: '导入负责人信息成功！'
    });
});

app.post('/import-postgraduate', receiver, async (req, res) => {
    let { mode } = req.body,
        { path: tmp } = req.file,
        sql_update1 = `UPDATE student SET postGraduate='否';`,
        sql_update2 = `UPDATE student SET postGraduate='是' WHERE schoolNum in `;
    let wb = new exceljs.Workbook();
    await wb.xlsx.readFile(tmp);
    let ws = wb.getWorksheet(1);
    let students = [];
    for (let i = 2; i <= ws.rowCount; i++) {
        let r = ws.getRow(i).values;
        students.push(r[2]);//读第二栏学号
    }

    let conn = await mysql.transaction();
    if (mode == 'overwrite') {
        await conn.query(sql_update1);
    }
    await conn.query(sql_update2 + `('${students.join("','")}')`);
    await conn.commit();
    await file.unlink(tmp);
    res.json({
        status: true,
        msg: '导入保研信息成功！'
    });
});

const mysqlConfig = global.config.mysql;

app.get('/data-backup', async (req, res) => {
    let filename = path.resolve(__dirname, 'backup.sql');
    child_process.exec(`mysqldump -u${mysqlConfig.user} -p${mysqlConfig.password} -B app > ${filename}`, { timeout: 10000 }, err => {
        if (err) {
            console.error(err);
            res.json({
                status: false,
                msg: '数据库备份出错！'
            });
        } else {
            res.json({
                status: true,
                msg: '数据库备份成功！'
            });
        }
    });
});

app.get('/data-recovery', async (req, res) => {
    let filename = path.resolve(__dirname, 'backup.sql');
    if (file.exists(filename)) {
        child_process.exec(`mysql -u${mysqlConfig.user} -p${mysqlConfig.password} -B app < ${filename}`, { timeout: 10000 }, err => {
            if (err) {
                console.error(err);
                res.json({
                    status: false,
                    msg: '数据库恢复出错！'
                });
            } else {
                res.json({
                    status: true,
                    msg: '数据库恢复成功！'
                });
            }
        });
    } else {
        res.json({
            status: false,
            msg: '没有数据库备份！'
        });
    }
});

app.get('/comments-total', async (req, res) => {
    let sql_query = 'SELECT COUNT(*) total FROM comment';
    let result = await mysql.query(sql_query);
    res.json({
        status: true,
        total: result[0].total
    });
});

app.get('/comments-list', async (req, res) => {
    let { length: limit, start: offset } = req.query,
        sql_query = 'SELECT * FROM comment ORDER BY time DESC LIMIT ? OFFSET ?';
    let result = await mysql.query(sql_query, [Number(limit), Number(offset)]);
    res.json({
        status: true,
        comments: result
    });
});

app.post('/submit-feedback', async (req, res) => {
    let { content, star } = req.body,
        sql_insert = "INSERT INTO comment (star,time,content) VALUES (?,NOW(),?)";

    let rst = await mysql.query(sql_insert, [Number(star) || 5, content]);
    res.json({
        status: true,
        msg: '发表反馈成功！',
        id: rst.insertId
    });
});

module.exports = app;