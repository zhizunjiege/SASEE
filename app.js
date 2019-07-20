const NOTICE_JSON = "./json/notice.json"
const STUDENT_JSON = "./json/student.json"

var express = require('express');
var fs = require('fs');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

var action = require("./routes/action.js");
var mysql = require("./routes/sql")

//view uses html
app.set('views', __dirname + '/views');
app.engine('.ejs', ejs.__express);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/', function (req, res) {
    res.render('login', { title: 'paint title' });
});
app.post('/login', function (req, res) {
    var account = req.body.account;
    var password = req.body.password;
    if (account == password) {
        var sql = "SELECT * FROM notice order by id DESC limit ?"
        var num = 3
        var arr = new Array(num)
        mysql.query(sql,num,function (err, data) {
            if(err)console.log(err);
            data = JSON.parse(JSON.stringify(data))
           // console.log(data)
            for (var i=0;i<num;i++) {
                delete data[i].id;
                delete data[i].url;
                data[i].top = true;
                arr[i] = data[i]
            }
            console.log(arr)
            res.render('student', {
                user: {
                    name: '333',
                    gender: 'coder_chen',
                    identity: req.query.identity ? '教师' : '学生',
                },
                news: {
                    num: 34,
                    contents: arr
                }
            });
        })

    }

});

//动态加载的代码
app.get('/views', (req, res) => {
    switch (req.query.type) {
        case 'newsContent':
            //req.query.num表示第几条通知
            console.log(req.query.num);
            break;
        case 'newsList':
            //req.query.nextPage表示第几页
            res.render('newsList', {
                news: {
                    num: 53,
                    contents: (new Array(8)).fill({
                        top: true,
                        title: '系统开通',
                        publisher: '管理员',
                        category: '毕业设计',
                        date: '2019/7/13'
                    })
                }
            });
            console.log(req.query.nextPage);
            break;
        case 'userInfo':
            res.render('userInfo', {
                account: 17375433,
                status: {
                    specialty: '自动化',
                    subject: '模式识别',
                    class: '170326',
                    stuNum: '17375433',
                    name: '陈智杰',
                    gender: '男'
                },
                academic: {
                    gpa: 3.77,
                    weightAver: 91,
                    average: 89
                },
                qualification: {
                    bysj: true,
                    scsx: true,
                    zhsy: false
                }
            });
            break;
        case 'subject':
            res.render('subject', {
                num: 23,
                contents: (new Array(14)).fill({
                    title: '基于FPGA的无线雷达矩阵但是访华时',
                    derection: '探测制导',
                    chosen: 5,
                    capacity: 7,
                    publisher: '管理员',
                    date: '2019/7/16'
                })
            });
            break;
        case 'subjectList':
            res.render('subjectList', {
                contents: (new Array(5)).fill({
                    title: '基于FPGA的无线雷达矩阵',
                    derection: '探测制导',
                    chosen: 5,
                    capacity: 7,
                    publisher: '我',
                    date: '2019/7/16'
                })
            });
            break;
        case 'subjectContent':
            res.render('subjectContent', {
                subject: {
                    number:3,
                    title: '基于那啥做那啥',
                    derection: '模式识别',
                    capacity: 5,
                    chosen: 3,
                    introduction: '<div><h3 style="text-align: center;">关于毕业设计选题系统开放的通知<span style="text-decoration-line: line-through;">​</span></h3><div><span style="text-decoration-line: line-through;">致3系全体师生：</span>​</div></div>',
                    materials: [
                        {
                            filename: '就那啥做那啥的文件.html',
                            url: '/doc/notice.html'
                        }
                    ],
                    submitTime:'2019/7/8',
                    lastModifiedTime:'2019/7/16'
                },
                teacher: {
                    name: '某某某',
                    gender: '女',
                    pro: '讲师',
                    field: '超电磁炮',
                    mail: '88888888@buaa.edu.cn'
                }
            });
            break;
        default:
            break;
    }
});

//404
app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 ！- Not Found 该页面未建立');
});

app.listen(3000, '0.0.0.0', function () {
    console.log('express is running on localhost:3000')

});