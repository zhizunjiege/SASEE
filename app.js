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
const path = require('path');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

//错误统一捕获与处理
const _errorHandler = function (req, res, err) {
    let msg = '服务器出现错误，请稍后重试！';
    if (err instanceof Error) {
        console.error(`----------运行出错,请检查代码！----------`);
        console.error(` 用户身份：${req.session.identity},用户ID：${req.session.uid},用户姓名：${req.session.name}`);
        console.error(` 访问路径：${req.originalUrl},附带参数：${JSON.stringify(req.body)}`);
        console.error(' 错误信息：\n', err);
    } else {
        const errMap = req.app.locals.error || global.error;
        for (const [errCode, errMsg] of Object.entries(errMap)) {
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
};
const _bindHandler = function (funcs) {
    for (const i in funcs) {
        let func = funcs[i];
        if (func instanceof Array) {
            _bindHandler(func);
        } else if (func instanceof Function) {
            funcs[i] = function (req, res, next) {
                return Promise.resolve(func(req, res, next)).catch(err => _errorHandler(req, res, err));
            }
        }
    }
    return funcs;
}
const _get = express.application.get;
express.application.get = function (path, ...args) {
    if (args.length) {
        _bindHandler(args);
    }
    return _get.call(this, path, ...args);
}
const _post = express.application.post;
express.application.post = function (path, ...args) {
    if (args.length) {
        _bindHandler(args);
    }
    return _post.call(this, path, ...args);
}

//增强response和request对象
express.request.logout = function () {
    return new Promise((resolve, reject) => {
        this.session.destroy(err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
const _download = express.response.download;
express.response.download = function (...args) {
    return new Promise((resolve, reject) => {
        _download.call(this, ...args, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
};

const app = express();

const node_env = app.get('env');

//获取全局配置
const error = require('./error.json');
const config = require('./config.json');
for (const k in config.files) {
    config.files[k] = path.resolve(__dirname, config.files[k]);
}
for (const v of Object.values(config)) {
    Object.assign(v, v[node_env]);
    delete v.development;
    delete v.production;
}
//导出全局配置
global.error = error;
global.config = config;

app.set('strict routing', true);

//选择运行模式
if (node_env == 'development') {
    const webpack = require('webpack');
    const webpackConfig = require('./webpack.config.dev');
    const WebpackDevMiddleware = require('webpack-dev-middleware');
    const WebpackHotMiddleware = require('webpack-hot-middleware');
    const compiler = webpack(webpackConfig);
    app.use(WebpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath
    }));
    app.use(WebpackHotMiddleware(compiler));
} else {
    app.use(express.static(config.files.public));
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    store: new MemoryStore({ checkPeriod: 5 * 60 * 1000 }),
    resave: false,
    secret: 'SASEE', //使用随机自定义字符串进行加密
    saveUninitialized: false,//不保存未初始化的cookie，也就是未登录的cookie
    cookie: {
        maxAge: node_env == 'development' ? 20 * 60 * 1000 : 30 * 60 * 1000,//设置cookie的过期时间
    }
}));

//加入基础路由
app.use(require('./modules/index'));

//加入各模块
const modules = require('./modules/routes.json').map(el => el.path);
for (const i of modules) {
    let sub = require(`./modules/${i}/index`);
    app.use(`/${i}`, sub);
}

//404放到最后
app.use((req, res) => {
    res.type('text/html');
    res.status(404);
    res.send(`您要的东西没找到哦-_-，看看地址是不是输错了？`);
});

//打印程序信息
const { version, host, port } = config.app;
app.listen(port, '::', () => {
    console.log(`SASEE ${version} is running in "${node_env}" mode , listening ${host}:${port}.`)
});