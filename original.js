var express = require('express');
var fs = require('fs');
var ejs = require('ejs');
var app = express();
var bodyParser = require('body-parser');

path = require('path');
//view uses html
app.set('views', __dirname + '/public/html');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))


var bodyParser = require('body-parser')
//app.set('port',process.env.PORT||3000);

app.get('/',function(req,res){
	res.render('login', {title:'paint title'});
	//var name = req.body.name;
	//var password = req.body.password;
});
app.get('/1',function(req,res){
	res.render('student', {title:'paint title'});
	//var name = req.body.name;
	//var password = req.body.password;
});
app.get('/login',function (req,res	){
	var account = req.body.account;
	var password = req.body.password;
	console.log('account:',account);
	console.log('password:',password)
	if(account == password){
		res.render('student',{title:'登录成功'})
	}
})
//404
app.use(function(req,res){
	res.type('text/plain');
	res.status(404);
	res.send('404 ！- Not Found');
});

app.listen(3000,'0.0.0.0',function(){
	console.log('express is running on localhost:3000')

});