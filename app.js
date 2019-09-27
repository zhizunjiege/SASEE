const CONSTANT = {
    PATH_TMP: 'upload/',
    PATH_FILES: 'resourses/common/files/',
    VIEWS_COMMON: '/resourses/common/views/',
    VIEWS_TEACHER: '/resourses/teacher/views/',
    VIEWS_STUDENT: '/resourses/student/views/',
    VIEWS_DEAN: '/resourses/dean/views/',
    VIEWS_ADMIN: '/resourses/admin/views/'
};

const express = require('express'),
    Router = express.Router,
    app = express(),
    student = express(),
    teacher = express(),
    dean = express(),
    admin = express();

const path = require('path'),
    multer = require("multer"),
    session = require('express-session'),
    upload = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, CONSTANT.PATH_TMP);
            },
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            }
        })
    });
const period = require('./routes/period'),
    login = require("./routes/login"),
    views = require("./routes/views"),
    general = require("./routes/general"),
    password = require("./routes/password"),
    email = require('./routes/email'),
    info = require('./routes/info');

app.set('views', __dirname + CONSTANT.VIEWS_COMMON);
app.set('view engine', 'ejs');
app.set('strict routing', true);

period.init();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    resave: false,//每次请求都保存session，即使session未更改
    secret: 'SASEE', //使用随机自定义字符串进行加密
    saveUninitialized: false,//不保存未初始化的cookie，也就是未登录的cookie
    cookie: {
        maxAge: app.get('env') == 'development' ? 60 * 1000 : 5 * 60 * 1000,//设置cookie的过期时间为1分钟
    }
}));

app.get('/', (req, res) => {
    if (req.session.account) {
        res.redirect('/' + req.session.identity + '/');
    } else {
        res.render('login');
    }
});

app.get('/password', (req, res) => {
    res.render('password');
});

app.post('/login', login.authenticate);

app.use((req, res, next) => {
    if (!req.session.account) {
        res.location('/').status(403).send('登陆信息失效，请重新登陆！');
    } else {
        req.APP_CONSTANT = CONSTANT;
        next();
    }
});

(function () {
    const fileRouter = Router();
    student.set('views', __dirname + '/resourses/student/views/');

    fileRouter.post('/upload', upload.single('file_new'));

    student.post('/', login.render);
    student.get('/views', views.student);
    student.use('/file', fileRouter);
    //student.get('/logout',logout);
    //student.get('/download',download);
    //student.post('/email',email);
    //student.post('/password',password);
    //student.post('/choose',choose);
})();
(function () {
    const subject = require('./routes/subject'),
        fileRouter = Router(),
        subjectRouter = Router(),
        emailRouter = Router();
    teacher.set('views', __dirname + CONSTANT.VIEWS_TEACHER);

    teacher.get('/', login.render);
    teacher.use('/views', views.common(Router), views.teacher(Router, period));

    fileRouter.post('/upload', upload.single('file_new'));
    teacher.use('/file', period.permiss([9]), fileRouter);

    subjectRouter.post('/submit', period.permiss([1]), upload.single('file'), subject.submit);
    subjectRouter.post('/modify', period.permiss([1, 3]), upload.single('file'), subject.modify);
    teacher.use('/subject', subjectRouter);

    emailRouter.get('/sendPinCode', email.sendPinCode);
    emailRouter.post('/setEmailAddr', email.setEmailAddr);
    teacher.use('/email', emailRouter);

    teacher.post('/info', period.permiss([0]), info(['field', 'office', 'tele', 'resume']));

    teacher.get('/logout', general.logout);
    teacher.post('/password', password.modify);
})();
(function () {
    const fileRouter = Router();
    dean.set('views', __dirname + '/resourses/dean/views/');

    fileRouter.post('/upload', upload.single('file_new'));

    dean.post('/', login.render);
    dean.get('/views', views.dean);
    dean.use('/file', fileRouter);
    //dean.get('/logout',logout);
    //dean.get('/download',download);
    //dean.post('/email',email);
    //dean.post('/password',password);
    //dean.post('/choose',choose);
})();

app.use('/student', student);
app.use('/teacher', teacher);
app.use('/dean', dean);
app.use('/admin', admin);

app.use(general.notFound);

app.listen(3000, '::', () => {
    console.log('express is running on localhost:3000')
});