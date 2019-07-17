var fs = require('fs');


function write(url,param) {
    fs.readFile(url,function (err, data) {
        if(err) return console.log(err);
        var str = data.toString();
        str = JSON.parse(str);
        str.data.push(param);
        str.total = str.data.length;
        console.log(str);
        var final_str = JSON.stringify(str);
        fs.writeFile(url,final_str,function (err) {
            if(err) return console.log(err);
        })
    })
}

function get_new(url, num) {
    fs.readFile(url,function (err, data) {
        if(err) return console.log(err);
        var Data = data.toString();
        Data = JSON.parse(Data);
        var len = Data.data.length;
        let  final = Data.data[len-1];
        console.log(final)
        for (var i = 1; i < num; i++) {
            final.push(Data.data[len-1-i]);
        }
        return console.log(final)
    })
}

function login_in(url, a, b) {
    fs.readFile(url,function (err, obj) {
        if(err) return console.log(err);
        var obj = obj.toString();
        obj = JSON.parse(obj);
        var password = obj.data.password;
        var id = obj.data.id;
        if(id == a&&password == b)return console.log(1);
         return console.log(0);
    })
}
var demo_str = "./1.json"
var new_data = {
    "id":1234,
    "name":"jake",
    "password":1334
}
//write(demo_str,new_data);
//get_new("./1.json",2);
login_in(demo_str,1234,1334);

//login_in() always return 0;get_new() is wrong ;