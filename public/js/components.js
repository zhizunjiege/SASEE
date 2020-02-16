/* function timeDifference(date1, date2) {
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
} */

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
        <div :class="subclass" class="dropdown-toggle" data-toggle="dropdown" :data-display="display">
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
        subclass: [Object, Array]
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

/* Vue.component('app-modal', {
    template: `
    <div class="app-modal">
        <button type="button" @click="$router.back()" class="app-close h1"><span>&times;</span></button>
        <slot></slot>
    </div>
    `
}); */

const mainPage = {
    template: `
    <div class="main-page">
        <aside class="main-sidebar border-right border-light">
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
        <div class="main-content">
            <router-view></router-view>
        </div>
    </div>
    `,
    props: {
        modules: Array
    }
};
const startPage = {
    template: `
    <div class="start-page"></div>
    `
};
const appNotFound = {
    template: `
    <div class="app-container row align-items-center justify-content-center">
        <h3 class="text-primary">什么都没找到哦-_-</h3>
    </div>
    `
};
const appLogin = {
    template: `
    <div class="app-container row align-items-center justify-content-center">
        <form class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 text-center center" 
            @submit.prevent="submit">
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
    </div>
    `,
    data() {
        return {
            fields: {
                account: localStorage.getItem('account') || '',
                password: localStorage.getItem('password') || '',
                identity: localStorage.getItem('identity') || 'student',
                save: localStorage.getItem('save') == 'user'
            }
        }
    },
    methods: {
        async submit() {
            let result = await this.$axiosPost('/login', {
                account: this.fields.account,
                password: objectHash.MD5(this.fields.password),
                identity: this.fields.identity
            });
            if (result.status) {
                localStorage.setItem('account', this.fields.account);
                localStorage.setItem('identity', this.fields.identity);
                if (this.fields.save) {
                    localStorage.setItem('password', this.fields.password);
                    localStorage.setItem('save', 'user');
                } else {
                    localStorage.removeItem('password', this.fields.password);
                    localStorage.setItem('save', 'auto');
                }
            }
            this.$emit('login', result);
        }
    }
};
const appRegister = {};
const appRetrieve = {
    template: `
    <div class="app-container row align-items-center justify-content-center">
        <form class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 text-center center"
            @submit.prevent="submit">
            <input-radio v-model="fields.identity" class="form-group form-row justify-content-around"
                :radios="[{ val: 'student', des: '学生' }, { val: 'teacher', des: '教师' }]">
            </input-radio>
            <input-account v-model="fields.account"></input-account>
            <input-pincode v-model="fields.pinCode" :extra="{account:fields.account,identity:fields.identity}"></input-pincode>
            <input-password v-model="fields.newPW" label="新密码"></input-password>
            <input-password v-model="fields.repeatPW" label="重复密码"></input-password>
            <form-button-group></form-button-group>
        </form>
    </div>
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
    methods: {
        submit() { }
    }
};
const appNews = {};

export default {
    mainPage, startPage,
    appLogin, appRegister,
    appRetrieve, appNews,
    appNotFound
};