/* 通用路由 */

function update(req, res, next) {
    if (req.session.userId) {
        req.session._garbage = Date();
        req.session.touch();
        next();
    } else {
        res.json({
            offline: true,
            status: false,
            msg: '登陆信息失效，请重新登陆！'
        });
    }
}

function serverTime(req, res) {
    res.json({
        status: true,
        time: Date.now()
    });
}

function notFound(req, res) {
    res.type('text/html');
    res.status(404);
    res.send(`您要的东西没找到哦-_-，看看地址是不是输错了？`);
}

module.exports = { update, serverTime, notFound };