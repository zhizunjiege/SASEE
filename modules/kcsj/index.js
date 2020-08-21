const express = require('express');
const path = require('path');
const exceljs = require('exceljs');

const mysql = require('../../scripts/mysql');

const app = express();

app.get('/group-choose', (req, res) => {
    let { uid } = req.session,
        sql_query = 'SELECT k.id,k.num,SUBSTR(k.`group`,3) `group`,k.time,k.place,k.capacity,JSON_LENGTH(k.students) chosen FROM kcsj k INNER JOIN student s ON k.`group`=s.`group`||s.`group`="7-高工" WHERE s.id=?';
    res.do(async () => {
        let groups = await mysql.find(sql_query, uid);
        res.json({
            status: true,
            groups
        });
    });
});

app.get('/users', (req, res) => {
    let { identity, group } = req.query,
        sql_query1 = 'SELECT id,name FROM ?? WHERE `group`=?',
        sql_query2 = 'SELECT u1.id,u1.name FROM ?? u1 INNER JOIN ?? u2 ON u1.`group`=u2.`group` WHERE u2.id=?';
    res.do(async () => {
        let users = null;
        if (req.session.identity == 'admin') {
            users = await mysql.find(sql_query1, [identity, group]);
        } else {
            users = await mysql.find(sql_query2, [identity, identity, req.session.uid]);
        }
        res.json({
            status: true,
            users
        });
    });
});

app.get('/group-query', (req, res) => {
    let { identity, uid } = req.session,
        sql_query = `SELECT id FROM kcsj WHERE JSON_CONTAINS(${identity}s,"${uid}")`;
    res.do(async () => {
        let gid = 0,
            rst = await mysql.find(sql_query);
        if (rst.length) {
            gid = rst[0].id;
        }
        res.json({
            status: true,
            gid
        });
    });
});

app.get('/group-info', (req, res) => {
    let { gid, name } = req.query,
        sql_query1 = 'SELECT * FROM kcsj WHERE id=?',
        sql_query2 = 'SELECT GROUP_CONCAT(`name` SEPARATOR ",") users FROM ?? WHERE id in (?)';
    res.do(async () => {
        let [group] = await mysql.find(sql_query1, gid);
        if (name) {
            group.teachers = (await mysql.find(sql_query2, ['teacher', group.teachers]))[0].users;
            if (group.students.length) {
                group.students = (await mysql.find(sql_query2, ['student', group.students]))[0].users;
            } else {
                group.students = '';
            }
        }
        res.json({
            status: true,
            group
        });
    });
});

app.get('/group-manage', (req, res) => {
    let { uid } = req.session,
        sql_query1 = 'SELECT * FROM kcsj',
        sql_query2 = 'SELECT k.* FROM kcsj k INNER JOIN teacher t ON k.`group`=t.`group` WHERE t.id=?';
    res.do(async () => {
        let groups = null;
        if (req.session.identity == 'admin') {
            groups = await mysql.find(sql_query1);
        } else {
            groups = await mysql.find(sql_query2, uid);
        }
        res.json({
            status: true,
            groups
        });
    });
});

app.post('/group-add', (req, res) => {
    let data = req.body,
        sql_query = 'SELECT `group` FROM teacher WHERE id=?',
        sql_insert = 'INSERT INTO kcsj SET ?';
    res.do(async () => {
        data.teachers = JSON.stringify(data.teachers);
        data.students = JSON.stringify(data.students || []);
        if (req.session.identity == 'teacher') {
            data.group = (await mysql.find(sql_query, req.session.uid))[0].group;
        }
        await mysql.find(sql_insert, data);
        res.json({
            status: true,
            msg: '分组增加成功！'
        });
    });
});

app.post('/group-edit', (req, res) => {
    let data = req.body,
        sql_update = 'UPDATE kcsj SET ? WHERE id=?';
    res.do(async () => {
        let id = data.id;
        data.teachers = JSON.stringify(data.teachers);
        data.students = JSON.stringify(data.students);
        delete data.id;
        await mysql.find(sql_update, [data, id]);
        res.json({
            status: true,
            msg: '分组修改成功！'
        });
    });
});

app.get('/group-remove', (req, res) => {
    let { gid } = req.query,
        sql_delete = 'DELETE FROM kcsj WHERE id=?';
    res.do(async () => {
        await mysql.find(sql_delete, gid);
        res.json({
            status: true,
            msg: '删除成功！'
        });
    });
});

app.post('/choose', (req, res) => {
    let { gid } = req.body,
        { uid } = req.session,
        sql_query1 = 'SELECT capacity,JSON_LENGTH(students) chosen FROM kcsj WHERE id=?',
        sql_query2 = 'SELECT id,students FROM kcsj WHERE JSON_CONTAINS(students,"?")',
        sql_update1 = 'UPDATE kcsj SET students=? WHERE id=?',
        sql_update2 = 'UPDATE kcsj SET students=JSON_ARRAY_APPEND(students,"$",?) WHERE id=?';
    res.do(async () => {
        let conn = await mysql.transaction();
        let [{ capacity, chosen }] = await conn.find(sql_query1, gid);
        if (capacity <= chosen) {
            res.json({
                status: false,
                msg: '分组名额已满，请选择其他分组！'
            });
        } else {
            let rst = await conn.find(sql_query2, uid);
            if (rst.length) {
                await conn.find(sql_update1, [JSON.stringify(rst[0].students.remove(uid)), rst[0].id]);
            }
            await conn.find(sql_update2, [uid, gid]);
            await conn.commitPromise();
            res.json({
                status: true,
                msg: '选择分组成功！'
            });
        }
    });
});

app.get('/truncate', (req, res) => {
    let sql_truncate = 'TRUNCATE TABLE kcsj';
    res.do(async () => {
        await mysql.find(sql_truncate);
        res.json({
            status: true,
            msg: '数据全部删除成功！'
        });
    });
});

app.get('/export-table', (req, res) => {
    res.do(async () => {
        let sql_query = 'SELECT SUBSTR(`group`,3) `group`,num,time,place,description,capacity,JSON_LENGTH(students) chosen,(SELECT GROUP_CONCAT(t.`name` SEPARATOR ",") FROM teacher t WHERE JSON_CONTAINS(k.teachers,	CONCAT("",t.id))) teachers,(SELECT GROUP_CONCAT(s.`name` SEPARATOR ",") FROM student s WHERE JSON_CONTAINS(k.students,	CONCAT("",s.id))) students FROM kcsj k ORDER BY `group`';
        let table = await mysql.find(sql_query);

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
        res.download(tmp, err => {
            if (err) {
                throw err;
            }
        });
    });
});

module.exports = app;