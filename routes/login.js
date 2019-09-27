const mysql = require("./sql"),
    { paramIfValid } = require('./util');

function authenticate(req, res) {
    let { account, password, identity } = req.body;

    if (!paramIfValid([account, password, identity])) {
        res.status(403).send('数据无效，请重新输入！');
        return;
    }
    
    let sql_query = 'SELECT `group` FROM ?? WHERE account = ? AND password=?';
    mysql.find(sql_query, [identity, account, password])
        .then(data => {
            if (data.length == 0) {
                res.status(403).send('账号或密码错误，请重试！');
                return;
            }
            //设置session
            req.session.account = account;
            req.session.group = data[0].group;
            req.session.identity = identity;
            res.location('/'+identity+'/').send('登陆成功！');
        });
}

function render(req, res) {
    let { identity, account } = req.session,
        sql_query = "SELECT name,gender,`group` FROM ?? user WHERE account = ?;SELECT * FROM news ORDER BY top DESC,date DESC LIMIT 10 OFFSET 0";
    mysql.find(sql_query, [identity, account])
        .then(data => {
            let [[user], news] = data;
            user.profile = (user.gender == '男' ? 'man' : 'woman') + '_' + identity + '.png';
            user.identity = identity;
            res.type('html').render(process.cwd() + req.APP_CONSTANT.VIEWS_COMMON + 'user', { user, news });
        });
}

module.exports = { authenticate, render };
