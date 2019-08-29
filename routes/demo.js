var action = require("./action")
var mysql = require("./sql")
const SqlString = require('sqlstring');

//let sql = "INSERT INTO student SET ?";
//let info = {mail: "11234@qq.com"};
//let account = 2;
//let up_sql = "UPDATE student SET ? WHERE account = ?";
//mysql.query(up_sql, [info, account], function (err, data) {
//    if (err) console.log(err);
//    console.log(data);
//});
const encrypt = require("./encrypt");
val = 'hello';
val_ = encrypt.sign(val, 'sasee');
console.log(val_)
got = encrypt.unsign(val_, 'sasee');
console.log('got', got)
