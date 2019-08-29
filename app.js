const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser=require("cookie-parser");
const app = express();

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
    console.log(req.cookies);
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

//404
app.use(function (req, res) {
    NotFound(req,res)
});

app.listen(3000, '::', function () {
    console.log('express is running on localhost:3000')

});