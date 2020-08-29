/* 用户账户相关 */
const mysql = require('./scripts/mysql');
const email = require('./scripts/email');
const util = require('./scripts/util');

const config = require('./config.json')

//账户操作
const identityDes = { student: '学生', teacher: '老师', admin: '管理员' };
function login(req, res) {
    let { identity, username, password } = req.body,
        sql_query = `SELECT id,name,gender FROM ?? user WHERE username = ? AND password=?`;
    res.do(async () => {
        if (!util.paramValidate([username, password, identity])) throw 1000;
        let data = await mysql.find(sql_query, [identity, username, password]);
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
}

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
function getModules(req, res) {
    let { identity, uid } = req.session,
        sql_query = 'SELECT * FROM ?? WHERE id=?';
    res.do(async () => {
        let [user] = await mysql.find(sql_query, [identity, uid]),
            routes = JSON.parse(JSON.stringify(config.routes));
        user.identity = identity;
        routes = modulesFilter(routes, user);
        res.json({
            status: true,
            routes
        });
    });
}
function logout(req, res) {
    res.do(async () => {
        await req.logout();
        res.json({
            status: true,
            msg: '登出成功！'
        });
    });
}
function sendPinCode(req, res) {
    let pinCode = email.createSixNum(),
        addr = req.query.email;
    res.do(async () => {
        if (!addr) {
            let { identity, username } = req.query,
                sql_query = 'SELECT email FROM ?? WHERE username=?',
                [user] = await mysql.find(sql_query, [identity, username]);
            if (data.length) {
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
}
function signup(req, res) {
    let { identity, name, schoolNum, username, pinCode, password, email, wechat, tel, homepage, resume } = req.body,
        { pin } = req.session,
        sql_query = 'SELECT id,username FROM ?? WHERE name = ? AND schoolNum=?;SELECT 1 FROM ?? WHERE username=?',
        sql_update = 'UPDATE ?? SET ? WHERE id=?';
    res.do(async () => {
        let data = await mysql.find(sql_query, [identity, name, schoolNum, identity, username]);
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
        await mysql.find(sql_update, [identity, params, data[0][0].id]);
        res.json({
            status: true,
            msg: '用户注册成功，请登陆！'
        });
    });
}
function retrieve(req, res) {
    let { identity, newPW, username, pinCode } = req.body,
        sql_update = 'UPDATE ?? SET password=? WHERE username=?';

    res.do(async () => {
        if (util.pinValidate(req.session.pin, pinCode)) {
            await mysql.find(sql_update, [identity, newPW, username]);
            res.json({
                status: true,
                msg: '找回密码成功，请使用新密码登陆！'
            });
        } else {
            throw 1102;
        }
    });
}

module.exports = { login, getModules, logout, sendPinCode, signup, retrieve };