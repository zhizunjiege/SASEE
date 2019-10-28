const [mysql, util] = superApp.requireUserModules(['mysql', 'util']),
    { VIEWS_COMMON } = superApp.resourses;

function authenticate(req, res) {
    let { account, password, identity } = req.body;

    if (!util.paramIfValid([account, password, identity])) {
        res.status(403).send('数据无效，请重新输入！');
        return;
    }

    let sql_query = 'SELECT * FROM ?? WHERE account = ? AND password=?';
    mysql.find(sql_query, [identity, account, password])
        .then(data => {
            if (data.length == 0) {
                res.status(403).send('账号或密码错误，请重试！');
                return;
            }
            //设置session
            req.session.id = data[0].id;
            req.session.account = data[0].account;
            req.session.name = data[0].name;
            req.session.group = data[0].group;
            req.session.identity = identity;
            data[0].specialt && (req.session.specialty = data[0].specialty);
            res.location('/' + identity + '/').send('登陆成功！');
        });
}

function render(req, res) {
    let { identity, account } = req.session,
        sql_query = "SELECT name,gender,`group` FROM ?? user WHERE account = ?;SELECT (SELECT COUNT(*) FROM news) total,n.* FROM news n ORDER BY top DESC,id DESC LIMIT 10 OFFSET 0";
    mysql.find(sql_query, [identity, account])
        .then(data => {
            let [[user], news] = data;
            user.profile = (user.gender == '男' ? 'man' : 'woman') + '_' + identity + '.png';
            user.identity = identity;
            res.render(VIEWS_COMMON + '/user', { PATH: superApp.resourses, user, news });
        });
}

module.exports = { authenticate, render };