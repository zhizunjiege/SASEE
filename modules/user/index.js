const express = require('express'),
    { mysql, util } = superApp.requireUserModules(['mysql', 'util']);

const app = express();

function getComponentName(identity, component) {
    switch (component) {
        case 'user-info':
        case 'perfect-info': return `${component}-${identity}.js`;
        default: return component + '.js';
    }
}

//可以修改一下查询语句
app.get('/info', (req, res) => {
    let { identity, uid } = req.session,
        sql_query = 'SELECT * FROM ?? WHERE id=?';
    res.do(async () => {
        let [user] = await mysql.find(sql_query, [identity, uid]);
        delete user.id;
        delete user.password;
        if (user.group) user.group = user.group.substr(2);
        user = util.dataFilter(user, ['wechat', 'tel', 'homepage', 'resume', 'office', 'field']);
        res.json({
            status: true,
            user
        });
    });
});

app.post('/set-email', (req, res) => {
    let { identity, uid } = req.session,
        { email, pinCode } = req.body,
        sql_update = 'UPDATE ?? SET email=? WHERE id=?';
    res.do(async () => {
        if (util.pinValidate(req.session.pin, pinCode)) {
            await mysql.find(sql_update, [identity, email, uid]);
            req.session.pin = null;
            res.json({
                status: true,
                msg: '绑定邮箱成功！'
            });
        } else {
            throw 1102;
        }
    });
});

app.post('/set-password', (req, res) => {
    let { identity, uid } = req.session,
        { oldPW, newPW } = req.body,
        sql_query = 'SELECT 1 FROM ?? WHERE id=? AND password=?',
        sql_update = 'UPDATE ?? SET password=? WHERE id=?';
    res.do(async () => {
        let result = await mysql.find(sql_query, [identity, uid, oldPW]);
        if (result.length) {
            await mysql.find(sql_update, [identity, newPW, uid]);
            res.json({
                status: true,
                msg: '修改密码成功，请重新登陆！'
            });
        } else {
            throw 1002;
        }
    });
});

const fieldsMap = {
    student: ['wechat', 'tel', 'homepage', 'resume'],
    teacher: ['wechat', 'tel', 'homepage', 'resume', 'field', 'office'],
    admin: ['tel']
};
app.post('/perfect-info', (req, res) => {
    let { identity, uid } = req.session,
        sql_update = 'UPDATE ?? SET ? WHERE id=?',
        param = {};

    res.do(async () => {
        param = util.dataExtracter(req.body, param, fieldsMap[identity]);
        await mysql.find(sql_update, [identity, param, uid]);
        res.json({
            status: true,
            msg: '已更新信息！'
        });
    });
});

module.exports = { getComponentName, app, route: '/user' };