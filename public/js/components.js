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
} 
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
Vue.component('app-modal', {
    template: `
    <div class="app-modal">
        <button type="button" @click="$router.back()" class="app-close h1"><span>&times;</span></button>
        <slot></slot>
    </div>
    `
}); 
Vue.component('form-button-group', {
    template: `
    <div class="form-row justify-content-between align-items-center mb-3">
        <button class="btn btn-secondary col-12 col-md-4 mb-3 mb-md-0" type="reset">重置</button>
        <button class="btn btn-primary col-12 col-md-4 mb-3 mb-md-0" type="submit">提交</button>
    </div>
    `
});
*/
/* const appHelp = {
    template: ``,
    data() {
        return {};
    },
    methods: {
        submit() { }
    }
};
const appFeedback = {
    template: ``,
    data() {
        return {};
    },
    methods: {
        submit() { }
    }
};
const appNews = {
    template: ``,
    data() {
        return {};
    },
    methods: {
        submit() { }
    }
}; 
 Vue.component('bs4-pagination', {
    inheritAttrs: false,
    model: {
        prop: 'now',
        event: 'change'
    },
    props: {
        flush: {
            type: Boolean,
            default: true
        },
        action: {
            type: Boolean,
            default: false
        },
        total: Number,
        now: Number,
        items: Array
    },
    data() {
        return {
            start_: 1,
            now_: 1,
            end_: 2
        }
    },
    watch: {
        now() {
            this.now_ = this.now;
        },
        now_() {
            this.$emit('change', this.now_);
        }
    },
    template: `
    <dl class="list-group" :class="{'list-group-flush':flush}">
        <dd class="list-group-item" :class="{'list-group-item-action':action}" v-for="item in items">
            <slot :item="item"></slot>
        </dd>
    </dl> 
    `
}); 
*/

//工具函数
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

//全局组件
Vue.component('input-text', {
    inheritAttrs: false,
    props: {
        value: String,
        label: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'text'
        }
    },
    template: `
    <div class="form-group form-row">
        <label class="col-3 col-form-label" :class="{'required':'required' in $attrs}">{{label}}：</label>
        <input v-bind="$attrs" :value="value" :type="type" @input="$emit('input',$event.target.value)" class="form-control col-9">
    </div>
    `
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
            this.$emit('change', this.in_checked);
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
            this.$emit('change', this.in_checked);
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
Vue.component('input-textarea', {
    inheritAttrs: false,
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        value: String,
        label: {
            type: String,
            required: true
        }
    },
    data() {
        return { in_value: this.value };
    },
    watch: {
        value() {
            this.in_value = this.value;
        },
        in_value() {
            this.$emit('change', this.in_value.replace(/\r/g, ''));
        }
    },
    template: `
    <div class="form-group form-row">
        <label class="col-3 col-form-label" :class="{'required':'required' in $attrs}">{{label}}：</label>
        <textarea class="col-9 form-control" v-bind="$attrs" v-model="in_value"></textarea>
    </div>
    `
});
/* Vue.component('input-file', {}); */
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
        <label class="col-3 col-form-label" :class="{'required':'required' in $attrs}">验证码：</label>
        <div class="input-group col-9 px-0">
            <input v-bind="$attrs" :value="value" @input="$emit('input',$event.target.value)" class="form-control px-1" type="text" placeholder="6位验证码，5分钟内有效"
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
            let msg = '';
            this.count = 60;
            if ('username' in this.extra && !this.extra.username) {
                msg = '请输入用户名！';
            } else if ('identity' in this.extra && !this.extra.identity) {
                msg = '请选择身份！';
            } else if ('email' in this.extra && !this.extra.email) {
                msg = '请输入邮箱地址！';
            }
            if (msg) this.$alertWarn(msg);
            this.sent = true;
            let result = await this.$axiosGet('/sendPinCode', this.extra);
            if (result.status) {
                counter({
                    count: 60,
                    doing: c => {
                        this.count = c;
                    },
                    done: () => { this.sent = false }
                });
            } else {
                this.sent = false;
            }
            this.$alertResult(result);
        }
    },
});
Vue.component('bs4-dropdown', {
    template: `
    <div class="dropdown">
        <div class="dropdown-toggle h-100" data-toggle="dropdown" :data-display="display">
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
Vue.component('app-scroll', {
    template: `
    <div class="app-scroll" @scroll="scroll">
        <slot></slot>
        <div v-if="status" class="row justify-content-center align-items-center w-100" style="height:50px">
            <span v-if="status=='loading'" class="spinner-border spinner-border-lg text-primary"></span>
            <span v-if="status=='end'" class="text-secondary">到底了~</span>
            <span v-if="status=='error'" class="text-warning">网络错误-_-</span>
        </div>
    </div>
    `,
    props: {
        status: { type: String, default: '' },
        mode: { type: String, default: 'continue'/* single */ },
        top: { type: Number, default: 100 },
        bottom: { type: Number, default: 100 },
        factor: { type: Number, default: 4 }
    },
    data() {
        return {
            lastTop_: 0,
            factorCount_: 0,
            upTriggered_: false,
            downTriggered_: false
        };
    },
    methods: {
        scroll(e) {
            if (this.factorCount_ >= this.factor) {
                let { scrollHeight, clientHeight, scrollTop } = e.target, scrollDown = scrollHeight - clientHeight - scrollTop;
                if (scrollTop > this.lastTop_) {
                    //scrollUp
                    if (scrollDown <= this.bottom) {
                        this.mode != 'continue' && this.upTriggered_ || this.$emit('scroll::up');
                        this.mode != 'continue' && (this.upTriggered_ = true);
                    }
                    this.mode != 'continue' && scrollTop > this.top && (this.downTriggered_ = false);
                }
                else {
                    //scrollDown
                    if (scrollTop <= this.top) {
                        this.mode != 'continue' && this.downTriggered_ || this.$emit('scroll::down');
                        this.mode != 'continue' && (this.downTriggered_ = true);
                    }
                    this.mode != 'continue' && scrollDown > this.bottom && (this.upTriggered_ = false);
                }
                this.lastTop_ = scrollTop;
                this.factorCount_ = 0;
            } else {
                this.factorCount_++;
            }
        }
    }
});

//局部组件
const mainPage = {
    template: `
    <div class="app-container">
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
const appLogin = {
    template: `
    <div class="app-container row align-items-center justify-content-center">
        <form class="col-12 col-sm-9 col-md-8 col-lg-6 col-xl-5 text-center" 
            @submit.prevent="submit">
            <input-text v-model="fields.username" label="用户名" placeholder="1~16位字母、数字或下划线" pattern="\\w{1,16}" required></input-text>
            <input-text v-model="fields.password" type="password" label="密码" placeholder="1~16位字母、数字或下划线" pattern="\\w{1,16}" required></input-text>
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
                username: localStorage.getItem('username') || '',
                password: localStorage.getItem('password') || '',
                identity: localStorage.getItem('identity') || 'student',
                save: localStorage.getItem('save') == 'user'
            }
        }
    },
    methods: {
        async submit() {
            let data = this.fields, result = await this.$axiosPost('/login', {
                username: data.username,
                password: objectHash.MD5(data.password),
                identity: data.identity
            });
            if (result.status) {
                localStorage.setItem('username', data.username);
                localStorage.setItem('identity', data.identity);
                if (data.save) {
                    localStorage.setItem('password', data.password);
                    localStorage.setItem('save', 'user');
                } else {
                    localStorage.removeItem('password', data.password);
                    localStorage.setItem('save', 'auto');
                }
            }
            this.$emit('login', result);
        }
    }
};
const appRegister = {
    template: `
    <div class="app-container app-scroll row align-items-center justify-content-center">
        <form class="col-12 col-sm-9 col-md-8 col-lg-6 col-xl-5 text-center mt-3" @submit.prevent="submit">
            <input-radio v-model="fields.identity" class="form-group form-row justify-content-around"
                :radios="[{ val: 'student', des: '学生' }, { val: 'teacher', des: '教师' }]">
            </input-radio>
            <input-text v-model="fields.name" label="姓名" placeholder="1~16个汉字、字母或空格"
                pattern="[\\u4E00-\\u9FA5a-zA-Z\\s]{1,16}" required>
            </input-text>
            <input-text v-model="fields.schoolNum" :label="fields.identity=='student'?'学号':'工号'"
                placeholder="1~16位字母或数字" pattern="[a-zA-Z0-9]{1,16}" required></input-text>
            <input-text v-model="fields.username" label="用户名" placeholder="1~16位字母、数字或下划线" pattern="\\w{1,16}" required>
            </input-text>
            <input-text v-model="fields.password" type="password" label="密码" placeholder="1~16位字母、数字或下划线"
                pattern="\\w{1,16}" required></input-text>
            <input-text v-model="fields.repeatPW" type="password" label="重复密码" placeholder="1~16位字母、数字或下划线"
                pattern="\\w{1,16}" required></input-text>
            <input-text v-model="fields.email" type="email" label="邮箱" placeholder="请输入正确的邮箱地址" required>
            </input-text>
            <input-pincode v-model="fields.pinCode" :extra="{email:fields.email}" required></input-pincode>
            <input-text v-model="fields.wechat" label="微信" placeholder="1~255位字母或数字" pattern="[a-zA-Z0-9]{1,255}">
            </input-text>
            <input-text v-model="fields.tel" label="手机号" placeholder="11位数字" pattern="^[1]([3-9])[0-9]{9}$">
            <input-text v-model="fields.homepage" label="个人主页" placeholder="请输入正确的网址，不超过255位字符"></input-text>
            </input-text>
            <input-textarea v-model="fields.resume" label="个人简介" rows="12" placeholder="不超过1023个字符（或汉字）" maxlength="1023"></input-textarea>
            <div class="form-row justify-content-between align-items-center mb-3">
                <input-checkbox v-model="fields.license" :checkboxs="[{ val: 'license', des: '我已阅读并同意用户协议' }]"
                    class="col-12 col-md-7 mb-3 mb-md-0">
                </input-checkbox>
                <button class="btn btn-primary col-12 col-md-5 mb-3 mb-md-0" :disabled="!fields.license"
                    type="submit">注册</button>
            </div>
        </form>
    </div>
    `,
    data() {
        return {
            fields: {
                identity: 'student',
                name: '',
                schoolNum: '',
                username: '',
                password: '',
                repeatPW: '',
                email: '',
                pinCode: '',
                wechat: '',
                tel: '',
                homepage: '',
                resume: '',
                license: false
            }
        };
    },
    methods: {
        async submit() {
            console.log('register');
            let fields = this.fields;
            console.log(fields);
            if (fields.password !== fields.repeatPW) {
                this.$alertWarn('密码不一致！');
                return;
            }
            let data = Object.assign({}, fields);
            console.log(data);
            data.password = objectHash.MD5(fields.password);
            /*             if (fields.wechat) data.wechat = fields.wechat;
                        if (fields.tel) data.tel = fields.tel;
                        if (fields.homepage) data.homepage = fields.homepage;
                        if (fields.resume) data.resume = fields.resume; */
            console.log(data);

            let result = await this.$axiosPost('/register', data);
            console.log(result);
            if (result.status) {
                this.$router.push({ path: '/login' });
            }
            this.$alertResult(result);
        }
    }
};
const appRetrieve = {
    template: `
    <div class="app-container row align-items-center justify-content-center">
        <form class="col-12 col-sm-9 col-md-8 col-lg-6 col-xl-5 text-center" @submit.prevent="submit">
            <input-radio v-model="fields.identity" class="form-group form-row justify-content-around"
                :radios="[{ val: 'student', des: '学生' }, { val: 'teacher', des: '教师' }]">
            </input-radio>
            <input-text v-model="fields.username" label="用户名" placeholder="1~16位字母、数字或下划线" pattern="\\w{1,16}" required>
            </input-text>
            <input-pincode v-model="fields.pinCode" :extra="{username:fields.username,identity:fields.identity}"
                required></input-pincode>
            <input-text v-model="fields.newPW" type="password" label="新密码" placeholder="1~16位字母、数字或下划线"
                pattern="\\w{1,16}" required></input-text>
            <input-text v-model="fields.repeatPW" type="password" label="重复密码" placeholder="1~16位字母、数字或下划线"
                pattern="\\w{1,16}" required></input-text>
            <div class="form-row justify-content-end align-items-center mb-3">
                <button class="btn btn-primary col-12 col-md-5 mb-3 mb-md-0" type="submit">提交</button>
            </div>
        </form>
    </div>
    `,
    data() {
        return {
            fields: {
                username: '',
                pinCode: '',
                identity: 'student',
                newPW: '',
                repeatPW: ''
            }
        }
    },
    methods: {
        async submit() {
            let fields = this.fields;
            if (fields.newPW !== fields.repeatPW) {
                this.$alertWarn('密码不一致！');
                return;
            }
            let result = await this.$axiosPost('/retrieve', {
                username: fields.username,
                pinCode: fields.pinCode,
                identity: fields.identity,
                newPW: objectHash.MD5(fields.newPW)
            });
            if (result.status) {
                this.$router.push({ path: '/login' });
            }
            this.$alertResult(result);
        }
    }
};
const appLicense = {
    template: `
    <div class="app-container app-scroll row justify-content-center p-0 p-md-3">
        <div class="col-12 col-md-10 col-lg-8" v-html="content"></div>
    </div>
    `,
    data() {
        return {
            content: ''
        };
    },
    async mounted() {
        this.content = await this.$axiosGet('/html/license.html');
    }
};
const appNotFound = {
    template: `
    <div class="app-container row align-items-center justify-content-center">
        <h3 class="text-primary">什么都没找到哦-_-</h3>
    </div>
    `
};

//导出
export default {
    mainPage, startPage,
    appLogin, appRegister, appRetrieve,
    appLicense,
    appNotFound
};
export { counter };