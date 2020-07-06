import components from './components.js'

Date.prototype.toLocaleISOString = function () {
    return new Date(this.valueOf() - this.getTimezoneOffset() * 1000 * 60).toISOString();
};

const _push = VueRouter.prototype.push;
VueRouter.prototype.push = function (to) {
    return _push.call(this, to).catch(err => err);
};

const app = new Vue(components.app);

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
Vue.prototype.$axiosFile = function (url, data) {
    return this.$axios({
        url, data,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        }
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
