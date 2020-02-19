/* 用户账户相关 */
const { mysql, email, util } = superApp.requireUserModules(['mysql', 'email', 'util']);

//工具函数
function pinValidate(code) {
    if (!this) return false;
    if (Date.now() - this.time > 5 * 60 * 1000) {
        this.code = '';
        this.time = 0;
        return false;
    } else if (code !== this.code) {
        return false;
    } else {
        return true;
    }
}

//账户操作
const identityDes = { student: '学生', teacher: '老师', admin: '管理员' };
function login(req, res) {
    let { username, password, identity } = req.body,
        sql_query = `SELECT id,name,gender FROM ?? user WHERE username = ? AND password=?`;
    console.log(req.body);

    res.do(async () => {
        if (!util.paramIfValid([username, password, identity])) {
            throw 1000;
        }
        let data = await mysql.find(sql_query, [identity, username, password]);

        if (!data.length) throw 1001;
        //设置session
        let [user] = data;
        req.session.userId = user.id;
        req.session.username = username;
        req.session.identity = identity;
        res.json({
            status: true,
            msg: '登陆成功！',
            user: {
                profile: `${user.gender == '男' ? 'man' : 'woman'}_${identity}.png`,
                name: user.name,
                identity: identityDes[identity]
            }
        });
    });
}
function getModules(req, res) {
    let { identity, userId } = req.session,
        sql_query = 'SELECT * FROM ?? WHERE id=?';
    res.do(async () => {
        let [user] = await mysql.find(sql_query, [identity, userId]),
            routes = JSON.parse(JSON.stringify(superApp.routes));
        user.identity = identity;
        for (const iterator of routes) {
            iterator.subs = iterator.subs.filter(element => {
                if (!element.requirement) return true;
                for (const [key, value] of Object.entries(element.requirement)) {
                    if (user[key] != value) return false;
                }
                delete element.requirement;
                return true;
            });
        }
        res.json({
            status: true,
            routes
        });
    });
}
function logout(req, res) {
    res.do(async () => {
        await new Promise((resolve, reject) => {
            req.session.destroy(err => {
                if (err) reject(err);
                resolve();
            });
        });
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
function register(req, res) {
    console.log(req.body);
    let { identity, name, schoolNum, username, pinCode, password, email, wechat, tel, homepage, resume } = req.body,
        sql_query = 'SELECT id,username FROM ?? WHERE name = ? AND schoolNum=?;SELECT 1 FROM ?? WHERE username=?',
        sql_update = 'UPDATE ?? SET ? WHERE id=?';
    res.do(async () => {
        let data = await mysql.find(sql_query, [identity, name, schoolNum, identity, username]);
        if (!data[0].length) throw 1003;
        if (data[0][0].username) throw 1004;
        if (data[1].length) throw 1005;
        if (!pinValidate.call(req.session.pin, pinCode)) throw 1102;

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
        if (pinValidate.call(req.session.pin, pinCode)) {
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




function modify(req, res) {
    let { identity, username } = req.session,
        { oldPW, newPW } = req.body,
        sql_query = 'SELECT password FROM ?? WHERE username=?',
        sql_update = 'UPDATE ?? SET password=? WHERE username=?';
    res.do(async () => {
        let result = await mysql.find(sql_query, [identity, username]);
        if (oldPW == result[0].password) {
            await mysql.find(sql_update, [identity, newPW, username]);
        } else {
            throw 1002;
        }
        if (!res.headersSent) {
            req.session.destroy();
            res.send('修改密码成功！');
        }
    });
}

const fieldsMap = {
    student: ['resume', 'tel'],
    teacher: ['field', 'office', 'resume', 'tel']
};
function setGeneralInfo(req, res) {
    let { identity, username } = req.session,
        sql_update = 'UPDATE ?? SET ? WHERE username=?',
        param = {};
    for (let i = 0; i < fieldsMap[identity].length; i++) {
        const element = fieldsMap[identity][i];
        if (req.body[element]) {
            param[element] = req.body[element].replace(/\r/g, '');
        }
    }
    res.do(async () => {
        await mysql.find(sql_update, [identity, param, username]);
        res.send('已更新信息！');
    });
}

function setEmailAddr(req, res) {
    let { identity, pinCode, username } = req.session,
        addr = req.body.email,
        sql_update = 'UPDATE ?? SET email=? WHERE username=?';
    res.do(async () => {
        if (!pinCode || Date.now() - pinCode.time > 5 * 60 * 1000) {
            req.session.pin = null;
            throw 1102;
        } else if (code != pinCode.code) {
            throw 1103;
        } else {
            await mysql.find(sql_update, [identity, addr, username]);
            res.send('已成功更新邮箱地址！');
        }
    });
}

module.exports = { login, getModules, logout, sendPinCode, register, retrieve, modify, setGeneralInfo, setEmailAddr };