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
        console.log(Data)
        Data = JSON.parse(Data);
        console.log(Data)
        var len = Data.data.length;
        var  final = {"data":[

            ]};
        for (var i = 0; i < num; i++) {
            final.data.push(Data.data[len-1-i]);
        }
        return console.log(final)
    })
}

function login_in(url, a, b) {
    fs.readFile(url,function (err, obj) {
        if(err) return console.log(err);
        var obj = obj.toString();
        obj = JSON.parse(obj);

        console.log(password,id)
        if(id == a&&password == b)return 1;
         return 0;
    })
}
var demo_str = "./student.json"
var new_data = {
    "id":1,
    "name":"admin",
    "password":"1"
}
//write(demo_str,new_data);
//get_new(demo_str,2);
//login_in(demo_str,1234,"none");

exports.login_in = login_in;
exports.get_new = get_new;
exports.write = write;
