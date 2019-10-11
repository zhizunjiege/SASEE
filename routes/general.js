function notFound(req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('您要的东西没找到哦-_-');
}
function logout(req, res) {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/');
    });
}
function redirect(req, res) {
    if (req.session.identity) {
        res.redirect('/' + req.session.identity + '/');
    } else {
        res.render('login');
    }
}
function auth({ url = '/', identity, CONSTANT } = {}) {
    return (req, res, next) => {
        if (req.session.account && req.session.identity == identity) {
            req.APP_CONSTANT = CONSTANT;
            next();
        } else {
            if (req.method.toLowerCase() == 'post') {
                res.location(url).status(403).send('登陆信息失效，请重新登陆！');
            } else {
                res.redirect(url);
            }
        }
    };
}
module.exports = { notFound, logout, redirect, auth };