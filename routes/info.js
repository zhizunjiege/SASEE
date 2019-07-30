var mysql = require("./sql")
var SQL = "SELECT assigned AS ident FROM student where id = 666"
mysql.query(SQL,[],function (err, data) {
    console.log(data[0].ident)
    if (data[0].ident == true)
        console.log(666)
})