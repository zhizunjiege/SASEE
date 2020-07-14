export default {
    template: `
    <div class="row h-100 align-items-center justify-content-center p-3">
        <h4 class="col-12 text-center">自动模式</h4>
        <form class="col-12 col-md-8 col-lg-6 text-center" @submit.prevent="submit">
            <input-time v-model="times.open" label="开放选题" required></input-time>
            <input-time v-model="times.close" label="禁止选题" required></input-time>
            <input-time v-model="times.draw" label="抽签" required></input-time>
            <input-time v-model="times.adjust" label="调剂" required></input-time>

            <div class="row justify-content-end">
                <app-button class="btn btn-primary col-12 col-md-4 mb-3 mb-md-0" type="submit" 
                    warn="你确定提交吗？"><i class="fa fa-paper-plane"></i>提交
                </app-button>
            </div>
        </form>
        <h4 class="col-12 text-center">手动模式</h4>
        <div class="d-flex col-12 justify-content-around py-3">
            <app-button @click.native="operation('open')" class="btn btn-success col-12 col-md-2 mb-3 mb-md-0" type="button">
            <i class="fa fa-check"></i>开放选题</app-button>
            <app-button @click.native="operation('close')" class="btn btn-warning col-12 col-md-2 mb-3 mb-md-0" type="button">
            <i class="fa fa-times"></i>禁止选题</app-button>
            <app-button @click.native="operation('draw')" class="btn btn-secondary col-12 col-md-2 mb-3 mb-md-0" type="button" warn="您确定开始抽签吗？">
            <i class="fa fa-balance-scale"></i>开始抽签</app-button>
            <app-button @click.native="operation('adjust')" class="btn btn-primary col-12 col-md-2 mb-3 mb-md-0" type="button" warn="您确定开始调剂吗？">
            <i class="fa fa-adjust"></i>开始调剂</app-button>
        </div>
    </div>
    `,
    data() {
        return {
            times: {
                open: '',
                close: '',
                draw: '',
                adjust: ''
            }
        }
    },
    methods: {
        async submit() {
            let t = this.times;
            if (t.draw < t.adjust) {
                this.$alertResult(await this.$axiosPost('/bysj/date', { times: this.times }));
            } else {
                this.$alertWarn('调剂须在抽签之后，请修改后再提交。');
            }
        },
        async operation(opt) {
            this.$alertResult(await this.$axiosGet(`/bysj/manual-operation?opt=${opt}`));
        }
    },
    async created() {
        let rst = await this.$axiosGet('/bysj/date-info');
        if (rst.status) {
            for (const k of Object.keys(this.times)) {
                this.times[k] = rst.times[k];
            }
        }
    }
}