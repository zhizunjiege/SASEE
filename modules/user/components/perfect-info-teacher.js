export default {
    template: `
    <div class="app-container app-scroll row align-items-center justify-content-center">
        <form class="col-12 col-sm-9 col-md-8 col-lg-6 col-xl-5 text-center mt-3" @submit.prevent="submit">
            <input-text v-model="fields.wechat" label="微信" placeholder="1~255位字母或数字" pattern="[a-zA-Z0-9]{1,255}">
            </input-text>
            <input-text v-model="fields.tel" label="手机号" placeholder="11位数字" pattern="^[1]([3-9])[0-9]{9}$">
            </input-text>
            <input-text v-model="fields.homepage" label="个人主页" placeholder="请输入正确的网址，不超过255位字符"></input-text>
            <input-text v-model="fields.office" label="办公地点" placeholder="不超过255个字符（或汉字）"></input-text>
            </input-text>
            <input-text v-model="fields.field" label="研究领域" placeholder="不超过255个字符（或汉字）"></input-text>
            </input-text>
            <input-textarea v-model="fields.resume" label="个人简介" rows="12" placeholder="不超过1023个字符（或汉字）"
                maxlength="1023"></input-textarea>
            <div class="form-row justify-content-end align-items-center mb-3">
                <app-button class="btn btn-primary col-12 col-md-5 mb-3 mb-md-0" type="submit">提交</app-button>
            </div>
        </form>
    </div>
    `,
    data() {
        return {
            fields: {
                wechat: '',
                tel: '',
                homepage: '',
                office: '',
                field: '',
                resume: ''
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