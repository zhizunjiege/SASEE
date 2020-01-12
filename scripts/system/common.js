/* 通用路由 */

function update(req, res, next) {
    if (req.session.userId) {
        req.session._garbage = Date();
        req.session.touch();
        next();
    } else {
        if (req.get('Frame') == 'jQuery') {
            res.location('/').status(403).send('登陆信息失效啦，请重新登陆。');
        } else {
            res.redirect('/');
        }
    }
}

function serverTime(req, res) {
    res.send(new Date().toLocaleString());
}

function notFound(req, res) {
    res.type('text/html');
    res.status(404);
    res.send(`您要的东西没找到哦-_-，看看地址是不是输错了？`);
}

module.exports = { update, serverTime, notFound };