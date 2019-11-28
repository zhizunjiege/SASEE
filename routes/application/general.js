const [mysql, util] = superApp.requireUserModules(['mysql', 'util']);

function notFound(req, res) {
    res.type('text/html');
    res.status(404);
    res.send(`您要的东西没找到哦-_-`);
}

function permiss(states) {
    return (req, res, next) => {
        if (req.fsm.permiss(states)) {
            next();
        } else {
            res.status(403).send('还没到时间哦^_^');
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
            if (req.get('Frame') == 'jQuery') {
                res.location(url).status(403).send('登陆信息失效，请重新登陆！');
            } else {
                res.redirect(url);
            }
        }
    };
}

function agreeLicense(req, res) {
    let sql_update = 'UPDATE ?? SET ifReadLicense="Y" WHERE account=?';
    mysql.find(sql_update, [req.session.identity, req.session.account]).then(() => {
        res.send('您同意了用户协议！');
    }).catch(util.catchError(res));
}

function disagreeLicense(req, res) {
    req.session.destroy();
    res.location('/');
    res.redirect('/');
}

function serverTime(req, res) {
    let cur = req.fsm.now();
    res.json({
        now: new Date().toLocaleString(),
        description: cur.description,
        end: cur.end
    });
}

module.exports = { notFound, permiss, logout, redirect, auth, agreeLicense, disagreeLicense, serverTime };