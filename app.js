/* 增强原生内置对象 */
Array.prototype.remove = function (val) {
    let index = this.indexOf(val);
    if (index >= 0) this.splice(index, 1);
    return this;
};
Date.prototype.toLocaleISOString = function (mode = 'readable') {
    let raw = new Date(this.valueOf() - this.getTimezoneOffset() * 1000 * 60).toISOString();
    switch (mode) {
        case 'readable':
            return raw.replace('T', ' ').replace('Z', '').substr(0, 19);
        default:
            return raw;
    }
};
Promise.allSettled = function (promiseArray) {
    let len = promiseArray.length,
        results = new Array(len);
    return new Promise(resolve => {
        for (let i = 0; i < len; i++) {
            let index = i;
            promiseArray[i].then(value => {
                results[index] = {
                    status: 'fulfilled',
                    value
                };
            }).catch(reason => {
                results[index] = {
                    status: 'rejected',
                    reason
                };
            }).finally(() => {
                let flag = true;
                for (let j = 0; j < len; j++) {
                    if (!results[j]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    resolve(results);
                }
            });
        }
    });
};

const express = require('express');
const session = require('express-session');

const common = require('./common');
const file = require('./scripts/file');

const config = require('./config.json');

/* 增强express的response对象 */
const errorHandler = function (res, err) {
    if (err) {
        let msg = '服务器出现错误，请稍后重试！';
        if (err instanceof Error) {
            console.error(err);
        } else {
            for (const [errCode, errMsg] of Object.entries(res.errors)) {
                if (err == errCode) {
                    msg = errMsg;
                    break;
                }
            }
        }
        res.json({
            status: false,
            msg
        });
    }
};
express.response.do = function (func) {
    const h = err => {
        errorHandler(this, err);
    };
    func(h).catch(h);
};
express.request.logout = function () {
    return new Promise((resolve, reject) => {
        this.session.destroy(err => {
            if (err) reject(err);
            resolve();
        });
    });
}

const app = express();

app.set('strict routing', true);

app.use(express.static(__dirname + '/dist'));

if (app.get('env') == 'development') {
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.config.dev');
    const WebpackDevMiddleware = require('webpack-dev-middleware');
    const WebpackHotMiddleware = require('webpack-hot-middleware');
    const compiler = webpack(webpackConfig);
    app.use(WebpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath
    }));
    app.use(WebpackHotMiddleware(compiler));
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    resave: true,//每次请求都保存session，即使session未更改
    secret: 'SASEE', //使用随机自定义字符串进行加密
    saveUninitialized: false,//不保存未初始化的cookie，也就是未登录的cookie
    cookie: {
        maxAge: app.get('env') == 'development' ? 20 * 60 * 1000 : 30 * 60 * 1000,//设置cookie的过期时间
    }
}));

app.use((req, res, next) => {
    res.errors = config.errors;
    next();
});

/* 路由 */

app.get('/query', (req, res) => {
    res.json({ online: req.session.uid ? true : false });
});

app.post('/login', common.login);
app.post('/signup', common.signup);
app.get('/sendPinCode', common.sendPinCode);
app.post('/retrieve', common.retrieve);

app.get('/license', (req, res) => {
    res.do(async () => {
        res.sendFile(`license.html`, { root: `${__dirname}/modules/system/resources/html` });
    });
});

app.get('/serverTime', (req, res) => {
    res.json({
        status: true,
        time: Date.now()
    });
});

/* 验证、更新session */
app.use((req, res, next) => {
    if (req.session.uid) {
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
});

app.get('/logout', common.logout);

const modules = ['system', 'user', 'bysj', 'kcsj', 'scsx'];
for (const iterator of modules) {
    let sub = require(`./modules/${iterator}/index`);
    app.use(`/${iterator}`, sub);
}
app.get('/modules', common.getModules);

app.get('/modules-list', (req, res) => {
    let modules = [];
    for (const [i, v] of config.routes.entries()) {
        modules.push({
            val: i,
            des: v.des
        });
    }
    modules.shift();
    res.json({
        status: true,
        modules
    });
});

app.post('/modules-opt', (req, res) => {
    let { mode, modules } = req.body;
    res.do(async () => {
        for (const i of modules) {
            config.routes[i].open = mode;
        }
        await file.writeJson('./config.json', config);
        await req.logout();
        res.json({
            status: true,
            offline: true,
            msg: '修改成功，请重新登录！'
        });
    })
});

app.get('/reset-system', (req, res) => {
    res.do(async () => {
        for (const [i, v] of config.routes.entries()) {
            v.open = i <= 1;
        }
        await file.writeJson('./config.json', config);
        let promises = [];
        for (const iterator of modules) {
            let reset = require(`./modules/${iterator}/reset`);
            promises.push(reset());
        }
        await Promise.allSettled(promises);
        await req.logout();
        res.json({
            status: true,
            offline: true,
            msg: '系统重置成功，请重新登录！'
        });
    });
});

app.use((req, res) => {
    res.type('text/html');
    res.status(404);
    res.send(`您要的东西没找到哦-_-，看看地址是不是输错了？`);
});

app.listen(3000, '::', () => {
    console.log('express is running on localhost:3000')
});
