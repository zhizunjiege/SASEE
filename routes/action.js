var fs = require('fs');
const notice_url = "../json/notice.json"

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
        //console.log(Data)
        var len = Data.data.length;
        var  final = {"data":[

            ]};
        for (var i = 0; i < num; i++) {
            final.data.push(Data.data[len-1-i]);
        }console.log(final.data)
        return final.data;
    })
}
function get(url, num) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, (error, data) => {
            if(error) return reject(error);
            var Data = data.toString();
            Data = JSON.parse(Data);
            //console.log(Data)
            var len = Data.data.length;
            var  final = {"data":[

                ]};
            for (var i = 0; i < num; i++) {
                final.data.push(Data.data[len-1-i]);
            }//console.log(final.data)
            return resolve(final.data);
        });
    });
};

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
    "top": true,
    "title": "等待指示",
    "publisher": "管理员",
    "category": "综合实验",
    "date": "2019/7/13"
}
var an =  {
    top: true,
    title: '系统开通',
    publisher: '管理员',
    category: '综合实验',
    date: '2019/7/11'
}

//write(notice_url,new_data);
//get_new(notice_url,2);
//login_in(demo_str,1234,"none");

exports.login_in = login_in;
exports.get_new = get;
exports.write = write;
