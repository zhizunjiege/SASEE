export default {
    template: `
    <app-scroll class="app-container" :status="status" mode="continue" :bottom="60"  @scroll::up="scrollUp">
        <div v-if="!news.length" class="d-flex justify-content-center" style="height: 250px">
            <h1 class="text-muted align-self-center">暂无通知</h1>
        </div>
        <div class="list-group mx-auto col-12 col-md-11">
            <li v-for="item in news" :data-id="item.id" @click.stop="loadContent" class="list-group-item list-group-item-action">
                <a href="#" class="float-left w-50 ellipsis">
                    <span v-if="item.top" class="badge badge-pill badge-warning">置顶</span>
                    {{item.title}}
                </a>
                <span class="float-right">{{item.publisher+'--'+item.date}}</span>
            </li>
        </div>
    </app-scroll>
    `,
    data() {
        return {
            status: '',
            end: false,
            news: []
        };
    },
    methods: {
        async getList(start, length) {
            if (this.end) return 'end';
            let result = await this.$axiosGet('/system/news-list', { start, length });
            if (result.status) {
                if (result.news && result.news.length) {
                    this.news.push(...result.news);
                    if (result.news.length == length) return '';
                }
                this.end = true;
                return 'end';
            } else {
                return 'error';
            }
        },
        async scrollUp() {
            this.status = 'loading';
            this.status = await this.getList(this.news.length, 10);
        },
        loadContent(e) {
            this.$router.push({
                path: '/system/news-content',
                query: { id: e.currentTarget.dataset.id }
            });
        }
    },
    mounted() {
        this.getList(0, 20);
    }
}