const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
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
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


app.get('/', function (req, res) {
    res.render('login', {title: 'paint title'});
});

app.post('/login', function (req, res) {
    login(req, res);
});

app.get('/views', (req, res) => {
    view(req, res)
});

app.get('/cookie', (req, res) => {
    res.send(req.cookies)
});

app.post('/upload', (req, res) => {
    upload(req, res)
});

app.post('/choose', (req, res) => {
    let info = {};
    let account = req.body.account;
    let selection = req.body.group;

    let find_sql = "SELECT * FROM final WHERE account = ?";
    mysql.query(find_sql, account, function (err, data) {
        if (err) return res.send('账号错误');
        let group = data[0].group;
        let category = data[0].category;
        info.group = selection;

        let choose_sql = SqlString.format('UPDATE final  SET ? WHERE account = ?', [info, account]);

        let id = category.toString() + selection.toString();
        //console.log('group, selection', group, selection);
        //console.log(typeof (selection));
        if (selection == '') {
            res.setHeader('Content-Type', 'text/plain;charset=utf-8');
            return res.end('你未进行任何选择');
        }//res.end('3')}
        if (group == -1) {
            let pd = "SELECT * FROM g WHERE id = ?";
            mysql.query(pd, id, function (err, data) {
                if (err) return res.send('请稍后尝试');
                let chosen = data[0].chosen;
                let capacity = data[0].capacity;
                if (chosen < capacity) {
                    let sql = "UPDATE g SET chosen = chosen + 1 WHERE id = ?";
                    mysql.query(sql, id, function (err, data) {
                        if (err) return res.send('选课失败，请稍后重试');
                        else {
                            mysql.query(choose_sql, [], function (err, data) {
                                if (err) return res.send('选课失败，请返回重试');
                                res.end('选择成功！')
                                console.log('succeed')
                            })
                        }
                    })
                } else return res.end('容量已满，请选择其他分组！')
            })
        } else if (group == selection)
            return res.end('您已经选择过该分组！');
        else {
            let old_id = category.toString() + group.toString();
            let clean_sql = "UPDATE g SET chosen = chosen - 1 WHERE id = ?";
            mysql.query(clean_sql, old_id, function (err, data) {
                if (err) return console.log(err);
                let sql = "UPDATE g SET chosen = chosen + 1 WHERE id = ?";
                mysql.query(sql, id, function (err, data) {
                    if (err) return console.log(err);
                    mysql.query(choose_sql, [], function (err, data) {
                        if (err) return res.send('选课失败，请返回重试');
                        else return res.end('选择成功！');
                    })
                })
            });

        }
    })
});

//404
app.use(function (req, res) {
    NotFound(req, res)
});

app.listen(3000, '::', function () {
    console.log('express is running on localhost:3000')

});