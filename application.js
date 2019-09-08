var express = require ('express');
var app = express();

var fs = require("fs");
//bodyParser用于处理 JSON, Raw, Text 和 URL 编码的数据
var bodyParser = require('body-parser');
//multer 处理enctype="multipart/form-data"（设置表单的MIME编码）的表单数据
var multer = require('multer');
//托管静态文件，express.static 中间件来设置静态文件路径
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extend:false}));
//设置保存路径，为当前路径
app.use(multer({dest:'/content'}));

app.get('/index.html',function (req,res) {
    res.sendFile( __dirname +"/"+"index.html");
});

//multer在解析完请求体后，会想Request对象中添加一个body对象和一个files对象；
//body对象中包含所提交表单中的文本字段
//files对象中包含通过表单上传的文件
app.post('/file_upload',function (req,res) {
    console.log(req.files[0]);

    var des_file = __dirname +"/"+req.files[0].originalname;
    fs.readFile(req.files[0].path,function (err,data) {
        fs.writeFile(des_file,data,function (err) {
            if(err){
                console.log(err);
            }else{
                response = {
                    message:"File upload success",
                    filename:req.files[0].originalname
                };
            }
            console.log(response);
            res.send(JSON.stringify(response));
        })
    });
});

app.listen(8081,function () {
    console.log('port 8081');
});
