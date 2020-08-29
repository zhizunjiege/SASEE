<template>
  <div class="app-container app-scroll px-0 px-md-3 text-center position-relative">
    <template v-if="tasks.length">
      <div v-for="(t,index) in tasks" :key="index" @click="detail(t.id)" class="py-3 clickable">
        <header class="mb-3">
          <h3 class="pt-3 text-primary mb-0">{{t.title}}</h3>
        </header>
        <div class="mb-3">
          <table class="table table-fixed table-bordered">
            <tbody>
              <tr>
                <th>任务类型</th>
                <td colspan="2">{{t.mode}}</td>
                <th>截止时间</th>
                <td colspan="2">{{t.deadline}}</td>
              </tr>
              <tr>
                <th>报告文件</th>
                <td>{{t.filename||'未提交'}}</td>
                <th>提交时间</th>
                <td>{{t.time||'未提交'}}</td>
                <th>评分/等第</th>
                <td>{{t.score||'暂无'}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <div
      v-else
      class="d-flex justify-content-center align-items-center text-muted"
      style="height: 250px"
    >
      <h1>暂无任务信息！</h1>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tasks: [],
    };
  },
  methods: {
    detail(tid) {
      this.$router.push({
        path: "/scsx/rwxq",
        query: { tid },
      });
    },
  },
  async created() {
    let rst = await this.$axiosGet("/scsx/task-list");
    if (rst.status) {
      this.tasks = rst.tasks;
    }
  },
};
</script>

<style scoped>
.clickable {
  cursor: pointer;
  border-bottom: 1px solid black;
}
.clickable:hover {
  background-color: #ccf7ff;
  border-radius: 0.5rem;
  transition: all 0.15s ease-in-out;
}
</style>