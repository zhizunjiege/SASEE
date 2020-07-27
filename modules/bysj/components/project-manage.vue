<template>
  <div class="app-container app-scroll px-0 px-md-3 text-center">
    <header class="sticky-top bg-main border-bottom border-secondary py-1 row justify-content-end">
      <app-button
        :disabled="projects.length>=limit"
        @click.native="submit"
        class="btn btn-primary col-12 col-md-4 mb-3 mb-md-0"
        type="button"
      >
        <i class="fa fa-plus"></i>发布新课题
      </app-button>
    </header>
    <template v-if="projects.length">
      <div
        v-for="(p,index) in projects"
        :key="index"
        class="mb-3 py-3 border-bottom border-secondary"
      >
        <header class="mb-3">
          <h3 class="pt-3 mb-0">{{p.title}}</h3>
        </header>
        <div class="mb-3">
          <table class="table table-fixed table-bordered">
            <tbody>
              <tr>
                <th>课题序号</th>
                <td>{{index+1}}</td>
                <th>审核状态</th>
                <td>{{p.state}}</td>
              </tr>
              <tr>
                <th>发布日期</th>
                <td>{{p.submitTime}}</td>
                <th>学生姓名</th>
                <td>{{p.student||'暂无'}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="row align-items-between justify-content-around">
          <app-button
            @click.native="remove(index)"
            class="btn btn-secondary col-12 col-md-2 mb-3 mb-md-0"
            type="button"
            warn="您确定删除该课题吗？"
          >
            <i class="fa fa-trash"></i>删除
          </app-button>
          <app-button
            @click.native="edit(index)"
            class="btn btn-primary col-12 col-md-2 mb-2 mb-md-0"
            type="button"
          >
            <i class="fa fa-pencil"></i>修改
          </app-button>
          <app-button
            @click.native="confirm(index)"
            class="btn btn-secondary col-12 col-md-2 mb-3 mb-md-0"
            type="button"
          >
            <i class="fa fa-users"></i>选择学生
          </app-button>
          <app-button
            @click.native="detail(index)"
            class="btn btn-primary col-12 col-md-2 mb-3 mb-md-0"
            type="button"
          >
            <i class="fa fa-info"></i>详情
          </app-button>
        </div>
      </div>
    </template>
    <div v-else class="d-flex justify-content-center" style="height: 150px">
      <h1 class="text-muted align-self-center">您没有发布课题</h1>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projects: [],
      limit: 2,
    };
  },
  methods: {
    async remove(index) {
      let result = await this.$axiosGet("/bysj/remove", {
        pid: this.projects[index].id,
      });
      if (result.status) {
        this.projects.splice(index, 1);
      }
      this.$alertResult(result);
    },
    submit() {
      this.$router.push({ path: "/bysj/project-form" });
    },
    edit(index) {
      this.$router.push({
        path: "/bysj/project-form",
        query: { pid: this.projects[index].id },
      });
    },
    confirm(index) {
      this.$router.push({
        path: "/bysj/project-confirm",
        query: { pid: this.projects[index].id },
      });
    },
    detail(index) {
      this.$router.push({
        path: "/bysj/wdkt",
        query: { pid: this.projects[index].id },
      });
    },
  },
  async created() {
    let result = await this.$axiosGet("/bysj/project-manage");
    if (result.status) {
      this.projects = result.projects;
      this.limit = result.limit;
    } else this.$alertError(result.msg);
  },
};
</script>