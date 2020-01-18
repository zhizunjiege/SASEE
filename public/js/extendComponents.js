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
    <div :class="color">
        <h4 class="alert-heading p-3 mb-0">{{title}}</h4>
        <p class="px-3" style="text-indent:2rem">{{msg}}</p>
        <p v-if="Boolean(count)" class="px-3 py-2 mb-0 border-top border-info">
            将在<strong class="px-1">{{count}}</strong>秒后自动跳转,点击
            <a href="#" @click.prevent="stop" class="alert-link">此处</a>可立即跳转。
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
    props: {
        type: {
            type: String,
            default: 'success'
        },
        msg: {
            type: String,
            required: true
        },
        count: {
            type: Number,
            default: 0
        },
        ok: Function,
        cancel: Function
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
        stop() {
            console.log('stopped!');
            this.$alert.hide();
        },
        _ok() {
            this.ok();
            this.$alert.hide();
        },
        _cancel() {
            this.cancel();
            this.$alert.hide();
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
            <router-link :to="item.to" class="d-block">{{item.des}}</router-link>
        </template>
    </bs4-dropdown>
    `,
    props: {
        user: Object,
        /*         menu: {
                    type: Array,
                    required: true
                }, */
        online: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        profileUrl() {
            return '../pictures/' + (this.online ? this.user.profile || 'anonymous' : 'offline') + '.png';
        },
        menu() {
            return this.online ? [{
                to: '/logout', des: '退出登陆'
            }] : [{
                to: '/login', des: '登陆', divide: true
            }, {
                to: '/register', des: '注册', divide: true
            }, {
                to: '/password', des: '找回密码'
            }]
        }
    }
};

const startPage = {
    template: `
    <div></div>
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
    <div class="card">
        <slot></slot>
    </div>
    `
};

const contentTitle = {
    template: `
    <header class="card-header d-flex justify-content-between align-items-center">
        <button @click="back" class="btn" :style="{visibility:s_back?'visible':'hidden'}">
            <span class="glyphicon glyphicon-chevron-left float-left"></span>返回
        </button>
        <span class="h3">{{text}}</span>
        <button @click="forward" class="btn" :style="{visibility:s_forward?'visible':'hidden'}">
            <span class="glyphicon glyphicon-chevron-right float-right"></span>前进
        </button>
    </header>
    `,
    props: {
        text: String,
        s_back: {
            type: Boolean,
            default: false
        },
        s_forward: {
            type: Boolean,
            default: false
        },
        back: {
            type: Function,
            default: () => { }
        },
        forward: {
            type: Function,
            default: () => { }
        }
    }
};
const contentBody = {
    template: `
    <div class="card-body">
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
    props: {
        time: {
            type: String,
            required: true
        }
    }
};
const footLink = {
    template: `
    <div>
        <div v-for="link in links" style="min-width:25%;max-width: 25%;display:inline-block;">
            <router-link :to="link.to" style="display: block;" class="px-3">{{link.des}}</router-link>
        </div>
    </div>
    `,
    props: {
        links: {
            type: Array
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
        <form class="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 text-center center">
            <input-account v-model="fields.account"></input-account>
            <input-password v-model="fields.password"></input-password>
            <input-radio v-model="fields.identity" name="identity"
                :radios="[{ val: 'student', des: '学生' }, { val: 'teacher', des: '教师' }]"
                class="form-group form-row justify-content-around">
            </input-radio>
            <div class="form-row justify-content-around align-items-center mb-3">
                <input-checkbox v-model="fields.save" name="save" :checkboxs="[{ val: 'save', des: '记住密码' }]"
                    class="col-6 col-md-6 mb-3 mb-md-0">
                </input-checkbox>
                <button class="btn btn-primary col-6 col-md-6 mb-3 mb-md-0" type="submit"
                    @click.prevent="$net('post', '/login', fields)">登陆</button>
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

const components = {
    appHead, appBody, appFoot,

    appAlert, appBackdrop,

    headLogo, headUser,

    startPage, mainPage,
    mainSidebar, mainContent,

    contentTitle, contentBody,

    footTime, footLink
    /* appRegister, appPassword, appUserinfo,
   appNews */
},
    routes = [{
        path: '/', components: { system: appEmpty }
    }, {
        path: '/login', components: { system: appLogin }
    }, {
        path: '/register', components: { system: appRegister }
    }, {
        path: '*', components: { system: appNotfound }
    }];

export {
    components, routes
}