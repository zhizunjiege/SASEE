const CONSTANT = {
    PATH_TMP: './tmp/',
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
    receive = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, CONSTANT.PATH_TMP);
            },
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            }
        })
    }).single('file');
const period = require('./routes/period'),
    login = require("./routes/login"),
    views = require("./routes/views"),
    general = require("./routes/general"),
    password = require("./routes/password"),
    email = require('./routes/email'),
    info = require('./routes/info'),
    upload = require('./routes/upload'),
    download = require('./routes/download'),
    subject = require('./routes/subject');

app.set('views', __dirname + CONSTANT.VIEWS_COMMON);
app.set('view engine', 'ejs');
app.set('strict routing', true);

period.init();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    resave: false,//每次请求都保存session，即使session未更改
    secret: 'SASEE', //使用随机自定义字符串进行加密
    saveUninitialized: false,//不保存未初始化的cookie，也就是未登录的cookie
    cookie: {
        maxAge: app.get('env') == 'development' ? 5 * 60 * 1000 : 20 * 60 * 1000,//设置cookie的过期时间
    }
}));

app.get('/', general.redirect);

{
    const pwRouter = Router();
    pwRouter.get('/', (req, res) => {
        res.render('password');
    });
    pwRouter.get('/sendPinCode', email._spcmw, email.sendPinCode);
    pwRouter.post('/retrieve', password.retrieve);

    app.use('/password', pwRouter);
}

app.post('/login', login.authenticate);

app.use('/admin', require('./routes/admin')({ admin,Router,views,period, email,general, __dirname, CONSTANT }));

{
    const emailRouter = Router(),
        fileRouter = Router();
    student.set('views', __dirname + CONSTANT.VIEWS_STUDENT);
    student.use(general.auth({ url: '/',identity:'student',CONSTANT:CONSTANT }));
    student.get('/', login.render);
    student.use('/views', views.common(Router), views.student(Router, period));

    fileRouter.post('/upload', receive, upload);
    fileRouter.get('/download', download);
    student.use('/file', period.permiss([9]), fileRouter);

    emailRouter.get('/sendPinCode', period.permiss([0]), email.sendPinCode);
    emailRouter.post('/setEmailAddr', period.permiss([0]), info.setEmailAddr);
    emailRouter.post('/sendEmail', period.permiss([9]), email.sendEmail);
    student.use('/email', emailRouter);

    student.post('/choose', period.permiss([5, 8]), (req, res, next) => {
        if (period.GET_STATE() == 5) {
            req.body.colume = 'selected';
        } else {
            req.body.colume = 'final';
        }
        next();
    }, subject.choose);

    student.get('/logout', general.logout);
    student.post('/password', password.modify);
}
{
    const fileRouter = Router(),
        subjectRouter = Router(),
        emailRouter = Router();
    teacher.set('views', __dirname + CONSTANT.VIEWS_TEACHER);
    teacher.use(general.auth({ url: '/',identity:'teacher',CONSTANT:CONSTANT }));
    teacher.get('/', login.render);
    teacher.use('/views', views.common(Router), views.teacher(Router, period));

    fileRouter.post('/upload', receive, upload);
    fileRouter.get('/download', download);
    teacher.use('/file', period.permiss([9]), fileRouter);

    subjectRouter.post('/submit', period.permiss([1]), receive, subject.submit);
    subjectRouter.post('/modify', period.permiss([1, 3]), receive, subject.modify);
    subjectRouter.post('/notice', period.permiss([9]), subject.notice);
    subjectRouter.post('/mark', period.permiss([9]), subject.mark);
    teacher.use('/subject', subjectRouter);

    emailRouter.get('/sendPinCode', period.permiss([0]), email.sendPinCode);
    emailRouter.post('/setEmailAddr', period.permiss([0]), info.setEmailAddr);
    emailRouter.post('/sendEmail', period.permiss([9]), email.sendEmail);
    teacher.use('/email', emailRouter);

    teacher.post('/info', period.permiss([0]), info.setGeneralInfo(['field', 'office', 'tele', 'resume']));

    teacher.get('/logout', general.logout);
    teacher.post('/password', password.modify);
}
{
    const emailRouter = Router();
    dean.set('views', __dirname + CONSTANT.VIEWS_DEAN);
    dean.use(general.auth({ url: '/',identity:'dean',CONSTANT:CONSTANT }));
    dean.get('/', login.render);
    dean.use('/views', views.common(Router), views.dean(Router, period));

    emailRouter.get('/sendPinCode', period.permiss([0]), email.sendPinCode);
    emailRouter.post('/setEmailAddr', period.permiss([0]), info.setEmailAddr);
    dean.use('/email', emailRouter);

    dean.post('/pass', period.permiss([2, 4]), subject.pass, email.sendEmail);
    dean.post('/fail', period.permiss([2, 4]), subject.fail, email.sendEmail);

    dean.get('/logout', general.logout);
    dean.post('/password', password.modify);
}

app.use('/student', student);
app.use('/teacher', teacher);
app.use('/dean', dean);

app.use(general.notFound);

app.listen(3000, '::', () => {
    console.log('express is running on localhost:3000')
});