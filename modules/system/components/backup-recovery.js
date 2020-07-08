export default {
    template: `
    <div class="d-flex justify-content-around align-items-center app-container py-3">
        <app-button @click.native="backup" class="btn btn-primary col-12 col-md-4" type="button" warn="您确定要备份数据库吗？">
            备份数据库
        </app-button>
        <app-button @click.native="recovery" class="btn btn-secondary col-12 col-md-4" type="button" warn="您确定要恢复数据库吗？">
            恢复数据库
        </app-button>
    </div>
    `,
    methods: {
        async backup() {
            this.$alertResult(await this.$axiosGet('/system/data-backup'));
        },
        async recovery() {
            this.$alertResult(await this.$axiosGet('/system/data-recovery'));
        }
    }
}