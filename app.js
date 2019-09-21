const express = require('express');
const Router = express.Router;
const app = express();
const student = express();
const teacher = express();
const dean = express();
const admin = express();

const path = require('path');
const multer = require("multer");
const session = require('express-session');
const upload = multer({ dest: 'upload/' });

const login = require("./routes/login");
const views = require("./routes/views");
const NotFound = require("./routes/NotFound");
const upload_function = require("./routes/upload");

app.set('views', __dirname + '/resourses');
app.set('view engine', 'ejs');
app.set('strict routing',true);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    resave: false,//什么意思
    secret: 'SASEE', //使用随机自定义字符串进行加密
    saveUninitialized: false,//不保存未初始化的cookie，也就是未登录的cookie
    cookie: {
        maxAge: 30 * 60 * 1000,//设置cookie的过期时间为30分钟
        activeDuration: 5 * 60 * 1000, // 激活时间，比如设置为5分钟，那么只要5分钟内用户有服务器的交互，那么就会被重新激活。
    }
}));

app.get('/', (req, res) => {
    res.render('common/views/login');
});

app.get('/password', (req, res) => {
    res.render('common/views/password');
});

(function () {
    const file = Router();
    student.set('views',__dirname+'/resourses/student/views/');

    file.post('/upload', upload.single('file_new'), upload_function);

    student.post('/', login);
    student.get('/views', views.student);
    student.post('/file',file);
    //student.get('/logout',logout);
    //student.get('/download',download);
    //student.post('/email',email);
    //student.post('/password',password);
    //student.post('/choose',choose);
})();

app.use('/student', student);
app.use('/teacher', teacher);
app.use('/dean', dean);
app.use('/admin', admin);

app.use(NotFound);

app.listen(3000, '::', () => {
    console.log('express is running on localhost:3000')
});