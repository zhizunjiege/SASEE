export default {
    template: `
    <div v-if="show" class="d-flex flex-column h-100">
        <nav class="nav nav-tabs nav-justified sticky-top bg-main">
            <a data-toggle="tab" class="nav-item nav-link active" href="#user-manager"
                @click="identity='student'">学生</a>
            <a data-toggle="tab" class="nav-item nav-link" href="#user-manager" @click="identity='teacher'">教师</a>
            <a data-toggle="tab" class="nav-item nav-link" href="#user-manager" @click="identity='admin'">管理员</a>
        </nav>
        <div class="tab-content px-3 app-container flex-grow-1 app-scroll">
            <div class="position-relative h-100 tab-pane fade show active" id="user-manager">
                <table v-if="users[identity].length" class="table table-hover table-bordered text-center py-3">
                    <thead class="thead-light">
                        <tr>
                            <th>选择</th>
                            <th v-for="h in heads[identity]" scope="col">{{h.des}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(u,index) in users[identity]" :class="{editing:editing&&u.id==selected[0],searching:searching==u.id}">
                            <td>
                                <div class="custom-control custom-checkbox">
                                    <input v-model="selected" :value="u.id" type="checkbox" :id="'checkbox-'+index"
                                        class="custom-control-input" :disabled="editing&&u.id!=selected[0]">
                                    <label :for="'checkbox-'+index" class="custom-control-label"></label>
                                </div>
                            </td>
                            <td v-for="h in heads[identity]" :contenteditable="editing&&u.id==selected[0]">{{u[h.key]}}</td>
                        </tr>
                    </tbody>
                </table>
                <div v-else class="d-flex justify-content-center align-items-center text-muted" style="height: 250px">
                    <h1>未找到用户！</h1>
                </div>
            </div>
        </div>
        <div class="w-100 form-group d-flex justify-content-around border-top border-secondary py-3 mb-0">
            <app-button @click.native="select" :disabled="adding||editing" class="btn btn-primary" type="button">
            <i class="fa fa-check"></i>反选
            </app-button>
            <app-button @click.native="del" :disabled="selected.length<=0||adding||editing" class="btn btn-warning"
                type="button" warn="您确定要删除所选用户吗？">
                <i class="fa fa-trash"></i>删除用户
            </app-button>
            <app-button @click.native="add" :disabled="editing&&!adding" class="btn btn-primary" type="button">
            <i class="fa fa-plus"></i>{{adding?'确认增加':'增加用户'}}
            </app-button>
            <app-button @click.native="edit" :disabled="selected.length!=1||adding" class="btn btn-secondary"
                type="button">
                <i class="fa fa-pencil"></i>{{editing?'确认修改':'修改用户信息'}}
            </app-button>
            <div class="input-group col-12 col-md-4">
                <input v-model="name" @keyup.enter="search" class="form-control" type="search"
                    placeholder="输入用户姓名进行搜索..." required>
                <div class="input-group-append">
                    <app-button @click.native="search" class="btn btn-outline-success" type="button" :disabled="adding||editing">
                    <i class="fa fa-search"></i>搜索用户
                    </app-button>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            show: false,
            identity: 'student',
            heads: {
                student: [{ key: 'name', des: '姓名' }, { key: 'gender', des: '性别' }, { key: 'schoolNum', des: '学号' }, { key: 'specialty', des: '专业' }, { key: 'group', des: '分组' }, { key: 'class', des: '小班' }, { key: 'postGraduate', des: '是否保研' }],
                teacher: [{ key: 'name', des: '姓名' }, { key: 'gender', des: '性别' }, { key: 'schoolNum', des: '工号' }, { key: 'proTitle', des: '职称' }, { key: 'group', des: '分组' }, { key: 'department', des: '教研室' }, { key: 'ifDean', des: '是否系主任' }],
                admin: [{ key: 'name', des: '姓名' }, { key: 'gender', des: '性别' }, { key: 'priv', des: '权限等级' }]
            },
            users: {
                student: [],
                teacher: [],
                admin: []
            },
            selected: [],
            name: '',

            editing: false,
            adding: false,
            searching: -2
        }
    },
    watch: {
        identity() {
            this.selected = [];
            this.editing = false;
            this.adding = false;
            this.searching = -2;
        },
        selected(n, o) {
            if (n.length < o.length) {
                if (this.editing) {
                    this.editing = false;
                }
                if (this.adding) {
                    this.adding = false;
                    this.selected = [];
                    this.users[this.identity].pop();
                }
            }
        },
        name(n, o) {
            if (n.length == 0) {
                this.searching = -2;
            }
        }
    },
    methods: {
        getVals() {
            let nodes = document.querySelectorAll('tr.editing>td:not(:first-child)'), ret = {};
            for (const [i, v] of this.heads[this.identity].entries()) {
                if (nodes[i].innerText) {
                    ret[v.key] = nodes[i].innerText;
                } else {
                    return false;
                }
            }
            return ret;
        },
        async del() {
            let rst = await this.$axiosPost('/system/del-user', {
                id: this.selected,
                identity: this.identity
            });
            if (rst.status) {
                this.users[this.identity] = this.users[this.identity].filter(i => {
                    return this.selected.indexOf(i.id) < 0;
                });
            }
            this.$alertResult(rst);
        },
        async add() {
            if (this.adding) {
                let info = this.getVals();
                if (info) {
                    let rst = await this.$axiosPost('/system/add-user', {
                        info,
                        identity: this.identity
                    });
                    if (rst.status) {
                        let nodes = document.querySelectorAll('tr.editing>td:not(:first-child)');
                        for (const v of this.heads[this.identity]) {
                            v.innerText = '';
                        }
                        info.id = rst.insertId;
                        // this.users[this.identity].splice(this.users[this.identity].length - 1, 1, info);
                        this.users[this.identity].pop();
                        this.$nextTick(() => {
                            this.users[this.identity].push(info);
                        });
                        this.editing = false;
                        this.adding = false;
                        this.selected = [];
                    }
                    this.$alertResult(rst);
                } else {
                    this.$alertWarn('请输入完整的信息！');
                }
            } else {
                let one = {};
                for (const v of this.heads[this.identity]) {
                    one[v.key] = '';
                }
                one.id = -1;
                this.users[this.identity].push(one);
                this.selected = [-1];
                this.editing = true;
                this.adding = true;
                this.$nextTick(() => {
                    document.querySelector('tr.editing').scrollIntoView(false);
                });
            }
        },
        async edit() {
            if (this.editing) {
                let info = this.getVals();
                if (info) {
                    let rst = await this.$axiosPost('/system/edit-user', {
                        info,
                        id: this.selected[0],
                        identity: this.identity
                    });
                    if (rst.status) {
                        this.editing = false;
                    }
                    this.$alertResult(rst);
                } else {
                    this.$alertWarn('请输入完整的信息！');
                }
            } else {
                this.editing = true;
            }
        },
        search() {
            for (const v of this.users[this.identity]) {
                if (v.name == this.name) {
                    this.searching = v.id;
                    this.$nextTick(() => {
                        document.querySelector('tr.searching').scrollIntoView(false);
                    });
                    break;
                }
            }
        },
        select() {
            let selected = [];
            for (const i of this.users[this.identity]) {
                if (this.selected.indexOf(i.id) < 0) {
                    selected.push(i.id);
                }
            }
            this.selected = selected;
        }
    },
    async created() {
        let rst = await this.$axiosGet('/system/user-manage');
        if (rst.status) {
            this.users.student = rst.users[0];
            this.users.teacher = rst.users[1];
            this.users.admin = rst.users[2];
        }
        this.show = true;
    }
};