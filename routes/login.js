const mysql = require("./sql");


function login(req, res) {
    let account = Number(req.body.account),
        password = req.body.password,
        identity = req.body.identity;

    //验证用户输入的代码

    let sql_login = "SELECT name,gender,password FROM ?? user WHERE account = ?;SELECT * FROM news ORDER BY top DESC,date DESC LIMIT 10 OFFSET 0";
    mysql.find(sql_login, [identity, account])
        .then(data => {
            let user = data[0][0],
                news=data[1];
            if (password === user.password) {
                req.session.account = account;
                user.profile =  (user.gender =='男' ? 'man' : 'woman') + '_' + identity + '.png';
                user.identity = identity;
                res.render(process.cwd() + '/resourses/common/views/user', {user,news})
            }
            else {
                res.send('密码错误，请返回输入重试！');
            }
        });
}

module.exports = login;
