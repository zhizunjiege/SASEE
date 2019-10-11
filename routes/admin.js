const mysql = require('./sql');
module.exports = ({ admin,Router,views, email, general, __dirname, CONSTANT } = {}) => {
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
        req.session.password=password;
        req.session.identity='admin';
        res.location('/admin/main').send('登陆成功！');
    });
    admin.use(general.auth({ url: '/admin' ,identity:'admin',CONSTANT}));
    admin.get('/main', (req, res) => {
        let sql_query = 'SELECT (SELECT COUNT(*) FROM news) total,n.* FROM news n ORDER BY top DESC,id DESC LIMIT 10 OFFSET 0';
        mysql.find(sql_query).then(results => {
            res.render('main', { news: results});
        });
    });
    admin.use('/views',views.common(Router));
    admin.post('/submitNotice',(req,res)=>{
        console.log(req.body);
        
        res.send('发布成功！');
    });

    return admin;
};