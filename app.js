/* 增强原生内置对象 */
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

/* 自定义全局对象 */
global.superApp = {
    server: null,
    errors: null,
    PATH: {
        root: {}
    },
    routes: null,
    startTime: new Date(),
    requireUserModule(name, path = 'root') {
        return require(this.PATH[path][name]);
    },
    requireUserModules(names, path) {
        let modules = {};
        for (const iterator of names) {
            modules[iterator] = this.requireUserModule(iterator, path);
        }
        return modules;
    },
    requireAll(names) {
        let modules = {};
        for (const iterator of names) {
            modules[iterator] = require(iterator);
        }
        return modules;
    },
    transObjToPath(cache, path, node) {
        if (node instanceof Object) {
            for (const [dir, nextNode] of Object.entries(node)) {
                this.transObjToPath(cache, path + '/' + dir, nextNode);
            }
        } else {
            cache[node] = path;
        }
    }
};

/* fs模块使用cwd路径为根目录，随脚本启动位置不同而变化；而require函数使用__dirname，以文件间相对路径关系为准。
故模块加载只要使用相对路径即可，而资源定位需要绝对路径。为确保准确，本程序均使用绝对路径。 */

const { fs, express, 'express-session': session } = superApp.requireAll(['fs', 'express', 'express-session']);

let config = JSON.parse(fs.readFileSync(__dirname + '/config.json', {
    encoding: 'utf8'
}));
superApp.errors = config.errors;
superApp.routes = config.routes;
superApp.transObjToPath(superApp.PATH.root, __dirname, config.paths);

const { PUBLIC, TMP } = superApp.PATH.root;

/* 增强express的response对象 */
express.response.do = function (func) {
    new Promise(resolve => resolve(func())).catch(err => {
        let msg = '服务器出现错误，请稍后重试！';
        if (err instanceof Error) {
            console.error(err);
        } else {
            for (const [errCode, errMsg] of Object.entries(superApp.errors)) {
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

// app.set('env', 'production');
app.set('strict routing', true);
app.use(express.static(PUBLIC));
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

/* 路由 */
app.get('/', (req, res) => {
    res.do(() => {
        res.sendFile('app.html', {
            root: PUBLIC + '/html'
        });
    });
});
app.get('/query', (req, res) => {
    let flag = false;
    if (req.session.userId) {
        flag = true;
    }
    res.json({ online: flag });
});

const common = superApp.requireUserModule('common', 'root');
app.post('/login', common.login);
app.post('/register', common.register);
app.get('/sendPinCode', common.sendPinCode);
app.post('/retrieve', common.retrieve);

app.get('/serverTime', (req, res) => {
    res.json({
        status: true,
        time: Date.now()
    });
});

/* 验证、更新session */
app.use((req, res, next) => {
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
});

app.get('/logout', common.logout);

const modules = superApp.requireUserModules(['system', 'user', 'bysj'], 'root');
for (const iterator of Object.values(modules)) {
    app.use(iterator.route, iterator.app); 6
}
app.get('/modules', common.getModules);
app.get('/components', (req, res) => {
    res.do(async () => {
        let { module, component } = req.query;
        if (component) {
            let file = modules[module].getComponentName(req.session.identity, component);
            res.sendFile(file, { root: `${__dirname}/modules/${module}/components` });
        } else {
            throw 1200;
        }
    });
});

app.use((req, res) => {
    res.type('text/html');
    res.status(404);
    res.send(`您要的东西没找到哦-_-，看看地址是不是输错了？`);
});

superApp.server = app.listen(3000, '::', () => {
    console.log('express is running on localhost:3000')
});
