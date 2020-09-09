<template>
  <div v-if="groups.length" class="text-center app-container app-scroll">
    <div v-for="(g,index) in groups" :key="index" class="py-3 border-bottom border-secondary">
      <header class="mb-3">
        <h3 class="pt-3 mb-0">{{`${g.group}-第${g.num}组`}}</h3>
      </header>
      <div class="mb-3">
        <table class="table table-fixed table-bordered">
          <tbody>
            <tr>
              <th>上课时间</th>
              <td>{{g.time}}</td>
              <th>上课地点</th>
              <td>{{g.place}}</td>
            </tr>
            <tr>
              <th>课程容量</th>
              <td>{{g.capacity}}</td>
              <th>已选人数</th>
              <td>{{g.chosen}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="row align-items-between justify-content-around">
        <app-button
          @click.native="choose(g.id)"
          class="btn btn-warning col-12 col-md-3 mb-3 mb-md-0"
          type="button"
          warn="您确定选择该分组吗？"
          :disabled="g.capacity<=g.chosen"
        >
          <i class="fa fa-check"></i>选择
        </app-button>
        <app-button
          @click.native="detail(g.id)"
          class="btn btn-primary col-12 col-md-3 mb-3 mb-md-0"
          type="button"
        >
          <i class="fa fa-info"></i>详情
        </app-button>
      </div>
    </div>
  </div>
  <div
    v-else
    class="d-flex justify-content-center align-items-center text-muted"
    style="height: 250px"
  >
    <h1>暂无分组信息！</h1>
  </div>
</template>
<script>
export default {
  data() {
    return {
      groups: [],
    };
  },
  methods: {
    async choose(gid) {
      let rst = await this.$axiosPost("/kcsj/choose", { gid });
      if (rst.status) {
        this.$router.push({
          path: "/kcsj/wdfz",
        });
      }
      this.$alertResult(rst);
    },
    detail(gid) {
      this.$router.push({
        path: "/kcsj/fzxx",
        query: { gid },
      });
    },
  },
  async created() {
    let rst = await this.$axiosGet("/kcsj/group-choose");
    if (rst.status) {
      this.groups = rst.groups;
    } else {
      this.$alertError(rst.msg);
    }
  },
};
</script>