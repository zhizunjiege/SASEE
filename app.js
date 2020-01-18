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
    errors: {},
    resourses: {
        root: {}
    },
    startTime: new Date(),
    requireUserModule(name, path = 'root') {
        return require(this.resourses[path][name]);
    },
    requireUserModules(names, path) {
        let modules = [];
        for (const iterator of names) {
            modules.push(this.requireUserModule(iterator, path));
        }
        return modules;
    },
    requireAll(names) {
        let modules = [];
        for (const iterator of names) {
            modules.push(require(iterator));
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

const [fs, express, session] = superApp.requireAll(['fs', 'express', 'express-session']);

let config = JSON.parse(fs.readFileSync(__dirname + '/config.json', {
    encoding: 'utf8'
}));
superApp.errors = config.errors;
superApp.transObjToPath(superApp.resourses.root, __dirname, config.paths);

const [common, user] = superApp.requireUserModules([
    'common',
    'user'
], 'root');

const { VIEWS, PUBLIC } = superApp.resourses.root;

/* 增强express的response对象 */

express.response.do = function (asyncFunc) {
    asyncFunc().catch(err => {
        let msg = '服务器出现错误，请稍后重试！';
        if (err instanceof Error) {
            console.log(err);
        } else {
            for (const [errCode, errMsg] of Object.entries(superApp.errors)) {
                if (err == errCode) {
                    msg = errMsg;
                    break;
                }
            }
        }
        this.status(403).send(msg);
        return;
    });
};

const app = express();

app.set('views', VIEWS);
app.set('view engine', 'ejs');
app.set('strict routing', true);
app.set('env', 'production');

app.use(express.static(PUBLIC));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    resave: true,//每次请求都保存session，即使session未更改
    secret: 'SASEE', //使用随机自定义字符串进行加密
    saveUninitialized: false,//不保存未初始化的cookie，也就是未登录的cookie
    cookie: {
        maxAge: app.get('env') == 'development' ? 60 * 60 * 1000 : 15 * 60 * 1000,//设置cookie的过期时间
    }
}));

/* 路由 */
app.get('/', (req, res) => {
    res.sendFile('app.html', {
        root: PUBLIC + '/html'
    }, function (err) {
        if (err) console.log(err);
    });
});
app.get('/admin', user.redirect);

app.post('/login', (req, res) => {
    console.log(req.body);

    res.json({
        pass: true,
        modules: [{
            name: 'bysj', icon: 'glyphicon-eye-open', des: '毕业设计',
            subModules: [{
                name: 'xt', des: '选题', component: 'bysj-xt',
                subModules: [{
                    
                }]
            }, {
                name: 'wdkt', des: '我的课题', component: 'bysj-wdkt'
            }]
        }/* , {
            name: 'zhsy', icon: 'glyphicon-leaf', des: '综合实验',
            subModules: [{
                name: 'xt', des: '选题', component: 'zhsy-xt'
            }, {
                name: 'wdkt', des: '我的课题', component: 'zhsy-wdkt'
            }]
        } */]
    });
});

app.get('/bysj', (req, res) => {
    res.sendFile(req.query.file, {
        root: __dirname + '/bysj'
    }, function (err) {
        if (err) console.log(err);
    });
});
/* app.use('/bysj', superApp.requireUserModule('bysj')); */

app.get('/password', user.password);
app.get('/sendPinCode', user.sendPinCode);
app.post('/retrieve', user.retrieve);

app.get('/register', user.register);

/* 验证、更新session */
app.use(common.update);

app.get('/main', user.main);
app.post('/modify', user.modify);

app.post('/setGeneralInfo', user.setGeneralInfo);
app.post('/setEmailAddr', user.setEmailAddr);

app.get('/logout', user.logout);

app.get('/serverTime', common.serverTime);
app.use(common.notFound);

superApp.server = app.listen(3000, '::', () => {
    console.log('express is running on localhost:3000')
});
