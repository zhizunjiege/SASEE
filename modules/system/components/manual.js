export default {
    template: `
    <div class="main-page row justify-content-center p-0 p-md-3">
        <div class="col-12 col-md-11" v-html="content"></div>
    </div>
    `,
    data() {
        return {
            content: ''
        }
    },
    async mounted() {
        this.content = await this.$axiosGet('/system/manual');
    }
};