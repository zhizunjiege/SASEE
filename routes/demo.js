var action = require("./action")
var mysql = require("./sql")
const SqlString = require('sqlstring');


sql = "SELECT * FROM final WHERE category = 4 and gr= ?";
mysql.query(sql, 2, function (err, data) {
    if (err) console.log(err)
    console.log(data.length)
})