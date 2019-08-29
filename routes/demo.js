var action = require("./action")
var mysql = require("./sql")

let sql = "INSERT INTO student SET ?";
let info = {mail: "11234@qq.com"};
let account = 2;
let up_sql = "UPDATE student SET ? WHERE account = ?";
mysql.query(up_sql, [info, account], function (err, data) {
    if (err) console.log(err);
    console.log(data);
});
