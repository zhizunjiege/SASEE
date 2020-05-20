export default {
    template: `
    <div class="row p-3">
        <div class="col-12 col-lg-6 mb-3 mb-lg-0">
            <div class="card">
                <header class="card-header">
                    <h5 class="mb-0 text-left">下载文件</h5>
                </header>
                <div class="card-body">
                    <ul v-if="files.down.length" class="list-group list-group-flush">
                        <a v-for="file in files.down" class="list-group-item"
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
                    <ul v-if="files.up.length" class="list-group list-group-flush">
                        <a v-for="file in files.up" @click.prevent.stop href="#" class="list-group-item">
                            <div class="row justify-content-between align-items-center">
                                <small class="d-inline-block w-50 ellipsis">{{file.name}}</small>
                                <small class="float-right">{{file.date}}</small>
                            </div>
                        </a>
                    </ul>
                    <div v-else class="d-flex justify-content-center align-items-center" style="height: 150px">
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
    `,
    props: {
        pid: String,
        identity: String
    },
    data() {
        return {
            files: {
                down: [],
                up: []
            }
        };
    },
    methods: {
        async upload() {
            this.$alertResult(await this.$axiosPost('/bysj/upload'));
        }
    },
    async created() {
        let result = await this.$axiosGet('/bysj/project-file', { pid: this.pid });
        if (result.status) {
            if (this.identity == 'student') {
                this.files.down = result.teacherFiles;
                this.files.up = result.studentFiles;
            } else {
                this.files.down = result.studentFiles;
                this.files.up = result.teacherFiles;
            }
        }
        else this.$alertError(result.msg);
    }
}