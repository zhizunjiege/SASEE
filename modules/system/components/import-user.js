export default {
    template: `
    <div class="app-container app-scroll text-center p-3">
        <h4>导入用户</h4>
        <p class="text-info">注：以下列均为必填项,请严格按照格式填写。有两种导入模式可选，其中覆盖模式将删除所有原来的数据，追加模式则会保留。</p>
        <div class="w-100">
            <img src="/system/img?file=example-teacher.png" class="img-fluid img-thumbnail mx-auto d-block mb-3"
                alt="教师表格示例">
            <h5>图1：教师表格示例</h5>
        </div>
        <form class="w-100 mb-3" @submit.prevent="importUser('teacher')">
            <div class="d-flex justify-content-center align-items-center mb-3">
                <input-file v-model="teacher" accept=".xls,.xlsx" pre="请上传表格文件，不超过20M" required class="col-12 col-md-6 mb-3 mb-md-0">
                </input-file>
                <input-radio v-model="tmode" :radios="[{val:'overwrite',des:'覆盖'},{val:'append',des:'追加'}]"
                    class="col-12 col-md-4"></input-radio>
            </div>
            <div class="form-group form-row justify-content-center">
                <app-button type="submit" class="btn btn-primary col-12 col-md-4 mb-3 mx-auto"><i class="fa fa-arrow-up"></i>导入教师信息
                </app-button>
            </div>
        </form>
        <div class="w-100">
            <img src="/system/img?file=example-student.png" class="img-fluid img-thumbnail mx-auto d-block mb-3"
                alt="学生表格示例">
            <h5>图2：学生表格示例</h5>
        </div>
        <form class="w-100 mb-3" @submit.prevent="importUser('student')">
            <div class="d-flex justify-content-center align-items-center mb-3">
                <input-file v-model="student" accept=".xls,.xlsx" pre="请上传表格文件，不超过20M" required class="col-12 col-md-6 mb-3 mb-md-0">
                </input-file>
                <input-radio v-model="smode" :radios="[{val:'overwrite',des:'覆盖'},{val:'append',des:'追加'}]"
                    class="col-12 col-md-4"></input-radio>
            </div>
            <div class="form-group form-row justify-content-center">
                <app-button type="submit" class="btn btn-primary col-12 col-md-4 mb-3 mx-auto"><i class="fa fa-arrow-up"></i>导入学生信息
                </app-button>
            </div>
        </form>
    </div>
    `,
    data() {
        return {
            teacher: [],
            student: [],
            tmode: 'overwrite',
            smode: 'overwrite'
        }
    },
    methods: {
        async importUser(identity) {
            let file = null, mode = '';
            if (identity == 'teacher') {
                file = this.teacher[0];
                mode = this.tmode;
            } else {
                file = this.student[0];
                mode = this.smode;
            }
            let data = new FormData();
            data.append('file', file);
            data.append('identity', identity);
            data.append('mode', mode);
            this.$alertResult(await this.$axiosFile('/system/import-user', data));
        }
    }
};