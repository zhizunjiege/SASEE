const { scripts } = global.config.files;
const express = require('express');
const path = require('path');
const exceljs = require('exceljs');
const schedule = require('node-schedule');

const mysql = require(`${scripts}/mysql`);
const file = require(`${scripts}/file`);

const app = express();

const timeFile = path.resolve(__dirname, 'time.json');

const CALLBACKS = {
    async close() {
        let time = await file.readJson(timeFile);
        time.CHOOSEUSABLE = false;
        console.log('课程设计--切换选择状态为--关闭');
        return file.writeJson(timeFile, time);
    },
    async open() {
        let time = await file.readJson(timeFile);
        time.CHOOSEUSABLE = true;
        console.log('课程设计--切换选择状态为--打开');
        return file.writeJson(timeFile, time);
    },
}

app.get('/group-choose', async (req, res) => {
    let { uid, identity } = req.session,
        sql_query = 'SELECT k.id,k.num,SUBSTR(k.`group`,3) `group`,k.time,k.place,k.capacity,JSON_LENGTH(k.students) chosen FROM kcsj k INNER JOIN student s ON k.`group`=s.`group`||s.`group`="7-高工" WHERE s.id=?';

    let time = await file.readJson(timeFile);
    if (identity == 'student' && !time.CHOOSEUSABLE) {
        res.json({
            status: false,
            msg: '未到选择时间！'
        });
    } else {
        let groups = await mysql.query(sql_query, uid);
        res.json({
            status: true,
            groups
        });
    }
});

app.get('/users', async (req, res) => {
    let { identity, group } = req.query,
        sql_query1 = 'SELECT id,name FROM ?? WHERE `group`=?',
        sql_query2 = 'SELECT u1.id,u1.name FROM ?? u1 INNER JOIN ?? u2 ON u1.`group`=u2.`group` WHERE u2.id=?';
    let users = null;
    if (req.session.identity == 'admin') {
        users = await mysql.query(sql_query1, [identity, group]);
    } else {
        users = await mysql.query(sql_query2, [identity, identity, req.session.uid]);
    }
    res.json({
        status: true,
        users
    });
});

app.get('/group-query', async (req, res) => {
    let { identity, uid } = req.session,
        sql_query = `SELECT id FROM kcsj WHERE JSON_CONTAINS(${identity}s,"${uid}")`;
    let gid = 0,
        rst = await mysql.query(sql_query);
    if (rst.length) {
        gid = rst[0].id;
    }
    res.json({
        status: true,
        gid
    });
});

app.get('/group-info', async (req, res) => {
    let { gid, name } = req.query,
        sql_query1 = 'SELECT * FROM kcsj WHERE id=?',
        sql_query2 = 'SELECT GROUP_CONCAT(`name` SEPARATOR ",") users FROM ?? WHERE id in (?)';
    let [group] = await mysql.query(sql_query1, gid);
    if (name) {
        group.teachers = (await mysql.query(sql_query2, ['teacher', group.teachers]))[0].users;
        if (group.students.length) {
            group.students = (await mysql.query(sql_query2, ['student', group.students]))[0].users;
        } else {
            group.students = '';
        }
    }
    res.json({
        status: true,
        group
    });
});

app.get('/group-manage', async (req, res) => {
    let { uid } = req.session,
        sql_query1 = 'SELECT * FROM kcsj',
        sql_query2 = 'SELECT k.* FROM kcsj k INNER JOIN teacher t ON k.`group`=t.`group` WHERE t.id=?';
    let groups = null;
    if (req.session.identity == 'admin') {
        groups = await mysql.query(sql_query1);
    } else {
        groups = await mysql.query(sql_query2, uid);
    }
    res.json({
        status: true,
        groups
    });
});

app.post('/group-add', async (req, res) => {
    let data = req.body,
        sql_query = 'SELECT `group` FROM teacher WHERE id=?',
        sql_insert = 'INSERT INTO kcsj SET ?';
    data.teachers = JSON.stringify(data.teachers);
    data.students = JSON.stringify(data.students || []);
    if (req.session.identity == 'teacher') {
        data.group = (await mysql.query(sql_query, req.session.uid))[0].group;
    }
    await mysql.query(sql_insert, data);
    res.json({
        status: true,
        msg: '分组增加成功！'
    });
});

app.post('/group-edit', async (req, res) => {
    let data = req.body,
        sql_update = 'UPDATE kcsj SET ? WHERE id=?';
    let id = data.id;
    data.teachers = JSON.stringify(data.teachers);
    data.students = JSON.stringify(data.students);
    delete data.id;
    await mysql.query(sql_update, [data, id]);
    res.json({
        status: true,
        msg: '分组修改成功！'
    });
});

app.get('/group-remove', async (req, res) => {
    let { gid } = req.query,
        sql_delete = 'DELETE FROM kcsj WHERE id=?';
    await mysql.query(sql_delete, gid);
    res.json({
        status: true,
        msg: '删除成功！'
    });
});

app.post('/choose', async (req, res) => {
    let { gid } = req.body,
        { uid } = req.session,
        sql_query1 = 'SELECT capacity,JSON_LENGTH(students) chosen FROM kcsj WHERE id=?',
        sql_query2 = 'SELECT id,students FROM kcsj WHERE JSON_CONTAINS(students,"?")',
        sql_update1 = 'UPDATE kcsj SET students=? WHERE id=?',
        sql_update2 = 'UPDATE kcsj SET students=JSON_ARRAY_APPEND(students,"$",?) WHERE id=?';
    let conn = await mysql.transaction();
    let [{ capacity, chosen }] = await conn.query(sql_query1, gid);
    if (capacity <= chosen) {
        res.json({
            status: false,
            msg: '分组名额已满，请选择其他分组！'
        });
    } else {
        let rst = await conn.query(sql_query2, uid);
        if (rst.length) {
            await conn.query(sql_update1, [JSON.stringify(rst[0].students.remove(uid)), rst[0].id]);
        }
        await conn.query(sql_update2, [uid, gid]);
        await conn.commit();
        res.json({
            status: true,
            msg: '选择分组成功！'
        });
    }
});

app.get('/truncate', async (req, res) => {
    let sql_truncate = 'TRUNCATE TABLE kcsj';
    await mysql.query(sql_truncate);
    res.json({
        status: true,
        msg: '数据全部删除成功！'
    });
});

let JOBS = {};

function registerJobs(open, close) {
    for (const i of Object.values(JOBS)) {
        i.cancel();
    }
    if (open) {
        schedule.scheduleJob(new Date(open), CALLBACKS.open);
    }
    if (close) {
        schedule.scheduleJob(new Date(close), CALLBACKS.close);
    }
    JOBS = schedule.scheduledJobs;
}

(() => {
    let time = require(timeFile);
    registerJobs(time.open, time.close);
})();

app.post('/date', async (req, res) => {
    let { open, close } = req.body;
    let time = await file.readJson(timeFile);

    time.open = open;
    time.close = close;
    registerJobs(open, close);
    await file.writeJson(timeFile, time);
    res.json({
        status: true,
        msg: '日期设置成功！'
    });
});

app.get('/state-info', async (req, res) => {
    let time = await file.readJson(timeFile);
    res.json({
        status: true,
        time
    });
});

app.post('/operation', async (req, res) => {
    let { mode } = req.body;
    await CALLBACKS[mode]();
    res.json({
        status: true,
        msg: '操作成功!'
    });
});

app.get('/export-table', async (req, res) => {
    let sql_query = 'SELECT SUBSTR(`group`,3) `group`,num,time,place,description,capacity,JSON_LENGTH(students) chosen,(SELECT GROUP_CONCAT(t.`name` SEPARATOR ",") FROM teacher t WHERE JSON_CONTAINS(k.teachers,	CONCAT("",t.id))) teachers,(SELECT GROUP_CONCAT(s.`name` SEPARATOR ",") FROM student s WHERE JSON_CONTAINS(k.students,	CONCAT("",s.id))) students FROM kcsj k ORDER BY `group`';
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
    tableWS.columns = [{ header: '所属方向', key: 'group', width: 20, style }, { header: '分组序号', key: 'num', width: 10, style }, { header: '上课时间', key: 'time', width: 20, style }, { header: '上课地点', key: 'place', width: 20, style }, { header: '分组简介', key: 'description', width: 40, style }, { header: '容量', key: 'capacity', width: 10, style }, { header: '已选', key: 'chosen', width: 10, style }, { header: '教师名单', key: 'teachers', width: 40, style }, { header: '学生名单', key: 'students', width: 40, style }];

    tableWS.addRows(table);
    tableWS.getRow(1).font = { name: '华文行楷', size: 12 };
    tableWS.eachRow(function (row, index) {
        row.height = 40;
    });

    let time = new Date();
    let tmp = path.resolve(__dirname, 'backup', `${time.getFullYear()}年自动化科学与电气工程学院本科生课程设计与综合实验分组情况汇总表-${time.toLocaleDateString()}.xlsx`);
    await tableWB.xlsx.writeFile(tmp);
    await res.download(tmp);
});

module.exports = app;