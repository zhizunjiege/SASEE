const { scripts } = global.config.files;
const express = require('express');
const path = require('path');
const exceljs = require('exceljs');
const multer = require('multer');

const file = require(`${scripts}/file`);
const mysql = require(`${scripts}/mysql`);

const templates = require('./templates/manifest.json');

const app = express();

app.get('/get-class-teacher', async (req,res) => {
    let sql_query = 'SELECT DISTINCT `class` FROM student WHERE `group` != "7-高工" ORDER BY `class`;SELECT id,`name` FROM teacher WHERE ifHead="是"';
    let rst = await mysql.query(sql_query);
    let classes = rst[0].map(i => {
        return i.class;
    });
    let teachers = rst[1].map(i => {
        return {
            val: i.id,
            des: i.name
        };
    });
    classes.push('高工');
    res.json({
        status: true,
        classes,
        teachers
    })
});

app.get('/class-query', async (req,res) => {
    let { identity, uid } = req.session,
        sql_query = {
            student: 'SELECT s1.id FROM scsx s1 INNER JOIN student s2 ON s1.`class`=s2.class OR s1.`class`=SUBSTR(s2.`group`,3) WHERE s2.id=?',
            teacher: 'SELECT id FROM scsx WHERE teacher=?'
        };
    let cid = -1,
        rst = await mysql.query(sql_query[identity], uid);
    if (rst.length) {
        cid = rst[0].id;
    }
    res.json({
        status: true,
        cid
    });
});

app.get('/class-info', async (req,res) => {
    let { cid, mode } = req.query,
        sql_query1 = 'SELECT s.id,`class`,specialty,t.`name` teacher,mode,place,employer,startTime,endTime,(SELECT COUNT(*) FROM student WHERE `class`=s.`class` AND gender="男") male,(SELECT COUNT(*) FROM student WHERE `class`=s.`class` AND gender="女") female FROM scsx s INNER JOIN teacher t ON s.teacher=t.id WHERE s.id=?',
        sql_query2 = 'SELECT * FROM scsx WHERE id=?';
    let [c] = await mysql.query(mode == 'detail' ? sql_query1 : sql_query2, cid);
    res.json({
        status: true,
        c
    });
});

app.get('/class-manage', async (req,res) => {
    let sql_query = 'SELECT s.id,`class`,specialty,t.`name` teacher,mode,place,employer,startTime,endTime FROM scsx s INNER JOIN teacher t ON s.teacher=t.id ORDER BY `class`';
    let classes = await mysql.query(sql_query);
    res.json({
        status: true,
        classes
    });
});

app.post('/class-add', async (req,res) => {
    let data = req.body,
        sql_insert = 'INSERT INTO scsx SET ?';
    await mysql.query(sql_insert, data);
    res.json({
        status: true,
        msg: '小组增加成功！'
    });
});

app.post('/class-edit', async (req,res) => {
    let data = req.body,
        sql_update = 'UPDATE scsx SET ? WHERE id=?';
    let id = data.id;
    delete data.id;
    await mysql.query(sql_update, [data, id]);
    res.json({
        status: true,
        msg: '小组修改成功！'
    });
});

app.post('/class-remove', async (req,res) => {
    let { cid } = req.body,
        sql_delete = 'DELETE FROM scsx WHERE id in ' + `(${cid.join(',')})`;

    await mysql.query(sql_delete);
    res.json({
        status: true,
        msg: '删除小组成功！'
    });
});

app.get('/task-manage', async (req,res) => {
    let { uid } = req.session,
        sql_query1 = 'SELECT id FROM scsx WHERE teacher=?',
        sql_query2 = 'SELECT id,mode,deadline,title,(SELECT COUNT(*) FROM scsx_report WHERE task_id=t.id) submitted FROM scsx_task t WHERE scsx_id=?';
    let rst = await mysql.query(sql_query1, uid);
    let id = -1, tasks = [];
    if (rst[0] && rst[0].id) {
        id = rst[0].id;
        tasks = await mysql.query(sql_query2, id);
    }
    res.json({
        status: true,
        id,
        tasks
    });
});

app.get('/task-info', async (req,res) => {
    let { tid } = req.query,
        sql_query = 'SELECT id,mode,deadline,title,description FROM scsx_task WHERE id=?';
    let [t] = await mysql.query(sql_query, tid);
    res.json({
        status: true,
        t
    });
});

app.post('/task-add', async (req,res) => {
    let { uid } = req.session,
        data = req.body,
        sql_query = 'SELECT id FROM scsx WHERE teacher=?',
        sql_insert = 'INSERT INTO scsx_task SET ?';
    let [{ id }] = await mysql.query(sql_query, uid);
    data.scsx_id = id;
    let rst = await mysql.query(sql_insert, data);
    await file.mkdir(path.resolve(__dirname, 'reports', '' + rst.insertId));
    res.json({
        status: true,
        msg: '任务新增成功！'
    });
});

app.post('/task-edit', async (req,res) => {
    let data = req.body,
        sql_update = 'UPDATE scsx_task SET ? WHERE id=?';
    let id = data.id;
    delete data.id;
    delete data.scsx_id;
    await mysql.query(sql_update, [data, id]);
    res.json({
        status: true,
        msg: '任务修改成功！'
    });
});

app.post('/task-remove', async (req,res) => {
    let { tid } = req.body,
        sql_delete = 'DELETE FROM scsx_task WHERE id in ' + `(${tid.join(',')})`;
    let promises = [];
    await mysql.query(sql_delete);
    for (const i of tid) {
        promises.push(file.rmdir(path.resolve(__dirname, 'reports', '' + i)), { recursive: true });
    }
    await Promise.allSettled(promises);
    res.json({
        status: true,
        msg: '删除任务成功！'
    });
});

app.get('/task-detail', async (req,res) => {
    let { tid } = req.query,
        sql_query = 'SELECT s1.id,s1.score,s1.filename,s1.time,s2.`name`,s2.schoolNum FROM scsx_report s1,student s2 WHERE s1.task_id=? AND s1.student=s2.id;SELECT s2.`name` FROM scsx s1,student s2,scsx_task t WHERE t.id=? AND t.scsx_id=s1.id AND s1.`class`=s2.`class` AND NOT EXISTS (SELECT 1 FROM scsx_report s3 WHERE s2.id=s3.student AND s3.task_id=t.id);';
    let rst = await mysql.query(sql_query, [tid, tid]);
    res.json({
        status: true,
        submitted: rst[0],
        unsubmitted: rst[1].map(i => {
            return i.name
        })
    });
});

app.post('/task-score', async (req,res) => {
    let { scores } = req.body,
        sql_update = '';
    for (const i of scores) {
        sql_update += `UPDATE scsx_report SET score='${i.score}' WHERE id=${i.id};`;
    }
    let conn = await mysql.transaction();
    await conn.query(sql_update);
    await conn.commit();
    res.json({
        status: true,
        msg: '评分成功！'
    });
});

app.get('/download-report', async (req,res) => {
    let { task_id, report_id, filename } = req.query,
        from = path.resolve(__dirname, 'reports', '' + task_id, `${report_id}--${filename}`);

    await res.download(from, filename);
});

app.get('/task-list', async (req,res) => {
    let { uid } = req.session,
        { tid } = req.query,
        sql_query1 = 'SELECT t.id, title, deadline,description,`mode`, filename,time, score FROM scsx_task t LEFT JOIN scsx_report s ON s.task_id = t.id WHERE t.id=?',
        sql_query2 = 'SELECT t.id, title, deadline, t.`mode`,filename ,time, score FROM scsx_task t LEFT JOIN scsx_report s ON s.task_id = t.id INNER JOIN scsx ON t.scsx_id = scsx.id INNER JOIN student ON scsx.`class` = student.`class` WHERE student.id = ?';
    if (tid) {
        let [t] = await mysql.query(sql_query1, tid);
        res.json({
            status: true,
            t
        });
    } else {
        let tasks = await mysql.query(sql_query2, uid);
        res.json({
            status: true,
            tasks
        });
    }
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
const receiver = upload.single('file');

app.post('/upload-report', receiver, async (req,res) => {
    let { uid } = req.session,
        { tid } = req.body,
        { filename, path: from } = req.file,
        sql_query = 'SELECT id,filename FROM scsx_report WHERE task_id=? AND student=?',
        sql_insert = 'INSERT INTO scsx_report (task_id,student,filename,time) VALUES (?,?,?,NOW())',
        sql_update = 'UPDATE scsx_report SET filename=?,time=NOW() WHERE id=?';
    let [rst] = await mysql.query(sql_query, [tid, uid]);
    let id, to = path.resolve(__dirname, 'reports', '' + tid);
    if (rst) {
        await mysql.query(sql_update, [filename, rst.id]);
        await file.unlink(path.resolve(to, `${rst.id}--${rst.filename}`));
        id = rst.id;
    } else {
        let { insertId } = await mysql.query(sql_insert, [tid, uid, filename]);
        id = insertId;
    }
    await file.move(from, path.resolve(to, `${id}--${filename}`));
    res.json({
        status: true,
        msg: '上传报告成功！'
    });
});

const templatesDirname = path.resolve(__dirname, 'templates');

async function saveTemplates() {
    await file.writeJson(path.resolve(templatesDirname, 'manifest.json'), templates);
}

app.get('/docs-templates', async (req,res) => {
    let { identity } = req.session;
    res.json({
        status: true,
        docs: identity == 'admin' ? templates : templates[identity]
    });
});

let _count = 0;
app.get('/download-docs', async (req,res) => {
    let { index, filename } = req.query,
        { identity } = req.session;
    templates[identity][Number(index)].count++;
    if (++_count > 20) {
        await saveTemplates();
        _count = 0;
    }
    await res.download(path.resolve(templatesDirname, filename));
});

app.post('/add-doc', receiver, async (req,res) => {
    let { identity } = req.body,
        { filename, path: from } = req.file;
    let to = path.resolve(templatesDirname, filename);
    templates[identity].push({
        filename,
        time: new Date().toLocaleISOString(),
        count: 0
    });
    await file.move(from, to);
    await saveTemplates();
    res.json({
        status: true,
        msg: '新增文档成功！'
    });
});

app.post('/edit-doc', receiver, async (req,res) => {
    let { identity, index } = req.body,
        { filename, path: from } = req.file;
    let ref = templates[identity][index];
    let to = path.resolve(templatesDirname, ref.filename);
    await file.unlink(to);
    to = path.resolve(templatesDirname, filename);
    ref.filename = filename;
    ref.time = new Date().toLocaleISOString();
    ref.count = 0;
    await file.move(from, to);
    await saveTemplates();
    res.json({
        status: true,
        msg: '修改文档成功！'
    });
});

app.post('/remove-doc', async (req,res) => {
    let { indexes, identity } = req.body;
    for (const i of indexes) {
        await file.unlink(path.resolve(templatesDirname, templates[identity][i].filename));
        templates[identity].splice(i, 1);
    }
    await saveTemplates();
    res.json({
        status: true,
        msg: '删除文档成功！'
    });
});


/* app.get('/export-table', async (req,res) => {
        let sql_query = 'SELECT SUBSTR(`class`,3) `class`,num,time,place,description,capacity,JSON_LENGTH(students) chosen,(SELECT GROUP_CONCAT(t.`name` SEPARATOR ",") FROM teacher t WHERE JSON_CONTAINS(k.teachers,	CONCAT("",t.id))) teachers,(SELECT GROUP_CONCAT(s.`name` SEPARATOR ",") FROM student s WHERE JSON_CONTAINS(k.students,	CONCAT("",s.id))) students FROM kcsj k ORDER BY `class`';
        let table = await mysql.query(sql_query);
 
        let tableWB = new exceljs.Workbook(), tableWS = tableWB.addWorksheet('sheet1');
        let style = {
            font: {
                name: '宋体',
                size: 10,
            },
            alignment: {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true
            }
        };
        tableWS.columns = [{ header: '所属方向', key: 'class', width: 20, style }, { header: '分组序号', key: 'num', width: 10, style }, { header: '上课时间', key: 'time', width: 20, style }, { header: '上课地点', key: 'place', width: 20, style }, { header: '分组简介', key: 'description', width: 40, style }, { header: '容量', key: 'capacity', width: 10, style }, { header: '已选', key: 'chosen', width: 10, style }, { header: '教师名单', key: 'teachers', width: 40, style }, { header: '学生名单', key: 'students', width: 40, style }];
 
        tableWS.addRows(table);
        tableWS.getRow(1).font = { name: '华文行楷', size: 12 };
        tableWS.eachRow(function (row, index) {
            row.height = 40;
        });
 
        let time = new Date();
        let tmp = path.resolve(__dirname, 'backup', `${time.getFullYear()}年自动化科学与电气工程学院本科生课程设计与综合实验分组情况汇总表-${time.toLocaleDateString()}.xlsx`);
        await tableWB.xlsx.writeFile(tmp);
        await res.download(tmp);
}); */

module.exports = app;