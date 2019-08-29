const mysql = require("./sql");


function login(req,res) {
    const account = req.body.account;
    const password = req.body.password;
    let login_sql = "SELECT * FROM student2016 WHERE account = ?";
    mysql.query(login_sql, account, function (err, data) {
        if (err) res.end('账号或密码错误，请返回重试');
        const result1 = JSON.parse(JSON.stringify(data));
        console.log(result1)
        let pass = account + result1[0].class;
        if (pass == password) {
            let sql = "SELECT * FROM g WHERE category = ?";
            mysql.query(sql, result1[0].category, function (err, data) {
                if (err) res.end('账号或密码错误，请返回重试');
                //console.log('data2',data)
                let result2 = JSON.parse(JSON.stringify(data));
                delete result2.category;
                delete result2.id;
                console.log('result2',result2)
                console.log('result1',result1)
                 res.render('user', {
                    user: {
                        account:result1[0].account,
                        direction:result1[0].category,
                        name: result1[0].name,
                        profile: result1[0].profile,
                        identity: result1[0].identity,
                    },
                    groups:result2
            });
        })
        }
    });
}
    module.exports = login;


