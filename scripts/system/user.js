/* 用户账户相关 */

const [mysql, email, util] = superApp.requireUserModules(['mysql', 'email', 'util']);

/* function redirect(req, res) {
    if (req.session.identity) {
        res.redirect('/main');
    } else {
        res.render('login', { admin: req.path == '/admin' });
    }
} */

function register(req, res) {
    res.send('ok');
}

const identityDes = { student: '学生', teacher: '老师', admin: '管理员' };
function login(req, res) {
    let { account, password, identity } = req.body,
        sql_query = `SELECT id,name,gender,ifReadLicense FROM ?? user WHERE account = ? AND password=?`;
    console.log(req.body);

    res.do(async () => {
        if (!util.paramIfValid([account, password, identity])) {
            throw 1000;
        }
        let data = await mysql.find(sql_query, [identity, account, password]);
        console.log(data);
        
        if (data.length == 0) throw 1001;
        //设置session
        let [user] = data;
        req.session.userId = user.id;
        req.session.account = account;
        req.session.identity = identity;
        /* req.session.group = data[0].group;
        data[0].specialty && (req.session.specialty = data[0].specialty);
        data[0].proTitle && (req.session.proTitle = data[0].proTitle); */
        res.json({
            status: true,
            msg: '登陆成功！',
            user: {
                profile: `${user.gender == '男' ? 'man' : 'woman'}_${identity}.png`,
                name: user.name,
                identity: identityDes[identity]
            },
            modules: superApp.modules
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
            let { identity, account } = req.query,
                sql_query = 'SELECT email FROM ?? WHERE account=?',
                data = await mysql.find(sql_query, [identity, account]);
            if (data.length) {
                addr = data[0].email;
            } else {
                throw 1101;
            }
        }
        await email.send({
            to: addr,
            html: email.pinCodeTemp(pinCode),
            subject: '邮箱验证'
        });
        req.session.pinCode = {
            code: pinCode,
            time: new Date().getTime()
        };
        res.json({
            status: true,
            msg: `验证码已发送至${addr.replace(/(\S{2,})(\S{4,4})(@.*)/, '$1****$3')}`
        });
    });
}

function retrieve(req, res) {
    let { identity, newPW, account, pinCode: code } = req.body,
        { pinCode } = req.session,
        sql_update = 'UPDATE ?? SET password=? WHERE account=?';

    res.do(async () => {
        if (!pinCode || Date.now() - pinCode.time > 5 * 60 * 1000) {
            req.session.pinCode = null;
            throw 1102;
        } else if (code != pinCode.code) {
            throw 1103;
        } else {
            await mysql.find(sql_update, [identity, newPW, account]);
            res.send('已成功设置密码！');
        }
    });
}

function modify(req, res) {
    let { identity, account } = req.session,
        { oldPW, newPW } = req.body,
        sql_query = 'SELECT password FROM ?? WHERE account=?',
        sql_update = 'UPDATE ?? SET password=? WHERE account=?';
    res.do(async () => {
        let result = await mysql.find(sql_query, [identity, account]);
        if (oldPW == result[0].password) {
            await mysql.find(sql_update, [identity, newPW, account]);
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
    let { identity, account } = req.session,
        sql_update = 'UPDATE ?? SET ? WHERE account=?',
        param = {};
    for (let i = 0; i < fieldsMap[identity].length; i++) {
        const element = fieldsMap[identity][i];
        if (req.body[element]) {
            param[element] = req.body[element].replace(/\r/g, '');
        }
    }
    res.do(async () => {
        await mysql.find(sql_update, [identity, param, account]);
        res.send('已更新信息！');
    });
}

function setEmailAddr(req, res) {
    let { identity, pinCode, account } = req.session,
        addr = req.body.email,
        sql_update = 'UPDATE ?? SET email=? WHERE account=?';
    res.do(async () => {
        if (!pinCode || Date.now() - pinCode.time > 5 * 60 * 1000) {
            req.session.pinCode = null;
            throw 1102;
        } else if (code != pinCode.code) {
            throw 1103;
        } else {
            await mysql.find(sql_update, [identity, addr, account]);
            res.send('已成功更新邮箱地址！');
        }
    });
}

module.exports = { register, login, logout, sendPinCode, retrieve, modify, setGeneralInfo, setEmailAddr };