const mysql = require("./sql");
const SendMail = require("./SendMail");
const verify_code = createSixNum();

let account = [];
let mail = [];

SendMail(mail, verify_code);
if (verify_code == submit()) {
    bind(mail, account);
}


function submit() {
    return []
}

function bind(email, account) {
    let info = {mail: email};
    let up_sql = "UPDATE student SET ? WHERE account = ?";
    mysql.query(up_sql, [info, account], function (err, data) {
        if (err) console.log(err);
        console.log("bind email successfully");
    });
}

function createSixNum() {
    let Num = "";
    for (let i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num;
}