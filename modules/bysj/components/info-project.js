export default {
    template: `
    <div v-if="Number(pid)>0">
        <header class="sticky-top bg-main border-bottom border-secondary mb-3">
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
            <h5 class="text-primary">课题附件</h5>
            <div class="p-3 border rounded">
                <a v-if="project.materials" :href="href" download>
                    <small>{{project.materials}}</small>
                </a>
                <p v-else class="text-muted mb-0">暂无</p>
            </div>
        </div>
        <div class="d-flex justify-content-around font-italic mb-3">
            <h4>发布时间：{{project.submitTime}}</h4>
            <h4>最后修改：{{project.lastModifiedTime}}</h4>
        </div>
    </div>
    `,
    props: {
        pid: {
            type: [Number,String],
            required: true
        }
    },
    data() {
        return {
            project: {
                ability: {}
            }
        };
    },
    computed: {
        href() {
            return '/bysj/download?pid=' + this.project.id + '&filename=' + this.project.materials;
        }
    },
    async created() {
        let result = await this.$axiosGet('/bysj/info-project', { id: this.pid });
        if (result.status) this.project = Object.assign({}, this.project, result.project);
        else this.$alertError(result.msg);
    }
}