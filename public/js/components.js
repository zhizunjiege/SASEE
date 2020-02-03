function timeDifference(date1, date2) {
    let time1 = new Date(date1).valueOf(),
        time2 = new Date(date2).valueOf(),
        time = time2 - time1,
        _time = time;

    let divMap = [1000, 60, 60, 24, 365, 100], nameMap = ['milliseconds', 'seconds', 'minutes', 'hours', 'days', 'years'], returnObj = {};
    for (const [index, value] of divMap.entries()) {
        returnObj[nameMap[index]] = _time % value;
        _time = Math.floor(_time / value);
    }
    returnObj.time = time;
    return returnObj;
}
function counter({ count, doing, done } = {}) {
    let _ = { id: 0 };
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

Vue.component('input-account', {
    inheritAttrs: false,
    props: {
        value: String
    },
    template: `
    <div class="form-group form-row">
        <label class="col-3 col-form-label">账号：</label>
        <input v-bind="$attrs" :value="value" @input="$emit('input',$event.target.value)" type="text" class="form-control col-9" placeholder="1~16位字母、数字或下划线" pattern="\\w{1,16}" required>
    </div>
    `
});

Vue.component('input-password', {
    inheritAttrs: false,
    props: {
        value: String,
        label: {
            type: String,
            default: '密码'
        }
    },
    template: `
    <div class="form-group form-row">
        <label class="col-3 col-form-label">{{label}}：</label>
        <input v-bind="$attrs" :value="value" @input="$emit('input',$event.target.value)" type="password" class="form-control col-9" placeholder="1~16位字母、数字或下划线" pattern="\\w{1,16}" required>
    </div>
    `
});

Vue.component('input-pincode', {
    inheritAttrs: false,
    props: {
        value: String,
        extra: {
            type: Object,
            default: {}
        }
    },
    template: `
    <div class="form-group form-row">
        <label class="col-3 col-form-label">验证码：</label>
        <div class="input-group col-9 px-0">
            <input v-bind="$attrs" :value="value" @input="$emit('input',$event.target.value)" class="form-control px-1" type="text" placeholder="请输入6位验证码"
            pattern="\\d{6}" required>
            <div class="input-group-append">
                <button @click="send" type="button" class="btn btn-outline-primary" :disabled="sent">{{sent?''+count+'s':'发送验证码'}}</button>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            sent: false,
            count: 60
        }
    },
    methods: {
        async send() {
            if ('account' in this.extra && !this.extra.account) {
                this.$alert.warn({ msg: '请输入账号！' });
            } else if ('identity' in this.extra && !this.extra.identity) {
                this.$alert.warn({ msg: '请选择身份！' });
            } else if (await this.$net('get', '/sendPinCode', this.extra)) {
                counter({
                    count: 60,
                    doing: c => {
                        this.count = c;
                    },
                    done: () => { this.sent = false }
                });
                this.count = 60;
                this.sent = true;
            }
        }
    },
});

Vue.component('input-radio', {
    inheritAttrs: false,
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: {
        radios: Array, checked: String
    },
    data() {
        return { in_checked: this.checked }
    },
    watch: {
        checked() {
            this.in_checked = this.checked;
        },
        in_checked() {
            this.$emit('change', this.$data.in_checked);
        }
    },
    template: `
    <div>
        <div v-for="(radio,index) of radios" class="custom-control custom-radio custom-control-inline">
            <input v-bind="$attrs" v-model="in_checked" :value="radio.val" type="radio" name="radios" :id="'radio-'+index+'-'+radio.val" class="custom-control-input" required>
            <label :for="'radio-'+index+'-'+radio.val" class="custom-control-label">{{radio.des}}</label>
        </div>
    </div>
    `
});

Vue.component('input-checkbox', {
    inheritAttrs: false,
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: {
        checkboxs: Array, checked: [Array, Boolean]
    },
    data() {
        return { in_checked: this.checkboxs.length > 1 ? this.checked.slice() : this.checked }
    },
    watch: {
        checked() {
            this.in_checked = this.checkboxs.length > 1 ? this.checked.slice() : this.checked;
        },
        in_checked() {
            this.$emit('change', this.$data.in_checked);
        }
    },
    template: `
    <div>
        <div v-for="(checkbox,index) of checkboxs" class="custom-control custom-checkbox custom-control-inline">
            <input v-bind="$attrs" v-model="in_checked" :value="checkbox.val" type="checkbox" :id="'checkbox-'+index+'-'+checkbox.val" class="custom-control-input">
            <label :for="'checkbox-'+index+'-'+checkbox.val" class="custom-control-label">{{checkbox.des}}</label>
        </div>
    </div>
    `
});
/* Vue.component('input-file', {

}); */
Vue.component('form-button-group', {
    template: `
    <div class="form-row justify-content-between align-items-center mb-3">
        <button class="btn btn-secondary col-12 col-md-4 mb-3 mb-md-0" type="reset">重置</button>
        <button class="btn btn-primary col-12 col-md-4 mb-3 mb-md-0" type="submit">提交</button>
    </div>
    `
})


Vue.component('bs4-dropdown', {
    template: `
    <div class="dropdown">
        <div :class="subClass" class="dropdown-toggle" data-toggle="dropdown" :data-display="display">
            <slot name="toggle"></slot>
        </div>
        <ul class="dropdown-menu">
            <template v-for="item in menu">
                <div class="dropdown-item h-100">
                    <slot name="item" :item="item"></slot>
                </div>
                <div v-if="item.divide||false" class="dropdown-divider"></div>
            </template>
        </ul>
    </div>
    `,
    props: {
        display: {
            type: String,
            default: 'static'
        },
        menu: Array,
        subClass: [Object, Array]
    }
});

Vue.component('bs4-listgroup', {
    template: `
    <dl class="list-group" :class="{'list-group-flush':flush}">
        <dd class="list-group-item" :class="{'list-group-item-action':action}" v-for="item in items">
            <slot :item="item"></slot>
        </dd>
    </dl> 
    `,
    props: {
        flush: {
            type: Boolean,
            default: true
        },
        action: {
            type: Boolean,
            default: false
        },
        items: Array
    }
});

Vue.component('app-modal', {
    template: `
    <div class="app-modal">
        <button type="button" @click="$router.back()" class="app-close h1"><span>&times;</span></button>
        <slot></slot>
    </div>
    `
});

const appHead = {
    template: `
    <header>
        <slot></slot>
    </header>
    `
};
const appBody = {
    template: `
    <main>
        <slot></slot>
    </main>
    `
};
const appFoot = {
    template: `
    <footer>
        <slot></slot>
    </footer>
    `
};

const appAlert = {
    template: `
    <div v-show="show_" :class="color">
        <h4 class="alert-heading p-3 mb-0">{{title}}</h4>
        <p class="px-3" style="text-indent:2rem">{{msg}}</p>
        <p v-if="Boolean(count)" class="px-3 py-2 mb-0 border-top border-info">
            消息框将在<strong class="px-1">{{count}}</strong>秒后自动消失,点击
            <a href="#" @click.prevent="hide" class="alert-link">此处</a>可立即关闭。
        </p>
        <div v-else class="border-top border-info btn-group w-100">
            <button @click="_ok" class="btn btn-outline-secondary w-50 border-0"
                style="border-radius:0 0 0 .5rem">关闭</button>
            <div class="border-left border-info"></div>
            <button @click="_cancel" class="btn btn-outline-primary w-50 border-0"
                style="border-radius:0 0 .5rem 0">确定</button>
        </div>
    </div>
    `,
    data() {
        return {
            show_: false,
            type: 'success',
            msg: '',
            count: 0,
            ok: null,
            cancel: null,

            count_: null
        }
    },
    computed: {
        color() {
            return this.$options.color[this.type];
        },
        title() {
            return this.$options.title[this.type];
        }
    },
    methods: {
        hide() {
            this.show_ = false;
            this.count_ && clearTimeout(this.count_.id);
            this.count = 0;
        },
        show({ type = 'success', msg = '', count = 0, ok = () => { }, cancel = () => { } } = {}) {
            this.show_ = true;
            this.type = type;
            this.msg = msg;
            this.ok = ok;
            this.cancel = cancel;
            if (count) {
                this.count_ = counter({
                    count,
                    doing: c => this.count = c,
                    done: () => this.hide()
                });
            } else {
                this.count = 0;
            }
        },
        _ok() {
            this.ok && this.ok();
            this.hide();
        },
        _cancel() {
            this.cancel && this.cancel();
            this.hide();
        }
    },
    color: {
        'success': 'alert-primary',
        'error': 'alert-danger',
        'warn': 'alert-warning'
    },
    title: {
        'success': '成功',
        'error': '错误',
        'warn': '警告'
    }
};
const appBackdrop = {
    template: `
    <div class="row justify-content-center align-items-center h-100 w-100">
        <div class="spinner-border spinner-border-lg text-primary"></div>
    </div>
    `
};

const headLogo = {
    template: `
    <div class="d-flex align-items-center point" @click="$router.push({path:'/'})">
        <h3 class="mb-0 ml-sm-1 ml-md-2 ml-lg-3">自动化科学与电气工程学院</h3>
    </div>
    `
};
const headUser = {
    template: `
    <bs4-dropdown :menu="menu" :subClass="['h-100','mr-3','d-flex','align-items-center','justify-content-around']"
        class="h-100 text-center border-left border-dark point" :class="[online?'bg-primary':'bg-secondary']">
        <template #toggle>
            <img :src="profileUrl" class="float-left rounded-circle" alt="profile" width="48px">
            <div v-if="online">
                <div class="h5 my-0">{{user.name}}</div>
                <div class="d-flex justify-content-center">
                    <span class="badge badge-pill badge-info">{{user.identity}}</span>
                </div>
            </div>
            <h5 v-else class="my-0">未登录</h5>
        </template>
        <template #item="{item}">
            <router-link v-if="item.to" :to="item.to" class="d-block">{{item.des}}</router-link>
            <a v-else :href="item.href" @click.prevent="$net('get',item.href)" class="d-block">{{item.des}}</a>
        </template>
    </bs4-dropdown>
    `,
    props: {
        user: Object,
        online: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        profileUrl() {
            return `../pictures/${this.online ? this.user.profile : 'offline.png'}`;
        },
        menu() {
            return this.online ? [{
                href: '/logout', des: '退出登陆'
            }] : [{
                to: '/login', des: '登陆', divide: true
            }, {
                to: '/register', des: '注册', divide: true
            }, {
                to: '/retrieve', des: '找回密码'
            }]
        }
    }
};

const startPage = {
    template: `
    <div>
        <slot></slot>
    </div>
    `
};
const mainPage = {
    template: `
    <div>
        <slot></slot>
    </div>
    `
};

const mainSidebar = {
    template: `
    <aside class="border-right border-light">
        <bs4-listgroup id="accordion_sidebar" :items="modules" v-slot="{item}">
            <a data-toggle="collapse" :href="'#'+item.name">
                <span class="glyphicon mr-2" :class="item.icon"></span>
                {{item.des}}
                <span class="glyphicon glyphicon-chevron-right float-right"></span>
            </a>
            <div :id="item.name" class="collapse" data-parent="#accordion_sidebar">
                <bs4-listgroup :items="item.subModules" :action="true" v-slot="{item:subItem}">
                    <router-link style="display: block;" :to="'/' + item.name + '/' + subItem.name">
                        <small>{{subItem.des}}</small>
                    </router-link>
                </bs4-listgroup>
            </div>
        </bs4-listgroup>
    </aside>
    `,
    props: {
        modules: {
            type: Array,
            required: true
        }
    }
};
const mainContent = {
    template: `
    <div>
        <slot></slot>
    </div>
    `
};

const footTime = {
    template: `
    <div>
        <p class="mb-0 ml-3">系统时间：<span>{{time}}</span></p>
    </div>
    `,
    data() {
        return {
            time_: Date.now(),
            counter_: 0,
            updater_: 0,
            refresh: 0
        }
    },
    computed: {
        time() {
            return new Date(this.time_).toLocaleISOString().substring(0, 19).replace('T', ' ');
        }
    },
    methods: {
        async update() {
            try {
                let result = await this.$net('get', '/serverTime');
                clearTimeout(this.counter_);
                this.refresh = 0;
                this.time_ = result.time;
                this.updater_ = setTimeout(this.update.bind(this), 5 * 60 * 1000);
                this.count();
            } catch (err) {
                console.log(err);
                if (this.refresh <= 3) {
                    this.refresh++;
                    this.updater_ = setTimeout(this.update.bind(this), 3 * 1000);
                } else {
                    clearTimeout(this.updater_);
                    this.$alert.warn('与服务器失去连接！');
                }
            }
        },
        count() {
            this.time_ += 1000;
            this.counter_ = setTimeout(this.count.bind(this), 1000);
        }
    },
    mounted() {
        this.count();
        this.update();
    }
};
const footLink = {
    template: `
    <div>
        <div v-for="link in links" style="min-width:25%;max-width: 25%;display:inline-block;">
            <router-link v-if="link.to" :to="link.to" class="d-block px-3">{{link.des}}</router-link>
            <a v-else :href="link.href" @click.prevent="$net('get',link.href)" class="d-block px-3">{{link.des}}</a>
        </div>
    </div>
    `,
    data() {
        return {
            links: [{
                to: '/help', des: '获取帮助'
            }, {
                to: '/feedback', des: '用户反馈'
            }, {
                href: '/sasee', des: '学院教务'
            }]
        }
    }
};

const appEmpty = {
    template: `<!-- 占位 -->`
};
const appNotfound = {
    template: `
    <app-modal class="app-container row align-items-center justify-content-center">
        <h3>什么都没找到哦-_-</h3>
    </app-modal>
    `
};

const appLogin = {
    template: `
    <app-modal class="app-container row align-items-center justify-content-center">
        <form class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 text-center center app-modal-opp" 
            @submit.prevent="$net('post', '/login', fields)">
            <input-account v-model="fields.account"></input-account>
            <input-password v-model="fields.password"></input-password>
            <input-radio v-model="fields.identity"
                :radios="[{ val: 'student', des: '学生' }, { val: 'teacher', des: '教师' }, { val: 'admin', des: '管理员' }]"
                class="form-group form-row justify-content-around">
            </input-radio>
            <div class="form-row justify-content-around align-items-center mb-3">
                <input-checkbox v-model="fields.save" :checkboxs="[{ val: 'save', des: '记住密码' }]"
                    class="col-6 col-md-6 mb-3 mb-md-0">
                </input-checkbox>
                <button class="btn btn-primary col-6 col-md-6 mb-3 mb-md-0" type="submit">登陆</button>
            </div>
        </form>
    </app-modal>
    `,
    data() {
        return {
            fields: {
                account: '',
                password: '',
                identity: 'student',
                save: false
            }
        }
    },
    async created() {
        Object.assign(this.fields, await this.$net('local', '/login'));
    }
};
const appRegister = {};
const appRetrieve = {
    template: `
    <app-modal class="app-container row align-items-center justify-content-center">
        <form class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 text-center center app-modal-opp"
            @submit.prevent="$net('post', '/retrieve', fields)">
            <input-radio v-model="fields.identity" class="form-group form-row justify-content-around"
                :radios="[{ val: 'student', des: '学生' }, { val: 'teacher', des: '教师' }]">
            </input-radio>
            <input-account v-model="fields.account"></input-account>
            <input-pincode v-model="fields.pinCode" :extra="{account:fields.account,identity:fields.identity}"></input-pincode>
            <input-password v-model="fields.newPW" label="新密码"></input-password>
            <input-password v-model="fields.repeatPW" label="重复密码"></input-password>
            <form-button-group></form-button-group>
        </form>
    </app-modal>
    `,
    data() {
        return {
            fields: {
                account: '',
                pinCode: '',
                identity: 'student',
                newPW: '',
                repeatPW: ''
            }
        }
    },
};

const components = {
    appHead, appBody, appFoot,

    appAlert, appBackdrop,

    headLogo, headUser,

    startPage, mainPage,
    mainSidebar, mainContent,

    footTime, footLink
},
    routes = [{
        path: '/', components: { system: appEmpty }
    }, {
        path: '/login', components: { system: appLogin }
    }, {
        path: '/register', components: { system: appRegister }
    }, {
        path: '/retrieve', components: { system: appRetrieve }
    }, {
        path: '*', components: { system: appNotfound }
    }];

export {
    components, routes
}