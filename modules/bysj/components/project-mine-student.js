export default {
    template: `
    <div v-if="project">
        <nav class="nav nav-tabs nav-justified sticky-top bg-white">
            <a data-toggle="tab" class="nav-item nav-link active" href="#project-notice">通知墙</a>
            <a data-toggle="tab" class="nav-item nav-link" href="#project-info">课题信息</a>
            <a data-toggle="tab" class="nav-item nav-link" href="#project-file">课题文件</a>
        </nav>
        <div class="tab-content p-3">
            <div class="tab-pane fade show active" id="project-notice">
                <div v-if="project.notices.length" class="container-fluid">
                    <div class="row">
                        <nav class="col-12 col-md-4 list-group nav nav-pills flex-column">
                            <a v-for="(notice,index) in project.notices" :href="'#notice-'+index"
                                :class="{'active':!index}" class="list-group-item list-group-item-action nav-link"
                                data-toggle="pill">
                                <span class="w-50 ellipsis">{{notice.title}}</span>
                                <span class="float-right">{{notice.date}}</span>
                            </a>
                        </nav>
                        <div class="col-12 col-md-8 tab-content border rounded p-3">
                            <div v-for="(notice,index) in project.notices" :id="'notice-'+index"
                                :class="{'show active':!index}" class="tab-pane fade">
                                {{notice.content}}
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="d-flex justify-content-center align-items-center" style="height: 250px">
                    <h1 class="text-muted">暂无通知</h1>
                </div>
            </div>
            <div class="tab-pane fade app-scroll" id="project-info">
                <header class="sticky-top bg-white border-bottom border-secondary mb-3">
                    <h3 class="pt-3 mb-0">{{info.title}}</h3>
                </header>
                <div class="mb-3">
                    <h5 class="text-primary">课题信息</h5>
                    <table class="table table-fixed table-bordered">
                        <tbody>
                            <tr>
                                <th>题目类型</th>
                                <td>{{info.type}}</td>
                                <th>题目来源</th>
                                <td>{{info.source}}</td>
                            </tr>
                            <tr>
                                <th>题目难度</th>
                                <td>{{info.difficulty}}</td>
                                <th>题目份量</th>
                                <td>{{info.weight}}</td>
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
                                <td>{{info.ability.allRound}}</td>
                                <td>{{info.ability.experiment}}</td>
                                <td>{{info.ability.graphic}}</td>
                                <td>{{info.ability.data}}</td>
                                <td>{{info.ability.analysis}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="row mb-3">
                    <div class="col">
                        <h5 class="text-primary">学生要求</h5>
                        <pre class="p-3 border rounded text-left">{{info.requirement}}</pre>
                    </div>
                    <div class="col">
                        <h5 class="text-primary">课题简介</h5>
                        <pre class="p-3 border rounded text-left">{{info.introduction}}</pre>
                    </div>
                </div>
                <div class="mb-3">
                    <h5 class="text-primary">教师信息</h5>
                    <table class="table table-fixed table-bordered">
                        <tbody>
                            <tr>
                                <th>姓名</th>
                                <td>{{info.name}}</td>
                                <th>性别</th>
                                <td>{{info.gender}}</td>
                            </tr>
                            <tr>
                                <th>工号</th>
                                <td>{{info.schoolNum}}</td>
                                <th>职称</th>
                                <td>{{info.proTitle}}</td>
                            </tr>
                            <tr>
                                <th>方向</th>
                                <td>{{info.group}}</td>
                                <th>系别</th>
                                <td>{{info.department}}</td>
                            </tr>
                            <tr>
                                <th>研究领域</th>
                                <td>{{info.field}}</td>
                                <th>办公地点</th>
                                <td>{{info.office}}</td>
                            </tr>
                            <tr>
                                <th>邮箱</th>
                                <td>{{info.email}}</td>
                                <th>个人主页</th>
                                <td>
                                    <a v-if="info.homepage" :href="info.homepage">{{info.homepage}}</a>
                                    <span v-else>无</span>
                                </td>
                            </tr>
                            <tr>
                                <th>微信</th>
                                <td>{{info.wechat}}</td>
                                <th>电话</th>
                                <td>{{info.tel}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mb-3">
                    <h5 class="text-primary">教师简介</h5>
                    <pre class="p-3 border rounded">{{info.resume}}</pre>
                </div>

                <div class="mb-3">
                    <h5 class="text-primary">课题附件</h5>
                    <div class="p-3 border rounded">
                        <a v-if="info.materials"
                            :href="'/bysj/download?id='+info.id+'&filename='+info.materials" download>
                            <small>{{info.materials}}</small>
                        </a>
                        <p v-else class="text-muted mb-0">暂无</p>
                    </div>
                </div>
                <div class="d-flex justify-content-around font-italic mb-3">
                    <h4>发布时间：{{info.submitTime}}</h4>
                    <h4>最后修改：{{info.lastModifiedTime}}</h4>
                </div>
            </div>
            <div class="tab-pane fade" id="project-file">
                <div class="row">
                    <div class="col-12 col-lg-6 mb-3 mb-lg-0">
                        <div class="card">
                            <header class="card-header">
                                <h5 class="mb-0 text-left">下载文件</h5>
                            </header>
                            <div class="card-body">
                                <ul v-if="project.downFiles.length" class="list-group list-group-flush">
                                    <a v-for="file in project.downFiles" class="list-group-item"
                                        :href="'/bysj/download?id='+file.id+'&filename='+file.name" download>
                                        <div class="row justify-content-between align-items-center">
                                            <small class="d-inline-block w-50 ellipsis">{{file.name}}</small>
                                            <small class="float-right">{{file.date}}</small>
                                        </div>
                                    </a>
                                </ul>
                                <div class="d-flex justify-content-center align-items-center" style="height: 150px">
                                    <h3 class="text-muted">暂无可下载文件</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6 mb-3 mb-lg-0">
                        <div class="card">
                            <div class="card-body">
                                <ul v-if="project.upFiles.length" class="list-group list-group-flush">
                                    <a v-for="file in project.upFiles" @click.prevent.stop href="#" class="list-group-item">
                                        <div class="row justify-content-between align-items-center">
                                            <small class="d-inline-block w-50 ellipsis">{{file.name}}</small>
                                            <small class="float-right">{{file.date}}</small>
                                        </div>
                                    </a>
                                </ul>
                                <div v-else class="d-flex justify-content-center align-items-center"
                                    style="height: 150px">
                                    <h3 class="text-muted">未上传文件</h3>
                                </div>
                            </div>
                            <footer class="card-footer d-flex align-items-center justify-content-end">
                                <a href="#" @click.prevent.stop="upload">
                                    <h5 class="mb-0 mr-3 d-inline-block">上传文件</h5>
                                </a>
                            </footer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="d-flex justify-content-center align-items-center" style="height: 250px">
        <h1>您没有生效的课题！</h1>
    </div>
    `,
    data() {
        return {
            project: {
                notice: [],
                downFiles: [],
                upFiles: [],
                info: {
                    ability: {},
                    field: '无',
                    office: '无',
                    wechat: '无',
                    tel: '无',
                    resume: '无'
                }
            }
        };
    },
    methods: {
        async submit() {
            this.$alertResult(await this.$axiosPost('/bysj/choose', { id: this.project.id, target: this.target }));
        }
    },
    async mounted() {
        let id = this.$route.query.id,
            result = await this.$axiosGet('/bysj/project-mine', { id });
        if (result.status) Object.assign(this.project, result.project);
        else this.$alertError(result.msg);
    }
}