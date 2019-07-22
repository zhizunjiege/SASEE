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
var login = require("./routes/login")

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
    login(req, res)
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
                        date: '2019/07/13'
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
                    title: '做个什么呢我也不太清楚',
                    derection: '301',
                    chosen: 5,
                    capacity: 7,
                    publisher: '某老师',
                    date: '2019/07/16'
                })
            });
            break;
        case 'subjectList':
            res.render('subjectList', {
                contents: (new Array(5)).fill({
                    title: '我也不知道要做什么',
                    derection: '302',
                    chosen: 5,
                    capacity: 7,
                    publisher: '某某老师',
                    date: '2019/07/16'
                })
            });
            break;
        case 'subjectContent':
            res.render('subjectContent', {
                subject: {
                    number: 3,
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
                    submitTime: '2019/07/08',
                    lastModifiedTime: '2019/07/16'
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
        case 'mySubject':
            res.render('mySubject', {
                notice: new Array(5).fill({
                    top: false,
                    title: '准备开始开发了啊',
                    date: '2019/07/09'
                }),
                teacher: {
                    name: '某某某',
                    gender: '女',
                    pro: '讲师',
                    field: '超电磁炮',
                    office:'新主楼F-407',
                    mail: '88888888@buaa.edu.cn',
                    tele:'166-6666-6666'
                },
                downFiles:[
                    {
                        date:'2019/11/20',
                        file:[
                            {
                                name:'可下载文件003.doc',
                                url:'/doc/notice.html'
                            },{
                                name:'可下载文件004.doc',
                                url:'/doc/notice.html'
                            }
                        ]
                    },{
                        date:'2019/10/24',
                        file:[
                            {
                                name:'可下载文件001.doc',
                                url:'/doc/notice.html'
                            },{
                                name:'可下载文件002.doc',
                                url:'/doc/notice.html'
                            }
                        ]
                    }
                ],
                upFiles:[
                    {
                        date:'2019/12/10',
                        file:[
                            '上传的文件003.doc',
                            '上传的文件004.doc'
                        ]
                    },{
                        date:'2019/10/28',
                        file:[
                            '上传的文件001.doc',
                            '上传的文件002.doc'
                        ]
                    }
                ]
            });
            break;
        default:
            break;
    }
});
app.post('/upload', (req, res) => {
    console.log(req);
    //console.log(req.body);
    var data = '';
    req.on('data', (buf) => {
        data += buf;
    });
    req.on('end', () => {
        console.log(data);

    });
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