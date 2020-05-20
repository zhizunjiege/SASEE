export default {
    template: `
    <div class="app-container app-scroll px-0 px-md-3 text-center">
        <div v-for="(project,index) in projects" class="mb-3">
            <header class="border-bottom border-secondary mb-3">
                <h3 class="pt-3 mb-0">{{project.title}}</h3>
            </header>
            <div class="mb-3">
                <table class="table table-fixed table-bordered">
                    <tbody>
                        <tr>
                            <th>平行志愿</th>
                            <td>{{index+1}}</td>
                            <th>已选人数</th>
                            <td>{{project.chosen}}</td>
                        </tr>
                        <tr>
                            <th>教师姓名</th>
                            <td>{{project.name}}</td>
                            <th>所属方向</th>
                            <td>{{project.group}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="row align-items-center justify-content-around">
                <app-button :disabled="project.id<=0" @click.native="revoke(project.id,index)" class="btn btn-secondary col-12 col-md-4 mb-3 mb-md-0"
                    type="button">退选</app-button>
                <app-button :disabled="project.id<=0" @click.native="detail(project.id,project.teacher)" class="btn btn-primary col-12 col-md-4 mb-3 mb-md-0"
                    type="button">详细信息</app-button>
            </div>
        </div>
    </div>
    `,
    project: {
        id: -1,
        title: '无',
        chosen: 0,
        name: '无',
        group: '无'
    },
    data() {
        return {
            projects: Array(3).fill(this.$options.project)
        };
    },
    methods: {
        async revoke(id, index) {
            let result = await this.$axiosPost('/bysj/revoke', { id, target: index + 1 });
            if (result.status) {
                this.$set(this.projects, index, this.$options.project);
            }
            this.$alertResult(result);
        },
        detail(id, teacher) {
            this.$router.push({ path: `/bysj/project-content?id=${id}&teacher=${teacher}&choseUsable=false` });
        }
    },
    async mounted() {
        let result = await this.$axiosGet('/bysj/project-chosen');
        if (result.status) {
            for (let i = 0; i < this.projects.length; i++) {
                if (result.projects[i]) this.$set(this.projects, i, result.projects[i]);
            }
        }
        else this.$alertError(result.msg);
    }
}