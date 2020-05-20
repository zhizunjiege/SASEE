export default {
    template: `
    <div class="app-container app-scroll px-0 px-md-3 text-center">
        <header class="sticky-top bg-white border-bottom border-secondary mb-3">
            <h3 class="pt-3 mb-0">{{project.title}}</h3>
        </header>
        <div class="mb-3">
            <h5 class="text-primary">课题信息</h5>
            <table class="table table-fixed table-bordered">
                <tbody>
                    <tr>
                        <th>题目类型</th>
                        <td>{{project.type}}</td>
                        <th>题目来源</th>
                        <td>{{project.source}}</td>
                    </tr>
                    <tr>
                        <th>题目难度</th>
                        <td>{{project.difficulty}}</td>
                        <th>题目份量</th>
                        <td>{{project.weight}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="mb-3">
            <h5 class="text-primary">能力要求</h5>
            <table class="table table-fixed table-bordered">
                <tbody>
                    <tr>
                        <th>解决问题综合能力</th>
                        <th>实验能力</th>
                        <th>绘图能力</th>
                        <th>数据处理能力</th>
                        <th>计算结果分析能力</th>
                    </tr>
                    <tr>
                        <td>{{project.ability.allRound}}</td>
                        <td>{{project.ability.experiment}}</td>
                        <td>{{project.ability.graphic}}</td>
                        <td>{{project.ability.data}}</td>
                        <td>{{project.ability.analysis}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row mb-3">
            <div class="col">
                <h5 class="text-primary">学生要求</h5>
                <pre class="p-3 border rounded text-left">{{project.requirement}}</pre>
            </div>
            <div class="col">
                <h5 class="text-primary">课题简介</h5>
                <pre class="p-3 border rounded text-left">{{project.introduction}}</pre>
            </div>
        </div>
        <div class="mb-3">
            <h5 class="text-primary">教师信息</h5>
            <table class="table table-fixed table-bordered">
                <tbody>
                    <tr>
                        <th>姓名</th>
                        <td>{{project.name}}</td>
                        <th>性别</th>
                        <td>{{project.gender}}</td>
                    </tr>
                    <tr>
                        <th>工号</th>
                        <td>{{project.schoolNum}}</td>
                        <th>职称</th>
                        <td>{{project.proTitle}}</td>
                    </tr>
                    <tr>
                        <th>方向</th>
                        <td>{{project.group}}</td>
                        <th>系别</th>
                        <td>{{project.department}}</td>
                    </tr>
                    <tr>
                        <th>研究领域</th>
                        <td>{{project.field}}</td>
                        <th>办公地点</th>
                        <td>{{project.office}}</td>
                    </tr>
                    <tr>
                        <th>邮箱</th>
                        <td>{{project.email}}</td>
                        <th>个人主页</th>
                        <td>
                            <a v-if="project.homepage" :href="project.homepage">{{project.homepage}}</a>
                            <span v-else>无</span>
                        </td>
                    </tr>
                    <tr>
                        <th>微信</th>
                        <td>{{project.wechat}}</td>
                        <th>电话</th>
                        <td>{{project.tel}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="mb-3">
            <h5 class="text-primary">教师简介</h5>
            <pre class="p-3 border rounded">{{project.resume}}</pre>
        </div>

        <div class="mb-3">
            <h5 class="text-primary">课题附件</h5>
            <div class="p-3 border rounded">
                <a v-if="project.materials" :href="'/bysj/download?id='+project.id+'&filename='+project.materials"
                    download>
                    <small>{{project.materials}}</small>
                </a>
                <p v-else class="text-muted mb-0">暂无</p>
            </div>
        </div>
        <div class="d-flex justify-content-around font-italic mb-3">
            <h4>发布时间：{{project.submitTime}}</h4>
            <h4>最后修改：{{project.lastModifiedTime}}</h4>
        </div>
        <div class="row align-items-center justify-content-center mb-3">
            <form class="col-12 col-sm-9 col-md-8 col-lg-6 col-xl-5 text-center" @submit.prevent="submit">
                <input-radio v-model="target" :radios="[{val:'1',des:'平行志愿一'},{val:'2',des:'平行志愿二'},{val:'3',des:'平行志愿三'}]"
                    class="mb-3">
                </input-radio>
                <div class="form-row justify-content-center align-items-center">
                    <app-button class="btn btn-primary col-12" type="submit">选择此课题</app-button>
                </div>
            </form>
        </div>
    </div>
    `,
    data() {
        return {
            project: {
                ability: {},
                field: '无',
                office: '无',
                wechat: '无',
                tel: '无',
                resume: '无'
            },
            target: '1'
        };
    },
    methods: {
        async submit() {
            this.$alertResult(await this.$axiosPost('/bysj/choose', { id: this.project.id, target: this.target }));
        }
    },
    async mounted() {
        let id = this.$route.query.id,
            result = await this.$axiosGet('/bysj/project-content', { id });
        if (result.status) Object.assign(this.project, result.project);
        else this.$alertError(result.msg);
    }
}