export default {
    template: `
    <div class="container-fluid text-center">
        <div v-if="students.length" class="row p-3">
            <nav class="col-12 col-md-3 list-group nav nav-pills flex-column">
                <a v-for="(s,index) in students" :href="'#student-'+index" :class="{'active':!index}"
                    class="list-group-item list-group-item-action nav-link" data-toggle="pill">
                    <span class="d-inline-block w-50 ellipsis">{{'学生'+(index+1)}}</span>
                </a>
            </nav>
            <div class="col-12 col-md-9 tab-content border rounded p-3">
                <div v-for="(s,index) in students" :id="'student-'+index" :class="{'show active':!index}"
                    class="tab-pane fade">
                    <info-student :sid="s"></info-student>
                    <div class="row align-items-center justify-content-around">
                        <app-button @click.native="submit(s)" class="btn btn-secondary col-12 col-md-3 mb-3 mb-md-0"
                            type="button" warn="您确定选择该学生吗？">选择该学生</app-button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="d-flex justify-content-center" style="height: 150px">
            <h1 class="text-muted align-self-center">无需选择学生</h1>
        </div>
    </div>
    `,
    data() {
        return {
            students: []
        };
    },
    methods: {
        async submit(sid) {
            let rst = await this.$axiosGet('/bysj/confirm', { pid: this.$route.query.pid, sid });
            this.$alertResult(rst);
            if (rst.status) {
                this.$router.push({ path: '/bysj/ktgl' });
            }
        }
    },
    components: {
        'info-student': () => import(`/components?module=bysj&component=info-student`)
    },
    async created() {
        let { pid } = this.$route.query;
        let result = await this.$axiosGet('/bysj/project-confirm', { pid });
        if (result.status) {
            this.students = result.students;
        }
        else {
            this.$alertError(result.msg);
        }
    }
}