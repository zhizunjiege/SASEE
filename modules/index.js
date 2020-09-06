const { scripts, license } = global.config.files;
const express = require('express');
const path = require('path');

const mysql = require(`${scripts}/mysql`);
const email = require(`${scripts}/email`);
const file = require(`${scripts}/file`);
const util = require(`${scripts}/util`);

const app = express();

app.get('/query', (req, res) => {
    res.json({
        online: Boolean(req.session.uid)
    });
});
app.get('/serverTime', (req, res) => {
    res.json({
        status: true,
        time: Date.now()
    });
});
app.get('/license', (req, res) => {
    res.sendFile(license);
});

const identityDes = { student: '学生', teacher: '老师', admin: '管理员' };
app.post('/login', async (req, res) => {
    let { identity, username, password } = req.body,
        sql_query = `SELECT id,name,gender FROM ?? user WHERE username = ? AND password=?`;
    if (!util.paramValidate([username, password, identity])) {
        throw 1000;
    }
    let data = await mysql.query(sql_query, [identity, username, password]);
    if (!data.length) throw 1001;
    //设置session
    let [user] = data;
    req.session.uid = user.id;
    req.session.name = user.name;
    req.session.username = username;
    req.session.identity = identity;
    let profile = `${user.gender == '男' ? 'man' : 'woman'}_${identity}.png`;
    if (username == 'jason') {
        profile = 'coder_chen.png';
    }
    res.json({
        status: true,
        msg: '登陆成功！',
        user: {
            profile,
            name: user.name,
            identity: identityDes[identity]
        }
    });
});
app.post('/signup', async (req, res) => {
    let { identity, name, schoolNum, username, pinCode, password, email, wechat, tel, homepage, resume } = req.body,
        { pin } = req.session,
        sql_query = 'SELECT id,username FROM ?? WHERE name = ? AND schoolNum=?;SELECT 1 FROM ?? WHERE username=?',
        sql_update = 'UPDATE ?? SET ? WHERE id=?';
    let data = await mysql.query(sql_query, [identity, name, schoolNum, identity, username]);
    req.session.pin = null;
    if (!data[0].length) throw 1003;
    if (data[0][0].username) throw 1004;
    if (data[1].length) throw 1005;
    if (!util.pinValidate(pin, pinCode)) throw 1102;

    let params = { username, password, email };
    if (wechat) params.wechat = wechat;
    if (tel) params.tel = tel;
    if (homepage) params.homepage = homepage;
    if (resume) params.resume = resume;
    await mysql.query(sql_update, [identity, params, data[0][0].id]);
    res.json({
        status: true,
        msg: '用户注册成功，请登陆！'
    });
});
app.get('/sendPinCode', async (req, res) => {
    let pinCode = email.createSixNum(),
        addr = req.query.email;
    if (!addr) {
        let { identity, username } = req.query,
            sql_query = 'SELECT email FROM ?? WHERE username=?',
            [user] = await mysql.query(sql_query, [identity, username]);
        if (user) {
            addr = user.email;
        } else {
            throw 1101;
        }
    }
    await email.send({
        to: addr,
        html: email.pinCodeTemp(pinCode),
        subject: '邮箱验证'
    });
    req.session.pin = {
        code: pinCode,
        time: new Date().getTime()
    };
    res.json({
        status: true,
        msg: `验证码已发送至${addr.replace(/(\S{2,})(\S{4,4})(@.*)/, '$1****$3')}`
    });
});
app.post('/retrieve', async (req, res) => {
    let { identity, newPW, username, pinCode } = req.body,
        sql_update = 'UPDATE ?? SET password=? WHERE username=?';

    if (util.pinValidate(req.session.pin, pinCode)) {
        await mysql.query(sql_update, [identity, newPW, username]);
        res.json({
            status: true,
            msg: '找回密码成功，请使用新密码登陆！'
        });
    } else {
        throw 1102;
    }
});

/* 验证、更新session */
app.use((req, res, next) => {
    if (req.session.uid) {
        req.session._garbage = Date();
        req.session.touch();
        next();
    } else {
        res.json({
            offline: true,
            status: false,
            msg: '登陆信息失效，请重新登陆！'
        });
    }
});

app.get('/logout', async (req, res) => {
    await req.logout();
    res.json({
        status: true,
        msg: '登出成功！'
    });
});

const routesFile = path.resolve(__dirname, 'routes.json');
const routes = require(routesFile);

function modulesFilter(modules, user) {
    return modules.filter(module => {
        if (module.open) {
            module.subs = module.subs.filter(route => {
                if (route.requirement) {
                    for (const [key, value] of Object.entries(route.requirement)) {
                        if (user[key] != value) {
                            return false;
                        }
                    }
                    delete route.requirement;
                }
                return true;
            });
            return true;
        } else {
            return false;
        }
    });
}
app.get('/modules', async (req, res) => {
    let { identity, uid } = req.session,
        sql_query = 'SELECT * FROM ?? WHERE id=?';
    let [user] = await mysql.query(sql_query, [identity, uid]),
        _routes = JSON.parse(JSON.stringify(routes));
    user.identity = identity;
    _routes = modulesFilter(_routes, user);
    res.json({
        status: true,
        routes: _routes
    });
});

app.get('/modules-list', async (req, res) => {
    let modules = [], checked = [];
    for (const [i, v] of routes.entries()) {
        modules.push({
            val: i,
            des: v.des
        });
        if (v.open) {
            checked.push(i);
        }
    }
    modules.shift();
    res.json({
        status: true,
        modules,
        checked
    });
});

app.post('/modules-opt', async (req, res) => {
    let { open } = req.body;
    for (let i = 1; i < routes.length; i++) {
        routes[i].open = open.indexOf(i) >= 0;
    }
    await file.writeJson(routesFile, routes);
    await req.logout();
    res.json({
        status: true,
        offline: true,
        msg: '修改成功，请重新登录！'
    });
});

const pm2 = require('pm2');

app.get('/reset-system', async (req, res) => {
    for (const [i, v] of routes.entries()) {
        v.open = i <= 1;
    }
    await file.writeJson(routesFile, routes);
    let promises = [];
    for (const i of routes) {
        let reset = require(`./${i.path}/reset`);
        promises.push(reset());
    }
    await Promise.allSettled(promises);
    await req.logout();
    res.json({
        status: true,
        offline: true,
        msg: '系统重置成功，请重新登录！'
    });
    pm2.restart('all', (err, proc) => {
        if (err) {
            console.log('系统重置出错，请手动重启！');
        } else {
            console.log('系统重置成功，所有进程全部重启。');
        }
    });
});

module.exports = app;