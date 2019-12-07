const express = require('express'),
    [mysql, file, email, general, views, util, upload, excelImport] = superApp.requireUserModules([
        'mysql',
        'file',
        'email',
        'general',
        'views',
        'util',
        'upload',
        'excelImport'
    ]),
    { VIEWS_ADMIN, NEWS, LICENSE, MANUAL } = superApp.resourses;

const admin = express(),
    adminViews = express.Router();

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
            if (data.length == 0) {
                res.status(403).send('账号或密码错误，请重试！');
            } else if (!pinCode || Date.now() - pinCode.time > 5 * 60 * 1000) {
                req.session.pinCode = null;
                res.status(403).send('验证码已失效，请重试！');
            } else {
                req.session.email = data[0].email;
                req.session.account = data[0].account;
                req.session.password = data[0].password;
                req.session.identity = 'admin';
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
        file: 'main'
    };
    next();
}, views.render);

adminViews.get('/submitNotice', (req, res, next) => {
    req.renderData = {
        file: 'submitNotice',
        extraData: superApp.groupMap
    };
    next();
}, views.render);
adminViews.get('/sendEmail', (req, res, next) => {
    req.renderData = {
        file: 'sendEmail'
    };
    next();
}, views.render);
adminViews.get('/updateState', (req, res, next) => {
    req.renderData = {
        file: 'updateState',
        extraData: {
            initialized: req.fsm.initialized,
            now: req.fsm.now(),
            states: req.fsm.info()
        }
    };
    next();
}, views.render);
adminViews.get('/setLimit', (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT `group`,goal,`limit` FROM dean ORDER BY `group`;SELECT `group`,COUNT(*) total FROM student GROUP BY `group` ORDER BY `group`;SELECT `group`,COUNT(*) total FROM teacher GROUP BY `group` ORDER BY `group`;SELECT `group`,state,COUNT(*) total FROM bysj GROUP BY `group`,state ORDER BY `group`,state',
        file: 'setLimit',
        extraData: superApp.groupMap
    };
    next();
}, views.render);
adminViews.get('/writeLicense', (req, res, next) => {
    req.renderData = {
        file: 'writeLicense'
    };
    next();
}, views.render);
adminViews.get('/writeManual', (req, res, next) => {
    req.renderData = {
        file: 'writeManual'
    };
    next();
}, views.render);
adminViews.get('/importUser', (req, res, next) => {
    req.renderData = {
        file: 'importUser'
    };
    next();
}, views.render);

admin.use('/views', views.common, adminViews);

admin.post('/submitNotice', (req, res) => {
    let { top, title, group, content } = req.body,
        sql_insert = 'INSERT INTO news (top,title,date,`group`) VALUES (?,?,CURDATE(),?)';
    mysql.find(sql_insert, [top == 'on' ? 1 : 0, title, JSON.stringify(group)]).then(info => {
        file.writeFile(NEWS + '/' + info.insertId + '.ejs', content, err => {
            if (err) throw err;
            res.send('通知发布成功！');
        });
    }).catch(util.catchError(res));
});
admin.post('/sendEmail', (req, res, next) => {
    let sql_query = 'SELECT email FROM ??';
    mysql.find(sql_query, [req.body.identity]).then(results => {
        req.body.toAddr = results.map(x => x.email);
        next();
    });
}, email.sendEmail);

admin.post('/setLimit', (req, res) => {
    let sql_update = 'UPDATE dean SET goal=?,`limit`=? WHERE `group`=?;', param = [];
    for (let i = 0; i < superApp.groupMap.length; i++) {
        param.push(req.body.goal[i], req.body.limit[i], superApp.groupMap[i]);
    }
    mysql.find(sql_update.repeat(superApp.groupMap.length), param).then(() => {
        res.send('设置成功！');
    }).catch(util.catchError(res));
});
admin.post('/writeLicense', (req, res) => {
    let { identity, content } = req.body;
    file.writeFile(LICENSE + '/' + identity + '.ejs', content, err => {
        if (err) {
            console.log(err);
            res.status(403).send('协议发布失败，请稍后重试！');
        }
        res.send('协议发布成功！');
    });
});
admin.post('/writeManual', (req, res) => {
    let { identity, content } = req.body;
    file.writeFile(MANUAL + '/' + identity + '.ejs', content, err => {
        if (err) {
            console.log(err);
            res.status(403).send('用户手册发布失败，请稍后重试！');
        }
        res.send('用户手册发布成功！');
    });
});

admin.post('/importStudent', upload.receiver.single('student'), excelImport.importStudent);
admin.post('/importTeacher', upload.receiver.single('teacher'), excelImport.importTeacher);

admin.post('/initState', (req, res) => {
    if (req.fsm.initialized) {
        res.status(403).send('系统已经初始化！');
        return;
    }
    let states = req.fsm.info();
    for (const iterator of states) {
        if (req.body[iterator.name]) {
            iterator.start = new Date(req.body[iterator.name]).toLocaleISOString();
        }
    }
    states.shift();
    req.fsm.initialize(states).then(info => {
        res.send('初始化成功！');
    }).catch(util.catchError(res));
});
admin.post('/updateState', (req, res) => {
    if (!req.fsm.initialized) {
        res.status(403).send('系统尚未初始化！');
        return;
    }
    let { name, start } = req.body;
    start = new Date(start).toLocaleISOString();
    req.fsm.update(name, start).then(() => {
        res.send('时间设置更新成功！');
    }).catch(util.catchError(res));
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
    }).catch(util.catchError(res));
});

module.exports = admin;