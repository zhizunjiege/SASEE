import { components, routes } from './components.js'
import netRouter from './netRouter.js'

Date.prototype.toLocaleISOString = function () {
    return new Date(this.valueOf() - this.getTimezoneOffset() * 1000 * 60).toISOString().substr(0, 19).replace('T', ' ');
};
$.extend({
    ajaxPromise(options) {
        return new Promise((resolve, reject) => $.ajax(options).done(data => resolve(data)).fail(err => reject(err)));
    },
    getPromise(url, query) {
        return this.ajaxPromise({
            type: 'GET',
            url,
            data: query,
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8'
        });
    },
    postPromise(url, data) {
        return this.ajaxPromise({
            type: 'POST',
            url,
            data: JSON.stringify(data),
            contentType: 'application/json;charset=UTF-8'
        });
    },
    filePromise(url, data) {
        return this.ajaxPromise({
            type: 'POST',
            url,
            data,
            contentType: 'multipart/form-data;charset=UTF-8'
        });
    }
});

Vue.mixin({
    $module: 'system',
    created() {
        this.$module = this.$options.$module;
    }
});
Vue.prototype.$net = netRouter.net;
Vue.prototype.$get = function (url, data) {
    return $.getPromise(`${this.$module == 'system' ? '' : '/' + this.$module}${url}`, data).then(netRouter.pre().bind(this));
};
Vue.prototype.$post = function (url, data) {
    return $.postPromise(`${this.$module == 'system' ? '' : '/' + this.$module}${url}`, data);
};
Vue.prototype.$file = function (url, data) {
    return $.filePromise(`${this.$module == 'system' ? '' : '/' + this.$module}${url}`, data);
};

const _push = VueRouter.prototype.push;
VueRouter.prototype.push = function (to) {
    return _push.call(this, to).catch(err => err);
}

let _data = JSON.parse(localStorage.getItem('status'));
if (!(_data && Date.now() - _data.time < 5 * 60 * 1000)) {
    _data = {
        online: false,
        loading: false,
        user: {
            profile: '',
            name: '',
            identity: ''
        },
        time: Date.now(),
        modules: [{
            name: 'system', icon: 'glyphicon-eye-open', des: '系统相关',
            subModules: [{
                name: 'news', des: '通知公告'
            }]
        }, {
            name: 'user', icon: 'glyphicon-eye-open', des: '个人空间',
            subModules: [{
                name: 'info', des: '个人信息'
            }]
        }]
    };
}
const appData = _data;
window.addEventListener('beforeunload', e => {
    let msg = '离开页面将可能丢失数据，请谨慎操作！';
    e.returnValue = msg;
    return msg;
});
window.addEventListener('unload', e => {
    appData.time = Date.now();
    localStorage.setItem('status', JSON.stringify(appData));
});

netRouter.pre(function (result) {
    if (result.offline) {
        this.$alert.warn('登陆信息失效，请重新登陆！');
        appData.online = false;
        app.loading = false;
        app.modules.splice(2);
        this.$router.push({ path: '/' });
        throw new Error('offline');
    } else {
        return result;
    }
});

netRouter.local('/login', function () {
    return {
        account: localStorage.getItem('account') || '',
        password: localStorage.getItem('password') || '',
        identity: localStorage.getItem('identity') || 'student',
        save: localStorage.getItem('save') == 'user'
    };
});
netRouter.get('/serverTime', async function () {
    let result = await this.$get('/serverTime');
    return result;
});


const app = new Vue({
    el: '#app',
    data: appData,
    components,
    router: new VueRouter({
        routes
    })
});

Vue.prototype.$alert = {
    warn(msg, ok, cancel) {
        app.$refs.alert.show({ type: 'warn', msg, ok, cancel });
    },
    success(msg = '操作成功！') {
        app.$refs.alert.show({ type: 'success', msg, count: 2 });
    },
    error(msg = '操作失败！') {
        app.$refs.alert.show({ type: 'error', msg });
    }
};

app.$router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        app.online = false;
    }
    next();
});

function bindModule(module, component) {
    return () => import(`/resourses?module=${module}&component=${component}.js`).then(_ => new Promise(resolve => {
        _.default.$module = module;
        resolve(_);
    }))
}

netRouter.post('/register', async function (data) {

});

netRouter.post('/login', async function (data) {
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
                        default: bindModule(module.name, subModule.component),
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
});

netRouter.get('/logout', async function () {
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
});

netRouter.post('/retrieve', async function (data) {

});