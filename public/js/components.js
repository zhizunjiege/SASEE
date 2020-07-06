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
Vue.component('app-button', {
    template: `
    <button @click="onclick">
        <slot></slot>
    </button>
    `,
    props: {
        interval: {
            type: Number,
            default: 1000
        },
        warn: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            lastTime: 0
        }
    },
    methods: {
        onclick(e) {
            let now = Date.now();
            if (e.isTrusted) {
                if (now - this.lastTime < this.interval) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    // this.$alertWarn('点击过于频繁，请1秒后再次尝试！');
                } else if (this.warn) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this.$alertWarn(this.warn, () => {
                        let $event = new MouseEvent('click');
                        this.$el.dispatchEvent($event);
                    });
                }
            }
            this.lastTime = now;
        }
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
Vue.component('input-text', {
    inheritAttrs: false,
    props: {
        value: String,
        label: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        }
    },
    template: `
    <div class="form-group form-row">
        <label v-if="label" class="col-3 col-form-label" :class="{'required':'required' in $attrs}">{{label}}</label>
        <input v-bind="$attrs" :value="value" :type="type" @input="$emit('input',$event.target.value)" class="form-control" :class="{'col-9':label}">
    </div>
    `
});
Vue.component('input-time', {
    inheritAttrs: false,
    props: {
        value: String,
        label: {
            type: String,
            default: ''
        }
    },
    template: `
    <div class="form-group form-row">
        <label v-if="label" class="col-3 col-form-label" :class="{'required':'required' in $attrs}">{{label}}</label>
        <input v-bind="$attrs" :value="value" type="datetime-local" @input="$emit('input',$event.target.value)" class="form-control" :class="{'col-9':label}">
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
        radios: Array, checked: [String, Boolean]
    },
    data() {
        return { in_checked: this.checked, eid: (new Date).toISOString() }
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
            <input v-bind="$attrs" v-model="in_checked" :value="radio.val" type="radio" :id="eid+'-radio-'+index" class="custom-control-input" required>
            <label :for="eid+'-radio-'+index" class="custom-control-label" v-html="radio.des"></label>
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
        return { in_checked: this.checkboxs.length > 1 ? this.checked.slice() : this.checked, eid: (new Date).toISOString() }
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
            <input v-bind="$attrs" v-model="in_checked" :value="checkbox.val" type="checkbox" :id="eid+'-checkbox-'+index" class="custom-control-input">
            <label :for="eid+'-checkbox-'+index" class="custom-control-label" v-html="checkbox.des"></label>
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
            default: ''
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
        <label v-if="label" class="col-3 col-form-label" :class="{'required':'required' in $attrs}">{{label}}</label>
        <textarea v-bind="$attrs" v-model="in_value" class="form-control textarea-alpha" :class="{'col-9':label}"></textarea>
    </div>
    `
});
Vue.component('input-select', {
    inheritAttrs: false,
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        value: [String, Array],
        label: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
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
            this.$emit('change', this.in_value);
        }
    },
    template: `
    <div class="form-group form-row">
    <label v-if="label" class="col-3 col-form-label" :class="{'required':'required' in $attrs}">{{label}}</label>
    <select v-model="in_value" class="custom-select form-control" :class="{'col-9':label}">
        <option v-for="opt in options" :value="opt" >{{opt}}</option>
    </select>
</div>
    `
});
Vue.component('input-file', {
    inheritAttrs: false,
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        value: [FileList, Array],
        label: {
            type: String,
            default: ''
        },
        accept: {
            type: String,
            default: '.7z,.rar,.zip,tar,.doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.xml'
        },
        pre: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            placeholder: this.pre || '请上传文档、表格或压缩文件，不超过20M'
        }
    },
    template: `
    <div class="form-group form-row">
        <label v-if="label" class="col-3 col-form-label" :class="{'required':'required' in $attrs}">{{label}}</label>
        <div class="custom-file" :class="{'col-9':label}">
            <input v-bind="$attrs" @change="onchange" type="file" :accept="accept" class="custom-file-input">
            <label class="custom-file-label text-left">
                <small class="form-text text-muted">{{placeholder}}</small>
            </label>
        </div>
    </div>
    `,
    methods: {
        onchange(e) {
            let files = e.target.files;
            if (files[0].size > 20 * 1024 * 1024) {
                this.$alertWarn('文件大小超出限制！');
            }
            else {
                this.placeholder = files[0].name;
                this.$emit('change', files);
            }
        }
    }
});
Vue.component('input-pincode', {
    inheritAttrs: false,
    props: {
        value: String,
        label: {
            type: String,
            default: ''
        },
        extra: {
            type: Object,
            default: {}
        }
    },
    template: `
    <div class="form-group form-row">
        <label v-if="label" class="col-3 col-form-label" :class="{'required':'required' in $attrs}">{{label}}</label>
        <div class="input-group px-0" :class="{'col-9':label}">
            <input v-bind="$attrs" :value="value" @input="$emit('input',$event.target.value)" class="form-control px-1" type="text" placeholder="6位验证码，5分钟内有效"
            pattern="\\d{6}">
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
            if (msg) {
                this.$alertWarn(msg);
            } else {
                let result = await this.$axiosGet('/sendPinCode', this.extra);
                if (result.status) {
                    this.sent = true;
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
        }
    },
})
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
Vue.component('wang-editor', {
    model: {
        prop: 'content',
        event: 'change'
    },
    template: `
    <div :id="eid" class="mb-3"></div>
    `,
    featureBase: [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'justify',  // 对齐方式
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'undo',  // 撤销
        'redo'  // 重复
    ],
    featureExtend: [
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'list',  // 列表
        'table',  // 表格
        'quote',  // 引用
        'emoticon',  // 表情
        'image',  // 插入图片
        'video',  // 插入视频
        'code',  // 插入代码
    ],
    props: {
        content: {
            type: String,
            required: true
        },
        eid: {
            type: String,
            required: true
        },
        server: {
            type: String,
            default: ''
        },
        full: {
            type: Boolean,
            default: false
        },
        height: {
            type: Number,
            default: 300
        }
    },
    data() {
        return {
            editor: null,
            inner: false
        }
    },
    mounted() {
        let editor = this.editor = new window.wangEditor(`#${this.eid}`);
        if (this.server) {
            editor.customConfig.uploadImgServer = this.server;
            editor.customConfig.uploadFileName = 'file';
            editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
            editor.customConfig.uploadImgMaxLength = 1;
            editor.customConfig.uploadImgTimeout = 3000;
        }
        editor.customConfig.customAlert = function (info) {
            this.$alertWarn(info);
        };
        editor.customConfig.zIndex = 1000;
        editor.customConfig.menus = this.full ? this.$options.featureBase.concat(this.$options.featureExtend) : this.$options.featureBase;

        editor.create();
        editor.$textContainerElem[0].style.height = `${this.height}px`;

        editor.txt.html(this.content);

        this.$watch('content', function (n, o) {
            if (this.inner) {
                this.inner = false;
            } else {
                this.editor.txt.html(n);
            }
        });
        editor.$textElem[0].addEventListener('input', () => {
            this.inner = true;
            this.$emit('change', editor.txt.html());
        });
    }
});

//局部组件
const mainPage = {
    template: `
    <div class="app-container d-flex">
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
    <div class="start-page row justify-content-center">
        <div class="d-none d-md-flex col-md-6 col-lg-7">
        </div>
        <div class="col-12 col-sm-9 col-md-6 col-lg-5">
            <router-view></router-view>
        </div>
    </div>
    `
};
const appLogin = {
    template: `
    <div class="d-flex w-100 h-75 align-items-center justify-content-center">
        <div class="px-5 pt-5 pb-4 rounded-lg" style="background-color: #63877d87;color:white;">
            <form class="form-sm text-center" @submit.prevent="submit">
                <input-text v-model="fields.username" label="用户名" placeholder="1~16位字母、数字或下划线" pattern="\\w{1,16}"
                    required>
                </input-text>
                <input-text v-model="fields.password" type="password" label="密码" placeholder="1~16位字母、数字或下划线"
                    pattern="\\w{1,16}" required></input-text>
                <input-radio v-model="fields.identity" :radios="radios"
                    class="form-group form-row justify-content-around">
                </input-radio>
                <div class="form-row justify-content-around align-items-center mb-3">
                    <input-checkbox v-model="fields.save" :checkboxs="[{ val: 'save', des: '记住密码' }]"
                        class="col-6 col-md-6 mb-3 mb-md-0">
                    </input-checkbox>
                    <app-button class="btn btn-primary col-6 col-md-6 mb-3 mb-md-0" type="submit">登陆</app-button>
                </div>
            </form>
            <div class="text-right px-3">
                <router-link to='/retrieve' style="color:black;">找回密码</router-link>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            radios: [{ val: 'student', des: '学生' }, { val: 'teacher', des: '教师' }, { val: 'admin', des: '管理员' }],
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
                this.$root.$emit('login', result);
            } else {
                this.$alertError(result.msg);
            }
        }
    }/* ,
    created(){
        if(this.$route.query.admin){
            this.radios
        }
    } */
};
const appSignup = {
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
            <input-pincode v-model="fields.pinCode" label="验证码" :extra="{email:fields.email}" required></input-pincode>
            <input-text v-model="fields.wechat" label="微信" placeholder="1~255位字母或数字" pattern="[a-zA-Z0-9]{1,255}">
            </input-text>
            <input-text v-model="fields.tel" label="手机号" placeholder="11位数字" pattern="^[1]([3-9])[0-9]{9}$">
            <input-text v-model="fields.homepage" label="个人主页" placeholder="请输入正确的网址，不超过255位字符"></input-text>
            </input-text>
            <template v-if="fields.identity=='teacher'">
            <input-text v-model="fields.office" label="办公地点" placeholder="不超过255个字符（或汉字）"></input-text>
            </input-text>
            <input-text v-model="fields.field" label="研究领域" placeholder="不超过255个字符（或汉字）"></input-text>
            </input-text>
            </template>
            <input-textarea v-model="fields.resume" label="个人简介" rows="12" placeholder="不超过1023个字符（或汉字）" maxlength="1023"></input-textarea>
            <div class="form-row justify-content-between align-items-center mb-3">
                <input-checkbox v-model="fields.license" :checkboxs="checkboxs"
                    class="col-12 col-md-7 mb-3 mb-md-0">
                </input-checkbox>
                <app-button class="btn btn-primary col-12 col-md-5 mb-3 mb-md-0" :disabled="!fields.license"
                    type="submit">注册</app-button>
            </div>
        </form>
    </div>
    `,
    data() {
        return {
            checkboxs: [{ val: 'license', des: '我已阅读并同意<a href="#/license">用户协议</a>' }],
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
                office: '',
                field: '',
                license: false
            }
        };
    },
    methods: {
        async submit() {
            let fields = this.fields;
            if (fields.password !== fields.repeatPW) {
                this.$alertWarn('密码不一致！');
                return;
            }
            let data = Object.assign({}, fields);
            data.password = objectHash.MD5(fields.password);
            /*             if (fields.wechat) data.wechat = fields.wechat;
                        if (fields.tel) data.tel = fields.tel;
                        if (fields.homepage) data.homepage = fields.homepage;
                        if (fields.resume) data.resume = fields.resume; */
            console.log(data);

            let result = await this.$axiosPost('/signup ', data);
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
            <input-pincode v-model="fields.pinCode" label="验证码" :extra="{username:fields.username,identity:fields.identity}"
                required></input-pincode>
            <input-text v-model="fields.newPW" type="password" label="新密码" placeholder="1~16位字母、数字或下划线"
                pattern="\\w{1,16}" required></input-text>
            <input-text v-model="fields.repeatPW" type="password" label="重复密码" placeholder="1~16位字母、数字或下划线"
                pattern="\\w{1,16}" required></input-text>
            <div class="form-row justify-content-end align-items-center mb-3">
                <app-button class="btn btn-primary col-12 col-md-5 mb-3 mb-md-0" type="submit">提交</app-button>
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
        <h3 class="col-12 text-center">用户协议</h3>
        <div class="col-12 col-md-10 col-lg-9 mb-3" v-html="content"></div>
        <button type="button" class="btn btn-primary col-8 col-md-6 col-lg-4 mb-3"
            @click="$router.back()">返回前页</button>
    </div>
    `,
    data() {
        return {
            content: ''
        };
    },
    async mounted() {
        this.content = await this.$axiosGet('/system/license');
    }
};
const appNotFound = {
    template: `
    <div class="app-container row align-items-center justify-content-center">
        <h3 class="text-primary">什么都没找到哦-_-</h3>
    </div>
    `
};
const app = {
    router: new VueRouter({
        routes: [{
            path: '/', component: startPage,
            children: [{
                path: '', component: appLogin
            }, {
                path: 'login', component: appLogin
            }]
        }, {
            path: '/signup', component: appSignup
        }, {
            path: '/retrieve', component: appRetrieve
        }, {
            path: '/license', component: appLicense
        }, {
            path: '*', component: appNotFound
        }]
    }),
    data: {
        online: false,
        loading: true,
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
            return `../img/${this.online ? this.user.profile : 'unknown.png'}`;
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
        alertShow({ type = 'success', msg = '', count = 0, ok = null, cancel = null } = {}) {
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
                        component: mainPage,
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
        },
        async logout() {
            let result = await this.$axiosGet('/logout');
            if (result.status) this.$emit('logout', '/');
            this.$alertResult(result);
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
};

//导出
export default {
    mainPage, startPage,
    appLogin, appSignup, appRetrieve,
    appLicense,
    appNotFound,
    app
};