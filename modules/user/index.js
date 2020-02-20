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

app.get('/info', (req, res) => {
    let { identity, userId } = req.session,
        sql_query = 'SELECT * FROM ?? WHERE id=?';
    res.do(async () => {
        let [user] = await mysql.find(sql_query, [identity, userId]);
        delete user.id;
        delete user.password;
        if (identity == 'student') {
            delete user.target1; delete user.target2; delete user.target3;
        }
        if (user.group) user.group = user.group.substr(2);
        if (!user.wechat) delete user.wechat;
        if (!user.tel) delete user.tel;
        if (!user.homepage) delete user.homepage;
        if (!user.resume) delete user.resume;
        if (!user.office) delete user.office;
        if (!user.field) delete user.field;
        res.json({
            status: true,
            user
        });
    });
});

app.post('/set-email', (req, res) => {
    let { identity, userId } = req.session,
        { email, pinCode } = req.body,
        sql_update = 'UPDATE ?? SET email=? WHERE id=?';
    res.do(async () => {
        if (util.pinValidate(req.session.pin, pinCode)) {
            await mysql.find(sql_update, [identity, email, userId]);
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
    let { identity, userId } = req.session,
        { oldPW, newPW } = req.body,
        sql_query = 'SELECT 1 FROM ?? WHERE id=? AND password=?',
        sql_update = 'UPDATE ?? SET password=? WHERE id=?';
    res.do(async () => {
        let result = await mysql.find(sql_query, [identity, userId, oldPW]);
        if (result.length) {
            await mysql.find(sql_update, [identity, newPW, userId]);
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
    let { identity, userId } = req.session,
        sql_update = 'UPDATE ?? SET ? WHERE id=?',
        param = {};

    res.do(async () => {
        for (const value of fieldsMap[identity]) {
            if (req.body[value]) {
                param[value] = req.body[value];
            }
        }
        await mysql.find(sql_update, [identity, param, userId]);
        res.json({
            status: true,
            msg: '已更新信息！'
        });
    });
});

module.exports = { getComponentName, app, route: '/user' };