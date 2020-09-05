const { scripts } = global.config.files;
const express = require('express');
const mysql = require(`${scripts}/mysql`);
const util = require(`${scripts}/util`);

const app = express();

//可以修改一下查询语句
app.get('/info', async (req, res) => {
    let { identity, uid } = req.session,
        sql_query = 'SELECT * FROM ?? WHERE id=?';
    let [user] = await mysql.query(sql_query, [identity, uid]);
    delete user.id;
    delete user.password;
    if (user.group) user.group = user.group.substr(2);
    user = util.dataFilter(user, ['wechat', 'tel', 'homepage', 'resume', 'office', 'field']);
    res.json({
        status: true,
        user
    });
});

app.post('/set-email', async (req, res) => {
    let { identity, uid } = req.session,
        { email, pinCode } = req.body,
        sql_update = 'UPDATE ?? SET email=? WHERE id=?';
    if (util.pinValidate(req.session.pin, pinCode)) {
        await mysql.query(sql_update, [identity, email, uid]);
        req.session.pin = null;
        res.json({
            status: true,
            msg: '绑定邮箱成功！'
        });
    } else {
        throw 1102;
    }
});

app.post('/set-password', async (req, res) => {
    let { identity, uid } = req.session,
        { oldPW, newPW } = req.body,
        sql_query = 'SELECT 1 FROM ?? WHERE id=? AND password=?',
        sql_update = 'UPDATE ?? SET password=? WHERE id=?';
    let result = await mysql.query(sql_query, [identity, uid, oldPW]);
    if (result.length) {
        await mysql.query(sql_update, [identity, newPW, uid]);
        res.json({
            status: true,
            msg: '修改密码成功，请重新登陆！'
        });
    } else {
        throw 1002;
    }
});

const fieldsMap = {
    student: ['wechat', 'tel', 'homepage', 'resume'],
    teacher: ['wechat', 'tel', 'homepage', 'resume', 'field', 'office'],
    admin: ['tel']
};
app.post('/perfect-info', async (req, res) => {
    let { identity, uid } = req.session,
        sql_update = 'UPDATE ?? SET ? WHERE id=?',
        param = {};

    param = util.dataExtracter(req.body, param, fieldsMap[identity]);
    await mysql.query(sql_update, [identity, param, uid]);
    res.json({
        status: true,
        msg: '已更新信息！'
    });
});

module.exports = app;