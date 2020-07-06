export default {
    template: `
    <div class="row h-100 align-items-center justify-content-center p-3">
        <h4 class="col-12 text-center">自动模式</h4>
        <form class="col-12 col-md-8 col-lg-6 text-center" @submit.prevent="submit">
            <input-time v-model="times.choose.time" label="选题" required></input-time>
            <input-time v-model="times.draw.time" label="抽签" required></input-time>
            <input-time v-model="times.adjust.time" label="调剂" required></input-time>

            <div class="row justify-content-end">
                <app-button class="btn btn-primary col-12 col-md-4 mb-3 mb-md-0" type="submit"
                    :disabled="times.adjust.usable" warn="你确定提交吗？">提交
                </app-button>
            </div>
        </form>
        <h4 class="col-12 text-center">手动模式</h4>
        <div class="d-flex col-12 justify-content-around py-3">
            <app-button @click.native="operation('choose','close')" class="btn btn-warning col-12 col-md-2 mb-3 mb-md-0" type="button">
                禁止选题</app-button>
            <app-button @click.native="operation('choose','open')" class="btn btn-success col-12 col-md-2 mb-3 mb-md-0" type="button">
                开放选题</app-button>
            <app-button @click.native="operation('draw')" class="btn btn-secondary col-12 col-md-2 mb-3 mb-md-0" type="button" warn="您确定开始抽签吗？">
                开始抽签</app-button>
            <app-button @click.native="operation('adjust')" class="btn btn-primary col-12 col-md-2 mb-3 mb-md-0" type="button" warn="您确定开始调剂吗？">
                开始调剂</app-button>
        </div>
    </div>
    `,
    data() {
        return {
            times: {
                choose: { time: '', usable: false },
                draw: { time: '' },
                adjust: { time: '' }
            }
        }
    },
    methods: {
        async submit() {
            let t = this.times;
            if (t.choose.time < t.draw.time && t.draw.time < t.adjust.time) {
                this.$alertResult(await this.$axiosPost('/bysj/date', { times: this.times }));
            } else {
                this.$alertWarn('时间顺序有误，请检查后提交。');
            }
        },
        async operation(opt, param) {
            this.$alertResult(await this.$axiosGet(`/bysj/manual-operation?opt=${opt}&param=${param}`));
        }
    },
    async created() {
        let rst = await this.$axiosGet('/bysj/date-info');
        if (rst.status) {
            this.times = rst.times;
        }
    }
}