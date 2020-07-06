export default {
    template: `
    <app-scroll v-if="projects.length" class="app-container px-3" mode="continue" :status="status" :bottom="60" @scroll::up="scrollUp">
        <table class="table table-hover table-fixed text-center">
            <thead class="thead-light">
                <tr>
                    <th scope="col" class="w-50">标题</th>
                    <th scope="col">方向</th>
                    <th scope="col">教师</th>
                    <th scope="col">已选</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in projects" class="point" :data-id="item.id" :data-teacher="item.teacher" @click.stop="loadContent">
                    <td class="text-primary text-left ellipsis">{{item.title}}</td>
                    <td>{{item.group}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.chosen}}</td>
                </tr>
            </tbody>
        </table>
    </app-scroll>
    <div v-else class="d-flex justify-content-center" style="height: 250px">
        <h1 class="text-muted align-self-center">暂无课题</h1>
    </div>
    `,
    data() {
        return {
            status: '',
            end: false,
            projects: []
        };
    },
    methods: {
        async getList(start, length) {
            if (this.end) return 'end';
            let result = await this.$axiosGet('/bysj/project-list', { start, length });
            if (result.status) {
                if (result.projects && result.projects.length) {
                    this.projects.push(...result.projects);
                    if (result.projects.length == length) return '';
                }
                this.end = true;
                return 'end';
            } else {
                return 'error';
            }
        },
        async scrollUp() {
            this.status = 'loading';
            this.status = await this.getList(this.projects.length, 10);
        },
        loadContent(e) {
            this.$router.push({
                path: '/bysj/project-content',
                query: {
                    id: e.currentTarget.dataset.id,
                    teacher: e.currentTarget.dataset.teacher,
                    choseUsable: true
                }
            });
        }
    },
    mounted() {
        this.getList(0, 20);
    }
}