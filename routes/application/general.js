function notFound(req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('您要的东西没找到哦-_-');
}

function permiss(states) {
    return (req, res, next) => {
        if (req.fsm.permiss(states)) {
            next();
        } else {
            res.status(403).send('现阶段不允许该操作！');
        }
    }
}

function logout(path = '/') {
    return (req, res) => {
        req.session.destroy((err) => {
            if (err) throw err;
            res.redirect(path);
        });
    }
}
function redirect(req, res) {
    if (req.session.identity) {
        res.redirect('/' + req.session.identity + '/');
    } else {
        res.render('login');
    }
}
function auth({ url = '/', identity } = {}) {
    return (req, res, next) => {
        if (req.session.account && req.session.identity == identity) {
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
function catchError({ msg = '服务器出现错误，请稍后重试！', typeMap, res } = {}) {
    return err => {
        console.log(err);
        if (Array.isArray(typeMap)) {
            for (const [type, msg] of typeMap) {
                if (err instanceof type) {
                    console.log(msg);
                    res && res.status(403).send(msg);
                    return;
                }
            }
        } else {
            res && res.status(403).send(msg);
        }
    }
}
module.exports = { notFound, permiss, logout, redirect, auth, catchError };