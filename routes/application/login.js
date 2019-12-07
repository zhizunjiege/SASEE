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
                return Promise.reject(14);
            }
            //设置session
            req.session.userId = data[0].id;
            req.session.account = data[0].account;
            req.session.name = data[0].name;
            req.session.group = data[0].group;
            req.session.identity = identity;
            data[0].specialty && (req.session.specialty = data[0].specialty);
            data[0].proTitle && (req.session.proTitle = data[0].proTitle);
            res.location('/' + identity + '/').send('登陆成功！');
        }).catch(util.catchError(res, superApp.errorMap));
}

function render(req, res) {
    let { identity, group, account } = req.session,
        condition = ` WHERE JSON_CONTAINS(\`group\`,JSON_QUOTE("${group}"))`,
        sql_query = `SELECT name,gender,ifReadLicense FROM ?? user WHERE account = ?;SELECT (SELECT COUNT(*) FROM news${condition}) total,n.* FROM news n${condition} ORDER BY top DESC,id DESC LIMIT 10 OFFSET 0`;
    mysql.find(sql_query, [identity, account])
        .then(data => {
            let [[user], news] = data;
            user.profile = (user.gender == '男' ? 'man' : 'woman') + '_' + identity + '.png';
            user.identity = identity;
            res.render(VIEWS_COMMON + '/user', { PATH: superApp.resourses, user, news });
        }).catch(util.catchError(res));
}

module.exports = { authenticate, render };
