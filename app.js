const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser=require("cookie-parser");
const SqlString = require('sqlstring');
const app = express();

const mysql = require("./routes/sql");
const login = require("./routes/login");
const view = require("./routes/view");
const NotFound = require("./routes/NotFound");
const upload = require("./routes/upload");
//view uses html
app.set('views', __dirname + '/views');
app.engine('.ejs', ejs.__express);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


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

app.post('/upload',(req,res)=>{
    upload(req,res)
});

app.post('/choose',(req,res)=>{
    let info = {};
    info.account = req.body.account;
    info.category = req.body.direction;
    //info.category = req.body.category;
    info.group = req.body.group;
    console.log('info',info);
    // console.log('body',req)
    //info.teacher = group[info.category][group_id];
    id = info.category.toString() + info.group.toString()
    let sql_ = SqlString.format('INSERT INTO result SET ?', info);
    mysql.query(sql_, [],function (err, data) {
        if (err) console.log(err)//res.end(0);
        let sql = "UPDATE g SET chosen = chosen + 1 WHERE id = ?"
        mysql.query(sql, id, function (err, data) {
            if(err) console.log(err)//res.end(0);
            else res.end('1');
        })
    })
});

//404
app.use(function (req, res) {
    NotFound(req,res)
});

app.listen(3000, '::', function () {
    console.log('express is running on localhost:3000')

});