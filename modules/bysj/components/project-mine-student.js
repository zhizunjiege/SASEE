export default {
    template: `
    <div class="d-flex flex-column h-100">
    <app-backdrop :loading="loading"></app-backdrop>
    <template v-if="pid">
        <nav class="nav nav-tabs nav-justified sticky-top bg-white">
            <a data-toggle="tab" class="nav-item nav-link active" href="#project-notice">通知墙</a>
            <a data-toggle="tab" class="nav-item nav-link" href="#project-info">课题信息</a>
            <a data-toggle="tab" class="nav-item nav-link" href="#project-file">课题文件</a>
        </nav>
        <div class="tab-content px-3 app-container app-scroll flex-grow-1">
            <div class="tab-pane fade show active" id="project-notice">
                <project-notice :pid="pid" identity="student"></project-notice>
            </div>
            <div class="tab-pane fade text-center" id="project-info">
                <info-project :pid="pid" class="mb-3"></info-project>
                <info-teacher :tid="tid" class="mb-3"></info-teacher>
            </div>
            <div class="tab-pane fade" id="project-file">
                <project-file :pid="pid" identity="student" class="mb-3"></project-file>
            </div>
        </div>
    </template>
    <div v-else class="d-flex justify-content-center align-items-center" style="height: 250px">
        <h1>您没有生效的课题！</h1>
    </div>
</div>
    `,
    data() {
        return {
            loading: true,
            pid: '',
            tid: ''
        };
    },
    components: {
        'info-project': () => import(`/components?module=bysj&component=info-project`),
        'info-teacher': () => import(`/components?module=bysj&component=info-teacher`),
        'project-notice': () => import(`/components?module=bysj&component=project-notice`),
        'project-file': () => import(`/components?module=bysj&component=project-file`)
    },
    methods: {
        async upload() {
            this.$alertResult(await this.$axiosPost('/bysj/upload'));
        }
    },
    async created() {
        let result = await this.$axiosGet('/bysj/project-mine');
        if (result.status) {
            this.pid = '' + result.pid;
            this.tid = '' + result.tid;
        }
        this.loading = false;
    }
}