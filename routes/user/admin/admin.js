const express = require('express'),
    [mysql, file, email, general, views] = superApp.requireUserModules([
        'mysql',
        'file',
        'email',
        'general',
        'views'
    ]),
    { VIEWS_ADMIN, NEWS } = superApp.resourses;

const admin = express();

admin.set('views', VIEWS_ADMIN);
admin.get('/', (req, res, next) => {
    req.renderData = {
        file: 'login'
    };
    next();
}, views.render);
admin.get('/sendPinCode', (req, res, next) => {
    req.query.identity = 'admin';
    next();
}, email._spcmw, email.sendPinCode);
admin.post('/login', (req, res) => {
    /* let { account, password } = req.body,
        { pinCode } = req.session,
        sql_query = 'SELECT account,password,email FROM admin WHERE account = ? AND password=?';
    mysql.find(sql_query, [account, password])
        .then(data => {
            if (!pinCode || Date.now() - pinCode.time > 5 * 60 * 1000) {
                req.session.pinCode = null;
                res.status(403).send('验证码已失效，请重试！');
            } else if (data.length == 0) {
                res.status(403).send('账号或密码错误，请重试！');
            } else {
                req.session.email = data[0].email;
                req.session.account = data[0].account;
                req.session.password = data[0].password;
                req.session.identity='admin';
                res.location('/admin/main').send('登陆成功！');
            }
        }); */
    let { account, password } = req.body;
    req.session.account = account;
    req.session.password = password;
    req.session.identity = 'admin';
    res.location('/admin/main').send('登陆成功！');
});
admin.use(general.auth({ url: '/admin', identity: 'admin' }));
admin.get('/logout', general.logout('/admin'));

admin.get('/main', (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT (SELECT COUNT(*) FROM news) total,n.* FROM news n ORDER BY top DESC,id DESC LIMIT 10 OFFSET 0',
        file: 'main',
        extraData: {
            initialized: req.fsm.initialized,
            now: req.fsm.now(),
            states: req.fsm.info()
        }
    };
    next();
}, views.render);
admin.use('/views', views.common);

admin.post('/submitNotice', (req, res) => {
    let { top, title, category, content } = req.body,
        sql_insert = 'INSERT INTO news (top,title,date,category) VALUES (?,?,CURDATE(),?)';
    category = Array.isArray(category) ? category.join('/') : category;
    mysql.find(sql_insert, [top == 'on' ? 1 : 0, title, category]).then(info => {
        file.writeFile(NEWS + '/' + info.insertId + '.ejs', content, err => {
            if (err) throw err;
            res.send('通知发布成功！');
        });
    }).catch(err => {
        console.log(err);
        res.status(403).send('通知发布失败！');
    });
});
admin.post('/sendEmail', (req, res, next) => {
    let sql_query = 'SELECT email FROM ??';
    mysql.find(sql_query, [req.body.identity]).then(results => {
        req.body.toAddr = results.map(x => x.email);
        next();
    });
}, email.sendEmail);

admin.post('/initState', (req, res) => {
    if (req.fsm.initialized) {
        res.status(403).send('系统已经初始化！');
        return;
    }
    let states = req.fsm.info();
    for (const iterator of states) {
        iterator.start = req.body[iterator.name];
    }
    console.log(states);

    req.fsm.initialize(states).then(info => {
        res.send('初始化成功！');
    }).catch(err => {
        console.log(err);
        res.status(403).send('操作出错，请稍后重试！');
    });
});

admin.post('/updateState', (req, res) => {
    if (!req.fsm.initialized) {
        res.status(403).send('系统尚未初始化！');
        return;
    }
    let { name, start } = req.body;
    req.fsm.update(name, start).then(() => {
        res.send('时间设置更新成功！');
    }).catch(err => {
        console.log(err);
        res.status(403).send('操作出错，请稍后重试！');
    });
});
admin.get('/nextState', (req, res) => {
    if (!req.fsm.initialized) {
        res.status(403).send('系统尚未初始化！');
        return;
    }
    if (req.fsm.completed) {
        res.status(403).send('系统已经运行完成！');
        return;
    }
    req.fsm.next().then(() => {
        res.send('立即启动成功！');
    }).catch(err => {
        console.log(err);
        res.status(403).send('操作出错，请稍后重试！');
    });
});

module.exports = admin;