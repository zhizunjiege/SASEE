export default {
    template: `
    <div class="app-container row align-items-center justify-content-center">
        <form class="col-12 col-sm-9 col-md-8 col-lg-6 col-xl-5 text-center mt-3" @submit.prevent="submit">
            <input-text v-model="fields.email" type="email" label="邮箱" placeholder="请输入正确的邮箱地址" required>
            </input-text>
            <input-pincode v-model="fields.pinCode" label="验证码" :extra="{email:fields.email}" required></input-pincode>
            <div class="form-row justify-content-end align-items-center mb-3">
                <app-button class="btn btn-primary col-12 col-md-5 mb-3 mb-md-0" type="submit">绑定</app-button>
            </div>
        </form>
    </div>
    `,
    data() {
        return {
            fields: {
                email: '',
                pinCode: ''
            }
        }
    },
    methods: {
        async submit() {
            this.$alertResult(await this.$axiosPost('/user/set-email', this.fields));
        }
    }
}