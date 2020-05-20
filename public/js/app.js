import components, { counter } from './components.js'

Date.prototype.toLocaleISOString = function () {
    return new Date(this.valueOf() - this.getTimezoneOffset() * 1000 * 60).toISOString().substr(0, 19).replace('T', ' ');
};

const _push = VueRouter.prototype.push;
VueRouter.prototype.push = function (to) {
    return _push.call(this, to).catch(err => err);
};

const app = new Vue({
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
            path: '/license', component: components.appLicense
        }, {
            path: '*', component: components.appNotFound
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
            href: 'http://www.buaa.edu.cn/', des: '学校官网'
        }, {
            href: 'http://dept3.buaa.edu.cn/', des: '学院官网'
        }, {
            href: 'http://10.200.21.61:7001/', des: '本科教务'
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
            return `../img/${this.online ? this.user.profile : 'offline.png'}`;
        },
        userMenu() {
            return this.online ? [{
                to: '/system', des: '返回主页', divide: true
            }, {
                listener: async () => {
                    let result = await this.$axiosGet('/logout');
                    if (result.status) this.$emit('logout', '/');
                    this.$alertResult(result);
                }, des: '退出登陆'
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
                    this.serverTime.updater_ = setTimeout(this.timeUpdate.bind(this), 8 * 1000);
                } else {
                    clearTimeout(this.serverTime.updater_);
                    this.$alertError('与服务器失去连接！');
                }
            }
        },
        async getModules() {
            let result = await this.$axiosGet('/modules');
            if (result.status) {
                let modules = [], routes = [];
                for (const module of result.routes) {
                    let _module = {
                        name: module.path,
                        des: module.des,
                        icon: module.icon,
                        subModules: []
                    }, _route = {
                        path: `/${module.path}`,
                        component: components.mainPage,
                        children: []
                    };
                    modules.push(_module);
                    routes.push(_route);
                    for (const subModule of module.subs) {
                        if (subModule.des) {
                            _module.subModules.push({
                                name: subModule.path,
                                des: subModule.des
                            });
                        }
                        if (subModule.component) {
                            _route.children.push({
                                path: subModule.path,
                                component: () => import(`/components?module=${module.path}&component=${subModule.component}`)
                            });
                        }
                    }
                }
                this.modules = modules;
                this.$router.addRoutes(routes);
                return true;
            } else {
                this.$alertError(result.msg);
                this.$router.push({ path: `/?prevent=${this.$route.path}` });
                return false;
            }
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
    localStorage.setItem('status', JSON.stringify({
        online: app.online,
        user: app.user
    }));
});

// axios.defaults.timeout = 5000;
axios.interceptors.response.use(response => {
    if (response.data.offline) {
        app.$alertError('登陆信息失效，请重新登陆！');
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
/* Vue.prototype.$getComponent = function (module, component) {
    return import(`/components?module=${module}&component=${component}`);
}; */
Vue.prototype.$alertWarn = function (msg, ok, cancel) {
    app.alertShow({ type: 'warn', msg, ok, cancel });
};
Vue.prototype.$alertSuccess = function (msg = '操作成功！') {
    app.alertShow({ type: 'success', msg, count: 2 });
};
Vue.prototype.$alertError = function (msg = '操作失败！') {
    app.alertShow({ type: 'error', msg });
};
Vue.prototype.$alertResult = function (result) {
    this[`$alert${result.status ? 'Success' : 'Error'}`](result.msg);
};

app.$router.beforeEach((to, from, next) => {
    if (to.path === from.query.prevent) {
        next(false);
    } else {
        next();
    }
});

//监听
app.$on('login', async function (result) {
    // this.loading = true;
    if (await this.getModules()) {
        this.online = true;
        this.user = result.user;
        this.$router.push({ path: '/system' });
    }
    // this.loading = false;
});
app.$on('logout', async function (path) {
    this.online = false;
    this.loading = false;
    this.modules = [];
    this.$router.push({ path, query: { prevent: this.$route.path } });
});

//挂载
app.loading = true;
app.$mount('#app');
app.timeCount();
app.timeUpdate();

app.$axiosGet('/query').then(async res => {
    if (res.online) {
        let data = JSON.parse(localStorage.getItem('status'));
        if (data) {
            app.online = data.online;
            app.user = data.user;
        }
        await app.getModules();
    } else {
        app.$router.push({ path: '/' });
    }
    app.loading = false;
});
