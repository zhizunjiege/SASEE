var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

var login = require("./routes/login")
var view = require("./routes/view")
var NOTfound = require("./routes/NOTfound")
var upload = require("./routes/upload")
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
    login(req,res)
});

app.get('/views', (req, res) => {
    view(req,res)
});
app.post('/upload',(req,res)=>{
    upload(req,res)
});

//404
app.use(function (req, res) {
    NOTfound(req,res)
});

app.listen(3000, '::', function () {
    console.log('express is running on localhost:3000')

});