const express = require('express');
const path = require('path');
const multer = require('multer');
const child_process = require('child_process');
const exceljs = require('exceljs');

const mysql = require('../../scripts/mysql');
const file = require('../../scripts/file');

const CONFIG = require('./config.json');

const app = express();

app.get('/news-content', (req, res) => {
    let { id } = req.query;
    res.do(async () => {
        res.sendFile(`${id}.html`, { root: `${__dirname}/resources/html/news` });
    });
});

app.get('/manual', (req, res) => {
    let identity = req.query.identity || req.session.identity;
    res.do(async () => {
        res.sendFile(`${identity}.html`, { root: `${__dirname}/resources/html/manual` });
    });
});

app.get('/img', (req, res) => {
    res.do(async () => {
        res.sendFile(req.query.file, { root: `${__dirname}/resources/img` });
    });
});

app.get('/news-list', (req, res) => {
    let { length: limit, start: offset } = req.query,
        sql_query = 'SELECT * FROM news ORDER BY top DESC,id DESC LIMIT ? OFFSET ?';
    res.do(async () => {
        let result = await mysql.find(sql_query, [Number(limit), Number(offset)]);
        res.json({
            status: true,
            news: result
        });
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

app.post('/write-news', receiver, (req, res) => {
    let { top, title, content } = req.body,
        sql_insert = 'INSERT INTO news (top,title,date) VALUES (?,?,CURDATE())';
    res.do(async () => {
        let rst = await mysql.find(sql_insert, [top, title]);
        await file.writeFile(`${__dirname}/resources/html/news/${rst.insertId}.html`, content);
        res.json({
            status: true,
            msg: '通知发布成功！'
        });
    });
});

app.post('/write-license', receiver, (req, res) => {
    let { content } = req.body;
    res.do(async () => {
        await file.writeFile(`${__dirname}/resources/html/license.html`, content);
        res.json({
            status: true,
            msg: '协议发布成功！'
        });
    });
});

app.post('/write-manual', receiver, (req, res) => {
    let b = req.body;
    res.do(async () => {
        for (const k of Object.keys(b)) {
            await file.writeFile(`${__dirname}/resources/html/manual/${k}.html`, b[k]);
        }
        res.json({
            status: true,
            msg: '手册发布成功！'
        });
    });
});

app.get('/user-manage', (req, res) => {
    let sql_query = 'SELECT id,name,gender,schoolNum,specialty,SUBSTR(`group`,3) `group`,class,postGraduate FROM student;SELECT id,name,gender,schoolNum,proTitle,SUBSTR(`group`,3) `group`,department,ifDean,ifHead FROM teacher;SELECT id,name,gender,priv FROM admin;';
    res.do(async () => {
        let users = await mysql.find(sql_query);
        res.json({
            status: true,
            users
        });
    });
});

app.post('/add-user', (req, res) => {
    let { identity, info } = req.body,
        sql_insert = 'INSERT INTO ?? SET ?';
    if ('group' in info) {
        info.group = `${CONFIG.group[info.group || 0]}-${info.group}`;
    }
    res.do(async () => {
        let rst = await mysql.find(sql_insert, [identity, info]);
        res.json({
            status: true,
            msg: '增加用户成功！',
            insertId: rst.insertId
        });
    });
});

app.post('/edit-user', (req, res) => {
    let { id, identity, info } = req.body,
        sql_update = 'UPDATE ?? SET ? WHERE id=?';
    if ('group' in info) {
        info.group = `${CONFIG.group[info.group] || 0}-${info.group}`;
    }
    res.do(async () => {
        await mysql.find(sql_update, [identity, info, id]);
        res.json({
            status: true,
            msg: '修改用户信息成功！'
        });
    });
});

app.post('/del-user', (req, res) => {
    let { id, identity } = req.body,
        sql_update = 'DELETE FROM ?? WHERE id in ' + `(${id.join(',')})`;
    res.do(async () => {
        await mysql.find(sql_update, identity);
        res.json({
            status: true,
            msg: '删除用户成功！'
        });
    });
});

app.post('/import-user', receiver, (req, res) => {
    let { identity, mode } = req.body,
        { path: tmp } = req.file,
        sql_truncate = 'TRUNCATE TABLE ??',
        sql_insert = `INSERT INTO ${identity} (name,gender,schoolNum,\`group\`,${identity == 'teacher' ? 'proTitle,department,ifDean,ifHead' : 'specialty,`class`,postGraduate'}) VALUES `;
    res.do(async () => {
        let wb = new exceljs.Workbook();
        await wb.xlsx.readFile(tmp);
        let ws = wb.getWorksheet(1);

        for (let i = 2; i <= ws.rowCount; i++) {
            let r = ws.getRow(i).values;
            sql_insert += `('${r[1]}','${r[2]}','${r[3]}','${CONFIG.group[r[4]]}-${r[4]}','${r[5]}','${r[6]}','${r[7]}'${identity == 'teacher' ? `,'${r[8]}'` : ''})${i == ws.rowCount ? '' : ','}`;
        }

        let conn = await mysql.transaction();
        if (mode == 'overwrite') {
            await conn.find(sql_truncate, identity);
        }
        await conn.find(sql_insert);
        await conn.commitPromise();
        await file.unlink(tmp);
        res.json({
            status: true,
            msg: '导入用户成功！'
        });
    });
});

app.get('/data-backup', (req, res) => {
    let filename = path.resolve(__dirname, 'backup.sql');
    if (file.exists(filename)) {
        child_process.exec(`mysqldump -uroot -pjason -B app > ${filename}`, { timeout: 10000 }, err => {
            if (err) {
                console.log(err);
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
    } else {
        res.json({
            status: true,
            msg: '没有数据库备份！'
        });
    }
});

app.get('/data-recovery', (req, res) => {
    let filename = path.resolve(__dirname, 'backup.sql');
    child_process.exec(`mysql -uroot -pjason -B app < ${filename}`, { timeout: 10000 }, err => {
        if (err) {
            console.log(err);
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
});

module.exports = app;