const superApp = require('./config');

const [express, path, session] = superApp.requireAll(['express', 'path', 'express-session']);

const [period, login, views, general, password, email, info, upload, download, subject] = superApp.requireUserModules([
    'period',
    'login',
    'views',
    'general',
    'password',
    'email',
    'info',
    'upload',
    'download',
    'subject'
]);

const { VIEWS_COMMON, VIEWS_DEAN, VIEWS_STUDENT, VIEWS_TEACHER } = superApp.resourses;

const Router = express.Router,
    app = express(),
    student = express(),
    teacher = express(),
    dean = express(),
    admin = express();
app.set('views', VIEWS_COMMON);
app.set('view engine', 'ejs');
app.set('strict routing', true);

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

app.use('/admin', superApp.requireUserModule('admin'));

{
    const emailRouter = Router(),
        fileRouter = Router();
    student.set('views', VIEWS_STUDENT);
    student.use(general.auth({ url: '/', identity: 'student' }));
    student.get('/', login.render);
    student.use('/views', views.common, views.student);

    fileRouter.post('/upload', upload.receive, upload.upload);
    fileRouter.get('/download', download.download);
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

    student.get('/logout', general.logout());
    student.post('/password', password.modify);
}
{
    const fileRouter = Router(),
        subjectRouter = Router(),
        emailRouter = Router();
    teacher.set('views', VIEWS_TEACHER);
    teacher.use(general.auth({ url: '/', identity: 'teacher' }));
    teacher.get('/', login.render);
    teacher.use('/views', views.common, views.teacher);

    fileRouter.post('/upload', upload.receive, upload.upload);
    fileRouter.get('/download', download.download);
    teacher.use('/file', period.permiss([9]), fileRouter);

    subjectRouter.post('/submit', period.permiss([1]), upload.receive, subject.submit);
    subjectRouter.post('/modify', period.permiss([1, 3]), upload.receive, subject.modify);
    subjectRouter.post('/notice', period.permiss([9]), subject.notice);
    subjectRouter.post('/mark', period.permiss([9]), subject.mark);
    teacher.use('/subject', subjectRouter);

    emailRouter.get('/sendPinCode', period.permiss([0]), email.sendPinCode);
    emailRouter.post('/setEmailAddr', period.permiss([0]), info.setEmailAddr);
    emailRouter.post('/sendEmail', period.permiss([9]), email.sendEmail);
    teacher.use('/email', emailRouter);

    teacher.post('/info', period.permiss([0]), info.setGeneralInfo(['field', 'office', 'tele', 'resume']));

    teacher.get('/logout', general.logout());
    teacher.post('/password', password.modify);
}
{
    const emailRouter = Router();
    dean.set('views', VIEWS_DEAN);
    dean.use(general.auth({ url: '/', identity: 'dean' }));
    dean.get('/', login.render);
    dean.use('/views', views.common, views.dean);

    emailRouter.get('/sendPinCode', period.permiss([0]), email.sendPinCode);
    emailRouter.post('/setEmailAddr', period.permiss([0]), info.setEmailAddr);
    dean.use('/email', emailRouter);

    dean.post('/pass', period.permiss([2, 4]), subject.pass, email.sendEmail);
    dean.post('/fail', period.permiss([2, 4]), subject.fail, email.sendEmail);

    dean.get('/logout', general.logout());
    dean.post('/password', password.modify);
}

app.use('/student', student);
app.use('/teacher', teacher);
app.use('/dean', dean);

app.use(general.notFound);


period.init(() => {
    superApp.server = app.listen(3000, '::', () => {
        console.log('express is running on localhost:3000')
    });
});
