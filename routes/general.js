function notFound(req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 ！- Not Found 该页面未建立');
}
function logout(req, res) {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/');
    });
}
function redirect(req, res) {
    if (req.session.account) {
        res.redirect('/' + req.session.identity + '/');
    } else {
        res.render('login');
    }
}
function auth({ url = '/',CONSTANT } = {}) {
    return (req, res, next) => {
        if (!req.session.account) {
            if (req.method.toLowerCase() == 'post') {
                res.location(url).status(403).send('登陆信息失效，请重新登陆！');
            } else {
                res.redirect(url);
            }
        } else {
            req.APP_CONSTANT = CONSTANT;
            next();
        }
    };
}
module.exports = { notFound, logout, redirect, auth };