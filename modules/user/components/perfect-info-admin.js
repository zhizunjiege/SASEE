export default {
    template: `
    <div class="app-container app-scroll row align-items-center justify-content-center">
        <form class="col-12 col-sm-11 col-md-10 col-lg-9 col-xl-8 text-center mt-3" @submit.prevent="submit">
            <input-text v-model="fields.tel" label="手机号" placeholder="11位数字" pattern="^[1]([3-9])[0-9]{9}$"></input-text>
            <div class="form-row justify-content-end align-items-center mb-3">
                <app-button class="btn btn-primary col-12 col-md-5 mb-3 mb-md-0" type="submit"><i class="fa fa-paper-plane"></i>提交</app-button>
            </div>
        </form>
    </div>
    `,
    data() {
        return {
            fields: {
                tel: ''
            }
        }
    },
    methods: {
        async submit() {
            let flag = false, data = Object.assign({}, this.fields);
            for (const [key, value] of Object.entries(this.fields)) {
                if (value) {
                    flag = true;
                } else {
                    delete data[key];
                }
            }
            if (flag) {
                let result = await this.$axiosPost('/user/perfect-info', data);
                this.$alertResult(result);
            } else {
                this.$alertWarn('请至少填写一个项目！');
            }
        }
    }
}