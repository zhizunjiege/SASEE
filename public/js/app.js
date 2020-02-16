import components from './components.js'
// import axios from '/frames/axios/axios.js'

Date.prototype.toLocaleISOString = function () {
    return new Date(this.valueOf() - this.getTimezoneOffset() * 1000 * 60).toISOString().substr(0, 19).replace('T', ' ');
};
function counter({ count, doing, done } = {}) {
    let _ = { id: null };
    function _countDown() {
        if (count) {
            doing && doing(count);
            count--;
            _.id = setTimeout(() => {
                _countDown();
            }, 1000);
        } else {
            done && done();
        }
    }
    _countDown();
    return _;
}

const _push = VueRouter.prototype.push;
VueRouter.prototype.push = function (to) {
    return _push.call(this, to).catch(err => err);
};

const app = new Vue({
    el: '#app',
    router: new VueRouter({
        routes: [{
            path: '/', component: components.startPage
        }, {
            path: '/login', component: components.appLogin
        }, {
            path: '/register', component: components.appRegister
        }, {
            path: '/retrieve', component: components.appRetrieve
        }, {
            path: '*', component: components.appNotfound
        }]
    }),
    data: {
        online: false,
        loading: false,
        user: {
            profile: '',
            name: '',
            identity: ''
        },
        lastWriteTime: Date.now(),
        modules: [],
        alert: {
            show_: false,
            type: 'success',
            msg: '',
            count: 0,
            ok: null,
            cancel: null,

            count_: null
        },
        serverTime: {
            time_: Date.now(),
            counter_: 0,
            updater_: 0,
            refresh: 0
        },
        footLinks: [{
            to: '/help', des: '获取帮助'
        }, {
            to: '/feedback', des: '用户反馈'
        }, {
            href: '/sasee', des: '学院教务'
        }]
    },
    computed: {
        alertColor() {
            return this.$options.alertColor[this.alert.type];
        },
        alertTitle() {
            return this.$options.alertTitle[this.alert.type];
        },
        userProfileUrl() {
            return `../pictures/${this.online ? this.user.profile : 'offline.png'}`;
        },
        userMenu() {
            return this.online ? [{
                event: this.logout.bind(this), des: '退出登陆'
            }] : [{
                to: '/login', des: '登陆', divide: true
            }, {
                to: '/register', des: '注册', divide: true
            }, {
                to: '/retrieve', des: '找回密码'
            }]
        },
        footTime() {
            return new Date(this.serverTime.time_).toLocaleISOString().substring(0, 19).replace('T', ' ');
        }
    },
    methods: {
        alertHide() {
            this.alert.show_ = false;
            this.alert.count_ && clearTimeout(this.alert.count_.id);
            this.alert.count = 0;
        },
        alertShow({ type = 'success', msg = '', count = 0, ok = () => { }, cancel = () => { } } = {}) {
            this.alert.show_ = true;
            this.alert.type = type;
            this.alert.msg = msg;
            this.alert.ok = ok;
            this.alert.cancel = cancel;
            if (count) {
                this.alert.count_ = counter({
                    count,
                    doing: c => this.alert.count = c,
                    done: () => this.alertHide()
                });
            } else {
                this.alert.count = 0;
            }
        },
        alertOk() {
            this.alert.ok && this.alert.ok();
            this.alertHide();
        },
        alertCancel() {
            this.alert.cancel && this.alert.cancel();
            this.alertHide();
        },
        timeCount() {
            this.serverTime.time_ += 1000;
            this.serverTime.counter_ = setTimeout(this.timeCount.bind(this), 1000);
        },
        async timeUpdate() {
            try {
                let result = await this.$axiosGet('/serverTime');
                clearTimeout(this.serverTime.counter_);
                this.serverTime.refresh = 0;
                this.serverTime.time_ = result.time;
                this.serverTime.updater_ = setTimeout(this.timeUpdate.bind(this), 5 * 60 * 1000);
                this.timeCount();
            } catch (err) {
                console.log(err);
                if (this.serverTime.refresh <= 3) {
                    this.serverTime.refresh++;
                    this.serverTime.updater_ = setTimeout(this.timeUpdate.bind(this), 3 * 1000);
                } else {
                    clearTimeout(this.serverTime.updater_);
                    this.$alertWarn('与服务器失去连接！');
                }
            }
        },
        login(result) {
            console.log('login');
            console.log(result);
            if (result.status) {
                let modules = [], routes = [];
                this.loading = true;
                for (const module of result.modules) {
                    let _module = {
                        name: module.name,
                        des: module.des,
                        icon: module.icon,
                        subModules: []
                    }, _route = {
                        path: `/${module.name}`,
                        component: components.mainPage,
                        children: []
                    };
                    modules.push(_module);
                    routes.push(_route);
                    for (const subModule of module.subModules) {
                        if (subModule.des) {
                            _module.subModules.push({
                                name: subModule.name,
                                des: subModule.des
                            });
                        }
                        if (subModule.component) {
                            _route.children.push({
                                path: subModule.name,
                                component: () => import(`/components?module=${module.name}&component=${subModule.component}.js`)
                            });
                        }
                    }
                }
                this.modules = modules;
                this.$router.addRoutes(routes);
                this.user = result.user;
                this.online = true;
                this.$router.push({ path: '/system/news' });
                this.loading = false;
            } else {
                this.$alert.error(result.msg);
            }
        },
        async logout() {
            console.log('logout');
            let result = await this.$axiosGet('/logout');
            if (result.status) {
                this.online = false;
                this.loading = false;
                this.modules = [];
                this.$router.push({ path: `/?preventBack=${this.$route.path}` });
            }
            this[`$alert${result.status ? 'Success' : 'Error'}`](result.msg);
        }
    },
    alertColor: {
        'success': 'alert-primary',
        'error': 'alert-danger',
        'warn': 'alert-warning'
    },
    alertTitle: {
        'success': '成功',
        'error': '错误',
        'warn': '警告'
    }
});

window.addEventListener('beforeunload', e => {
    let msg = '离开页面将可能丢失数据，请谨慎操作！';
    e.returnValue = msg;
    return msg;
});
window.addEventListener('unload', e => {
    app.lastWriteTime = Date.now();
    localStorage.setItem('status', JSON.stringify(app.$data));
});

axios.interceptors.response.use(response => {
    if (response.data.offline) {
        app.$alertWarn('登陆信息失效，请重新登陆！');
        app.online = false;
        app.loading = false;
        app.modules.splice(2);
        app.$router.push({ path: '/login' });
    }
    return response.data;
}, err => {
    return Promise.reject(err);
});
Vue.prototype.$axios = axios;
Vue.prototype.$axiosGet = function (url, params) {
    return this.$axios({
        url, params,
        method: 'get'
    });
};
Vue.prototype.$axiosPost = function (url, data) {
    return this.$axios({
        url, data,
        method: 'post'
    });
};
Vue.prototype.$alertWarn = function (msg, ok, cancel) {
    app.alertShow({ type: 'warn', msg, ok, cancel });
};
Vue.prototype.$alertSuccess = function (msg = '操作成功！') {
    app.alertShow({ type: 'success', msg, count: 2 });
};
Vue.prototype.$alertError = function (msg = '操作失败！') {
    app.alertShow({ type: 'error', msg });
};

app.$router.beforeEach((to, from, next) => {
    if (to.path === from.query.preventBack) {
        next(false);
    } else {
        if (to.path == '/login') {
            app.online = false;
        }
        next();
    }
});

app.$router.push({ path: '/' });
app.timeCount();
app.timeUpdate();

app.$axiosGet('/query').then(res => {
    if (res.online) {
        let data = JSON.parse(localStorage.getItem('status'));
        if (data) {
            app.online = data.online;
            app.user = data.user;
            app.modules = data.modules;
        }
    }
});


/* netRouter.post('/login', async function (data) {
    //`this` bind to vue instance
    let _data = Object.assign({}, data);
    delete _data.save;
    _data.password = objectHash.MD5(_data.password);
    let result = await this.$post('/login', _data);
    if (result.status) {
        let routes = [];
        app.loading = true;
        app.modules.push(...result.modules);
        for (const module of result.modules) {
            for (const subModule of module.subModules) {
                let _module = {
                    path: `/${module.name}/${subModule.name}`,
                    components: {
                        default: import(`/resourses?module=${module.name}&component=${component}.js`),
                        system: components.appEmpty
                    },
                    children: []
                };
                routes.push(_module);
                for (const route of subModule.routes) {
                    _module.children.push({
                        path: route.path,
                        components: {
                            default: bindModule(module.name, route.component),
                            system: components.appEmpty
                        }
                    });
                }
            }
            try {
                netRouter.load(module.name, (await import(`/resourses?module=${module.name}&net=net.js`)).default);
            } catch (err) {
                console.log(err);
            }
        }
        app.$router.addRoutes(routes);
        app.user = result.user;
        app.online = true;
        app.$router.push({ path: '/' });
        app.loading = false;

        localStorage.setItem('account', data.account);
        localStorage.setItem('identity', data.identity);
        if (data.save) {
            localStorage.setItem('password', data.password);
            localStorage.setItem('save', 'user');
        } else {
            localStorage.removeItem('password', data.password);
            localStorage.setItem('save', 'auto');
        }
    } else {
        app.$alert.error(result.msg);
    }
    return result.status;
}); */

/* netRouter.get('/logout', async function () {
    let result = await this.$get('/logout');
    if (result.status) {
        app.online = false;
        app.loading = false;
        app.modules.splice(2);
        app.$router.push({ path: '/' });
    }
    this.$alert[result.status ? 'success' : 'error'](result.msg);
    return result.status;
});

netRouter.get('/sendPinCode', async function (data) {
    let result = await this.$get('/sendPinCode', data);
    this.$alert[result.status ? 'success' : 'error'](result.msg);
    return result.status;
}); */
