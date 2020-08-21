/* 增强原生内置对象 */
Array.prototype.remove = function (val) {
    let index = this.indexOf(val);
    if (index >= 0) this.splice(index, 1);
    return this;
};
Date.prototype.toLocaleISOString = function () {
    return new Date(this.valueOf() - this.getTimezoneOffset() * 1000 * 60).toISOString().replace('Z', '');
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

/* fs模块使用cwd路径为根目录，随脚本启动位置不同而变化；而require函数使用__dirname，以文件间相对路径关系为准。
故模块加载只要使用相对路径即可，而资源定位需要绝对路径。为确保准确，本程序均使用绝对路径。 */

const express = require('express');
const session = require('express-session');

const common = require('./common');

const config = require('./config.json');

/* 增强express的response对象 */
express.response.do = function (func) {
    new Promise(resolve => resolve(func())).catch(err => {
        let msg = '服务器出现错误，请稍后重试！';
        if (err instanceof Error) {
            console.error(err);
        } else {
            for (const [errCode, errMsg] of Object.entries(this.errors)) {
                if (err == errCode) {
                    msg = errMsg;
                    break;
                }
            }
        }
        this.json({
            status: false,
            msg
        });
        return;
    });
};

const app = express();

app.set('strict routing', true);

app.use(express.static(__dirname + '/dist'));

// app.set('env', 'production');

app.set('env', 'development');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.dev');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const compiler = webpack(webpackConfig);
app.use(WebpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath
}));
app.use(WebpackHotMiddleware(compiler));


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

const modules = ['system', 'user', 'bysj', 'kcsj'];
for (const iterator of modules) {
    let sub = require(`./modules/${iterator}/index`);
    app.use(`/${iterator}`, sub);
}
app.get('/modules', common.getModules);

app.use((req, res) => {
    res.type('text/html');
    res.status(404);
    res.send(`您要的东西没找到哦-_-，看看地址是不是输错了？`);
});

app.listen(3000, '::', () => {
    console.log('express is running on localhost:3000')
});
