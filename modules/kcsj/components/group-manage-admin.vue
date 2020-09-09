<template>
  <div class="app-container app-scroll px-0 px-md-3 text-center position-relative">
    <div
      class="sticky-top bg-main form-group form-row justify-content-around border-bottom border-primary py-2"
    >
      <app-button
        @click.native="truncate"
        class="btn btn-warning"
        type="button"
        warn="您确定要删除所有分组吗？"
      >
        <i class="fa fa-trash"></i>删除所有
      </app-button>
      <app-button @click.native="add" class="btn btn-primary" type="button">
        <i class="fa fa-plus"></i>新增分组
      </app-button>
      <a href="/kcsj/export-table" download>
        <app-button class="btn btn-secondary" type="button">
          <i class="fa fa-arrow-down"></i>导出总表
        </app-button>
      </a>
    </div>
    <template v-if="groups.length">
      <div v-for="(g,index) in groups" :key="index" class="py-3 border-bottom border-secondary">
        <header class="mb-3">
          <h3 class="pt-3 mb-0">{{`${g.group.substr(2)}-第${g.num}组`}}</h3>
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
                <th>课程简介</th>
                <td>{{g.description}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="row align-items-between justify-content-around">
          <app-button
            @click.native="remove(g.id,index)"
            class="btn btn-warning col-12 col-md-3 mb-3 mb-md-0"
            type="button"
            warn="您确定删除该分组吗？"
          >
            <i class="fa fa-trash"></i>删除
          </app-button>
          <app-button
            @click.native="edit(g.id)"
            class="btn btn-secondary col-12 col-md-3 mb-3 mb-md-0"
            type="button"
          >
            <i class="fa fa-pencil"></i>修改
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
    </template>
    <div
      v-else
      class="d-flex justify-content-center align-items-center text-muted"
      style="height: 250px"
    >
      <h1>暂无分组信息！</h1>
    </div>
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
    async truncate() {
      this.$alertResult(await this.$axiosGet("/kcsj/truncate"));
      this.groups = [];
    },
    async remove(gid, index) {
      let result = await this.$axiosGet("/kcsj/group-remove", { gid });
      if (result.status) {
        this.groups.splice(index, 1);
      }
      this.$alertResult(result);
    },
    add() {
      this.$router.push({
        path: "/kcsj/xzfz",
      });
    },
    edit(gid) {
      this.$router.push({
        path: "/kcsj/xgfz",
        query: { gid },
      });
    },
    detail(gid) {
      this.$router.push({
        path: "/kcsj/fzxx",
        query: { gid },
      });
    },
  },
  async created() {
    let rst = await this.$axiosGet("/kcsj/group-manage");
    if (rst.status) {
      this.groups = rst.groups;
    }
  },
};
</script>