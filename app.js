const superApp = require('./config');

const [express, session] = superApp.requireAll(['express', 'express-session']);

const [FSM, script, login, general, password, email, admin, student, teacher, dean] = superApp.requireUserModules([
    'fsm',
    'script',
    'login',
    'general',
    'password',
    'email',
    'admin',
    'student',
    'teacher',
    'dean'
]);

const { VIEWS_COMMON, PUBLIC } = superApp.resourses;

const app = express();

const fsm = new FSM({ script });

app.set('views', VIEWS_COMMON);
app.set('view engine', 'ejs');
app.set('strict routing', true);

app.use(express.static(PUBLIC));
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

const pwRouter = express.Router();
pwRouter.get('/', (req, res) => {
    res.render('password');
});
pwRouter.get('/sendPinCode', email._spcmw, email.sendPinCode);
pwRouter.post('/retrieve', password.retrieve);

app.use('/password', pwRouter);

app.post('/login', login.authenticate);

app.use((req, res, next) => {
    req.fsm = fsm;
    next();
});
app.use('/student', student);
app.use('/teacher', teacher);
app.use('/dean', dean);
app.use('/admin', admin);

app.use(general.notFound);

superApp.app = app;
superApp.server = app.listen(3000, '::', () => {
    console.log('express is running on localhost:3000')
});
