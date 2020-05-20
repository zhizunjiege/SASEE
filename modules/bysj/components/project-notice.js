export default {
    template: `
    <div v-if="notices.length" class="container-fluid">
        <div class="row p-3">
            <nav class="col-12 col-md-4 list-group nav nav-pills flex-column">
                <a v-for="(notice,index) in notices" :href="'#notice-'+index" :class="{'active':!index}"
                    class="list-group-item list-group-item-action nav-link" data-toggle="pill">
                    <span class="d-inline-block w-50 ellipsis">{{notice.title}}</span>
                    <span class="float-right">{{notice.date}}</span>
                </a>
                <a v-if="identity=='teacher'" class="list-group-item list-group-item-action nav-link rel-bottom"
                    data-toggle="pill" href="#submit_notice">发布新通知</a>
            </nav>
            <div class="col-12 col-md-8 tab-content border rounded p-3">
                <div v-html="notice.content" v-for="(notice,index) in notices" :id="'notice-'+index" :class="{'show active':!index}"
                    class="tab-pane fade"></div>
                <div id="submit_notice" class="tab-pane fade">
                    <div class="mb-3 editor">
                        <p>请在此处输入内容···</p>
                    </div>
                    <form action="" method="POST">
                        <div class="form-group form-row text-center">
                            <label for="notice_title" class="col-3 col-lg-2 col-form-label required">标题：</label>
                            <input type="text" name="title" id="notice_title" class="col-9 col-lg-10 form-control"
                                placeholder="请输入标题" maxlength="255" required>
                        </div>
                        <div class="form-group form-row justify-content-around">
                            <button class="btn btn-secondary col-12 col-md-3 mb-3 mb-md-0 editor-clear"
                                type="reset">清空</button>
                            <button class="btn btn-primary col-12 col-md-3 mb-3 mb-md-0" type="submit">发布</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="d-flex justify-content-center align-items-center" style="height: 250px">
        <h1 class="text-muted">暂无通知</h1>
    </div>
    `,
    props: {
        pid: String,
        identity: String
    },
    data() {
        return {
            notices: []
        };
    },
    methods: {
        async submit() {
            this.$alertResult(await this.$axiosPost('/bysj/submit-notice'));
        }
    },
    async created() {
        let result = await this.$axiosGet('/bysj/project-notice', { pid: this.pid });
        if (result.status) this.notices = result.notices;
        else this.$alertError(result.msg);
    }
}