const mysql = superApp.requireUserModule('mysql');

function modify(req, res) {
    let { account, identity } = req.session,
        { oldPW, newPW } = req.body,
        sql_query = 'SELECT password FROM ?? WHERE account=?',
        sql_update = 'UPDATE ?? SET password=? WHERE account=?';
    mysql.find(sql_query, [identity, account]).then((results) => {
        if (oldPW == results[0].password) {
            return mysql.find(sql_update, [identity, newPW, account]);
        } else {
            res.status(403).send('旧密码错误,请重试！');
        }
    }).then(() => {
        if (!res.headersSent) {
            req.session.destroy();
            res.send('修改密码成功！');
        }
    });
}
function retrieve(req, res) {
    let { account, identity, newPW } = req.body,
        { pinCode } = req.session,
        sql_update = 'UPDATE ?? SET password=? WHERE account=?';
    if (!pinCode || Date.now() - pinCode.time > 5 * 60 * 1000) {
        req.session.pinCode = null;
        res.status(403).send('验证码已失效，请重试！');
    } else if (req.body.pinCode == pinCode.code) {
        mysql.find(sql_update, [identity, newPW, account]).then(() => {
            res.status(200).send('已成功更新邮箱地址！');
        });
    } else {
        res.status(403).send('验证码不匹配,请重试！');
    }
}

module.exports = { modify, retrieve };