const mysql = require('./sql'),
    file = require('./file');
module.exports = ({ admin, Router, views, period, email, general, __dirname, CONSTANT } = {}) => {
    admin.set('views', __dirname + CONSTANT.VIEWS_ADMIN);
    admin.get('/', (req, res) => {
        res.render('login');
    });
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
    admin.use(general.auth({ url: '/admin', identity: 'admin', CONSTANT }));
    admin.get('/main', (req, res) => {
        let sql_query = 'SELECT (SELECT COUNT(*) FROM news) total,n.* FROM news n ORDER BY top DESC,id DESC LIMIT 10 OFFSET 0';
        mysql.find(sql_query).then(results => {
            res.render('main', {
                news: results,
                state: period.GET_STATE(),
                periodArray: period.GET_PERIODARRAY()
            });
        });
    });
    admin.use('/views', views.common(Router));
    admin.get('/logout', general.logout('/admin'));
    admin.post('/submitNotice', (req, res) => {
        let { top, title, category, content } = req.body,
            sql_insert = 'INSERT INTO news (top,title,date,category) VALUES (?,?,CURDATE(),?)';
        mysql.find(sql_insert, [top == 'on' ? 1 : 0, title, category.join('/')]).then(info => {
            file.fs.writeFile(req.APP_CONSTANT.ROOT + req.APP_CONSTANT.PATH_NEWS + info.insertId + '.ejs', content, err => {
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
    admin.post('/updateNext', period.updateNext);
    admin.get('/updateImm', period.updateImm);
    return admin;
};