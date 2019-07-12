var express = require('express');
var fs = require('fs');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var path = require('path');
var bodyParser = require('body-parser')

var app = express();

var query = require('./sql');

//view uses html
app.set('views', __dirname + '/public/html');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))

//app.set('port',process.env.PORT||3000);

app.get('/', function (req, res) {
	res.render('login', { title: 'paint title' });
	//var name = req.body.name;
	//var password = req.body.password;
});
app.get('/1', function (req, res) {
	res.render('student', { title: 'paint title' });
	//var name = req.body.name;
	//var password = req.body.password;
});
app.get('/login', function (req, res) {
    var account = req.query.account;
    var password = req.query.password;
    console.log('account:' + account);
    console.log('password:' + password);
    if (account == password) {

        var contents = (new Array(10)).fill({
            top: true,
            title: '系统开通',
            publisher: '管理员',
            category: '综合实验',
            date: '2019/7/10'
        });

        res.render('student', {
            user: {
                profile: 'profile',
                name: '333',
                identity: req.query.identity ? '教师' : '学生',
            },
            news: {
                num: 53,
                contents: contents
            }
        });return ;
    }
    var selectSQL = "select * from student where id = '" + account + "' and password = '" + password + "'"

    query(selectSQL, [], function (err,results, fields) {
        if (err)console.log(err)
        console.log(results)
        var contents = (new Array(10)).fill({
            top: true,
            title: '系统开通',
            publisher: '管理员',
            category: '综合实验',
            date: '2019/7/10'
        });

        res.render('student', {
            user: {
                profile: 'profile',
                name: '333',
                identity: req.query.identity ? '教师' : '学生',
            },
            news: {
                num: 53,
                contents: contents
            }
        })
    });
    var noticeSQL = "SELECT * FROM notice ORDER BY id DESC LIMIT 0, 1"
    query(noticeSQL,[],function (err, results, fields) {
        if(err) {
            console.log(err)
        return;
        }
        console.log("the max id is :")
        console.log(results);
        console.log(results[0])
        console.log(JSON.parse(JSON.stringify(results)))
    })
});
//404
app.use(function (req, res) {
	res.type('text/plain');
	res.status(404);
	res.send('404 ！- Not Found');
});

app.listen(3000, '0.0.0.0', function () {
	console.log('express is running on localhost:3000')

});