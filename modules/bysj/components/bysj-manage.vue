<template>
  <div class="app-container app-scroll px-0 px-md-3 text-center position-relative">
    <div
      class="sticky-top form-group form-row justify-content-around border-bottom border-primary py-3"
    >
      <app-button
        @click.native="truncate"
        class="btn btn-warning"
        type="button"
        warn="您确定要删除所有课题吗？"
      >
        <i class="fa fa-trash"></i>删除所有
      </app-button>
      <app-button @click.native="submit" class="btn btn-primary" type="button">
        <i class="fa fa-plus"></i>新增课题
      </app-button>
      <app-button @click.native="show='stats'" class="btn btn-secondary" type="button">
        <i class="fa fa-bar-chart"></i>信息统计
      </app-button>
      <a href="/bysj/export-table" download>
        <app-button class="btn btn-primary" type="button">
          <i class="fa fa-arrow-down"></i>导出总表
        </app-button>
      </a>
      <div class="input-group col-12 col-md-3">
        <input
          v-model="name"
          @keyup.enter="search"
          class="form-control"
          type="search"
          placeholder="输入教师姓名进行搜索..."
          required
        />
        <div class="input-group-append">
          <app-button @click.native="search" class="btn btn-outline-success" type="button">
            <i class="fa fa-search"></i>搜索
          </app-button>
        </div>
      </div>
    </div>
    <template v-if="show=='stats'">
      <table class="table table-hover table-bordered text-center py-3">
        <caption class="text-center">课题信息统计</caption>
        <thead class="thead-light">
          <tr>
            <th scope="col">分组</th>
            <th scope="col">学生人数</th>
            <th scope="col">教师人数</th>
            <th scope="col">未审核课题</th>
            <th scope="col">未通过课题</th>
            <th scope="col">通过课题</th>
            <th scope="col">课题总数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(i,index) in stats" :key="index">
            <th scope="row">{{i.group}}</th>
            <td>{{i.students}}</td>
            <td>{{i.teachers}}</td>
            <td>{{i.uncheck}}</td>
            <td>{{i.unpass}}</td>
            <td>{{i.pass}}</td>
            <td>{{i.uncheck+i.unpass+i.pass}}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-if="show=='projects'">
      <template v-if="projects.length">
        <div v-for="(p,index) in projects" :key="index" class="py-3 border-bottom border-secondary">
          <header class="mb-3">
            <h3 class="pt-3 mb-0">{{p.title}}</h3>
          </header>
          <div class="mb-3">
            <table class="table table-fixed table-bordered">
              <tbody>
                <tr>
                  <th>教师姓名</th>
                  <td>{{p.name}}</td>
                  <th>审核状态</th>
                  <td>{{p.state}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row align-items-between justify-content-around">
            <app-button
              @click.native="remove(index)"
              class="btn btn-warning col-12 col-md-3 mb-3 mb-md-0"
              type="button"
              warn="您确定删除该课题吗？"
            >
              <i class="fa fa-trash"></i>删除
            </app-button>
            <app-button
              @click.native="edit(index)"
              class="btn btn-secondary col-12 col-md-3 mb-3 mb-md-0"
              type="button"
            >
              <i class="fa fa-pencil"></i>修改
            </app-button>
            <app-button
              @click.native="check(index)"
              class="btn btn-primary col-12 col-md-3 mb-3 mb-md-0"
              type="button"
            >
              <i class="fa fa-gavel"></i>审核
            </app-button>
          </div>
        </div>
      </template>
      <div
        v-else
        class="d-flex justify-content-center align-items-center text-muted"
        style="height: 250px"
      >
        <h1>姓名有误或该老师未发布课题！</h1>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: "",
      stats: [],
      projects: [],
      name: "",
    };
  },
  methods: {
    async truncate() {
      this.$alertResult(await this.$axiosGet("/bysj/truncate"));
    },
    async search() {
      if (this.name) {
        let rst = await this.$axiosGet("/bysj/search", { name: this.name });
        if (rst.status) {
          this.projects = rst.projects;
          this.show = "projects";
        } else {
          this.$alertError(rst.msg);
        }
      }
    },
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
    check(index) {
      this.$router.push({
        path: "/bysj/project-content",
        query: {
          pid: this.projects[index].id,
          tid: this.projects[index].teacher,
          sid: this.projects[index].student,
        },
      });
    },
  },
  async created() {
    let rst = await this.$axiosGet("/bysj/stats");
    if (rst.status) {
      this.stats = rst.stats;
      let t = {
        students: 0,
        teachers: 0,
        uncheck: 0,
        unpass: 0,
        pass: 0,
      };
      for (const i of this.stats) {
        for (const k of Object.keys(t)) {
          t[k] += i[k] || 0;
        }
      }
      t.group = "总计";
      this.stats.push(t);
      this.show = "stats";
    }
  },
};
</script>