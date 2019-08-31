const mysql = require("./sql");

function login(req,res) {
    const account = req.body.account;
    const password = req.body.password;
    let login_sql = "SELECT * FROM student2016 WHERE account = ?";
    mysql.query(login_sql, account, function (err, data) {
        if (err) console.log(err);
        data = JSON.parse(JSON.stringify(data));
        console.log(data[0]);

    })
}
module.exports = login;
