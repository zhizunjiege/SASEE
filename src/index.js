import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'

import APP from './app'
import ALERT from './alert'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'

import './style.css';

Date.prototype.toLocaleISOString = function () {
    return new Date(this.valueOf() - this.getTimezoneOffset() * 1000 * 60).toISOString();
};

const _push = VueRouter.prototype.push;
VueRouter.prototype.push = function (to) {
    return _push.call(this, to).catch(err => err);
};

Vue.use(VueRouter);

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

let baseComponents = require.context('./base', false, /\.(vue|js)$/);
baseComponents.keys().forEach(filename => {
    let config = baseComponents(filename);
    Vue.component(filename.split('/').pop().replace(/\.\w+$/, ''), config.default || config);
});

const app = new Vue(APP);
const alert = new Vue(ALERT);

// axios.defaults.timeout = 5000;
axios.interceptors.response.use(
    (response) => {
        if (response.data && response.data.offline) {
            app.reLogin();
        }
        return response.data;
    },
    (err) => {
        return Promise.reject(err);
    }
);

Vue.prototype.$alertWarn = function (msg, ok, cancel) {
    alert.alertShow({ type: "warn", msg, ok, cancel });
};
Vue.prototype.$alertSuccess = function (msg = "操作成功！") {
    alert.alertShow({ type: "success", msg, count: 2 });
};
Vue.prototype.$alertError = function (msg = "操作失败！") {
    alert.alertShow({ type: "error", msg });
};
Vue.prototype.$alertResult = function (result) {
    alert[`$alert${result.status ? "Success" : "Error"}`](result.msg);
};

app.$mount('#app');
alert.$mount('#alert');