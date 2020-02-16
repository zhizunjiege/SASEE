const [mysql, util] = superApp.requireUserModules(['mysql', 'util']),
    { VIEWS_COMMON } = superApp.resourses;



function render(req, res) {
    let { identity, group, account } = req.session,
        condition = ` WHERE JSON_CONTAINS(\`group\`,JSON_QUOTE("${group}"))`,
        sql_query = `SELECT name,gender,ifReadLicense FROM ?? user WHERE account = ?;SELECT (SELECT COUNT(*) FROM news${condition}) total,n.* FROM news n${condition} ORDER BY top DESC,id DESC LIMIT 10 OFFSET 0`;
    mysql.find(sql_query, [identity, account])
        .then(data => {
            let [[user], news] = data;
            if (req.session.account == '17375433') {
                user.profile = 'coder_chen.png';
            } else if (req.session.account == '17375372') {
                user.profile = 'coder_du.png';
            } else {
                user.profile = (user.gender == '男' ? 'man' : 'woman') + '_' + identity + '.png';
            }
            user.identity = identity;
            res.render(VIEWS_COMMON + '/user', { PATH: superApp.resourses, user, news });
        }).catch(util.catchError(res));
}

module.exports = { authenticate, render };
