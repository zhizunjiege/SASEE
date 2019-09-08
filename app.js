const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser=require("cookie-parser");
const app = express();
const session = require('express-session');

const login = require("./routes/login");
const view = require("./routes/view");
const NotFound = require("./routes/NotFound");
//const upload = require("./routes/upload");
//view uses html
app.set('views', __dirname + '/views');
app.engine('.ejs', ejs.__express);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    resave:false,//什么意思
    secret: 'SASEE', //使用随机自定义字符串进行加密
    saveUninitialized: false,//不保存未初始化的cookie，也就是未登录的cookie
    cookie: {
        maxAge: 30 * 60 * 1000,//设置cookie的过期时间为30分钟
        activeDuration: 5 * 60 * 1000, // 激活时间，比如设置为5分钟，那么只要5分钟内用户有服务器的交互，那么就会被重新激活。
    }
}));


app.get('/', function (req, res) {
    res.render('login', { title: 'paint title' });
});

app.post('/login', function (req, res) {
    login(req,res);
});

app.get('/views', (req, res) => {
    view(req,res)
});

app.get('/cookie', (req, res) => {
    res.send(req.cookies)
});

var multer  = require('multer')
var upload = multer({ dest: 'upload/' });

var multer = require('multer')
var upload = multer().single('avatar')

app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err)
        } else if (err) {
            console.log(err);
        }

        // 一切都好
    })
})
//404
app.use(function (req, res) {
    NotFound(req,res)
});

app.listen(3000, '::', function () {
    console.log('express2 is running on localhost:3000')

});