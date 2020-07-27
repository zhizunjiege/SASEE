<template>
  <div v-if="!projects.length" class="d-flex justify-content-center" style="height: 250px">
    <h1 class="text-muted align-self-center">暂无课题</h1>
  </div>
  <app-scroll
    v-else
    class="app-container px-3"
    mode="continue"
    :status="status"
    :bottom="60"
    @scroll::up="scrollUp"
  >
    <table class="table table-hover table-fixed text-center">
      <thead class="thead-light">
        <tr>
          <th scope="col" class="w-50">标题</th>
          <th scope="col">审核状态</th>
          <th scope="col">教师姓名</th>
          <th scope="col">教师职称</th>
          <th scope="col">发布时间</th>
          <th scope="col">修改时间</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(p,index) in projects"
          :key="index"
          class="point"
          @click.stop="loadContent(p.id,p.teacher,p.student)"
        >
          <td class="text-left ellipsis">{{p.title}}</td>
          <td>{{p.state.substr(2)}}</td>
          <td>{{p.name}}</td>
          <td>{{p.proTitle}}</td>
          <td>{{p.submitTime}}</td>
          <td>{{p.lastModifiedTime}}</td>
        </tr>
      </tbody>
    </table>
  </app-scroll>
</template>

<script>
export default {
  data() {
    return {
      status: "",
      end: false,
      projects: [],
    };
  },
  methods: {
    async getList(start, length) {
      if (this.end) return "end";
      let result = await this.$axiosGet("/bysj/project-list", {
        start,
        length,
      });
      if (result.status) {
        if (result.projects && result.projects.length) {
          this.projects.push(...result.projects);
          /* this.projects.sort((first, second) => {
                        return first.state.localeCompare(second.state);
                    }); */
          if (result.projects.length == length) {
            return "";
          }
        }
        this.end = true;
        return "end";
      } else {
        return "error";
      }
    },
    async scrollUp() {
      if (!this.end) {
        this.status = "loading";
        this.status = await this.getList(this.projects.length, 10);
      }
    },
    loadContent(pid, tid, sid) {
      this.$router.push({
        path: "/bysj/project-content",
        query: { pid, tid, sid },
      });
    },
  },
  created() {
    this.getList(0, 20);
  },
};
</script>