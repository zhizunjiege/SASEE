const mysql = require('./sql');
module.exports = ({ admin, email, general, __dirname, CONSTANT } = {}) => {
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
                    res.location('/admin/main').send('登陆成功！');
                }
            }); */
        req.session.account = 1;
        res.location('/admin/main').send('登陆成功！');
    });
    admin.use(general.auth({ url: '/admin' }));
    admin.get('/main', (req, res) => {
        res.type('html').render('main');
    })

    return admin;
};