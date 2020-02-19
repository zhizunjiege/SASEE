export default {
    template: `
    <div class="app-container app-scroll row justify-content-center py-3">
        <div class="col-12 col-md-11" v-html="content"></div>
    </div>
    `,
    data() {
        return {
            content: ''
        };
    },
    async mounted() {
        let id = this.$route.query.id;
        if (id) this.content = await this.$axiosGet('/system/news-content', { id });
        else this.$router.push({ path: '/system' });
    }
}