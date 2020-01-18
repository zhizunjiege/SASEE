import _ from './baseComponents.js'
import { components, routes } from './extendComponents.js'
import router from './router.js'

const appData = {
    online: false,
    loading: false,
    user: {
        profile: '',
        name: '陈智杰',
        identity: '学生'
    },
    time: new Date().toLocaleISOString(),
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
    }],
    links: [{
        to: '/help', des: '获取帮助'
    }, {
        to: '/feedback', des: '用户反馈'
    }, {
        to: '/sasee', des: '学院教务'
    }],
    content: {
        title: {
            text: '我的课题',
            s_back: true,
            s_forward: false,
            back() {
                console.log('ccc');
            },
            forward() {
                console.log('ddd');
            }
        }
    },
    alert: {
        show: false,
        type: 'success',
        msg: '修改密码成功!',
        count: 0,
        ok: () => {
            console.log('aaa');
        },
        cancel: () => {
            console.log('bbb');
        }
    },
    events: {}
};

Vue.prototype.$net = router.net;
Vue.prototype.$alert = {
    warn({ msg, ok, cancel } = {}) {
        Object.assign(appData.alert, {
            show: true,
            type: 'warn',
            msg,
            count: 0,
            ok: ok ? ok : () => { },
            cancel: cancel ? cancel : () => { }
        });
    },
    success({ msg, ok, cancel } = {}) {
        Object.assign(appData.alert, {
            show: true,
            type: 'success',
            msg,
            count: 2,
            ok: ok ? ok : () => { },
            cancel: cancel ? cancel : () => { }
        });
    },
    error({ msg, ok, cancel } = {}) {
        Object.assign(appData.alert, {
            show: true,
            type: 'error',
            msg,
            count: 0,
            ok: ok ? ok : () => { },
            cancel: cancel ? cancel : () => { }
        });
    },
    hide() {
        appData.alert.show = false;
    }
};

router.local('/login', function (data) {
    return {
        account: Cookies.get('account') || '',
        password: Cookies.get('password') || '',
        identity: Cookies.get('identity') || 'student',
        save: Cookies.get('save') == 'user'
    };
});

const app = new Vue({
    el: '#app',
    data: appData,
    components,
    router: new VueRouter({
        routes
    })
});

router.post('/login', async function (data) {
    let result = await $.postPromise('/login', data);
    if (result.pass) {
        appData.modules.push(...result.modules);
        let routes = [];
        for (const module of result.modules) {
            for (const subModule of module.subModules) {
                let path = `/${module.name}/${subModule.name}`;
                routes.push({
                    path,
                    component: () => import(`/${module.name}?file=${subModule.component}.js`)
                });
            }
        }
        app.$router.addRoutes(routes);
        app.user = result.user;
        app.online = true;
        app.$router.push({ path: '/' });
    }
});