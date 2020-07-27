<template>
  <div class="d-flex flex-column h-100">
    <div
      v-show="loading"
      class="app-backdrop row justify-content-center align-items-center h-100 w-100"
    >
      <div class="spinner-border spinner-border-lg text-primary"></div>
    </div>
    <template v-if="Number(pid)>0">
      <nav class="nav nav-tabs nav-justified sticky-top bg-main">
        <a data-toggle="tab" class="nav-item nav-link active" href="#project-notice">通知墙</a>
        <a data-toggle="tab" class="nav-item nav-link" href="#project-info">课题信息</a>
        <a data-toggle="tab" class="nav-item nav-link" href="#project-file">课题文件</a>
      </nav>
      <div class="tab-content px-3 app-container app-scroll flex-grow-1">
        <div class="tab-pane fade show active" id="project-notice">
          <project-notice :pid="pid" identity="student"></project-notice>
        </div>
        <div class="tab-pane fade text-center" id="project-info">
          <info-project :pid="pid" class="mb-3"></info-project>
          <info-teacher :tid="tid" class="mb-3"></info-teacher>
          <div class="px-3">
            <a
              :href="'/bysj/export-excel?pid='+pid"
              download
              class="d-flex w-100 justify-content-end"
            >
              <app-button class="btn btn-primary col-12 col-md-3 mb-3" type="button">
                <i class="fa fa-arrow-down"></i>导出申请表
              </app-button>
            </a>
          </div>
        </div>
        <div class="tab-pane fade" id="project-file">
          <project-file :pid="pid" identity="student" class="mb-3"></project-file>
        </div>
      </div>
    </template>
    <div
      v-else
      class="d-flex justify-content-center align-items-center text-muted"
      style="height: 250px"
    >
      <h1>您没有生效的课题！</h1>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      pid: -1,
      tid: -1,
    };
  },
  methods: {
    async exportExcel(pid) {
      await this.$axiosGet("/bysj/export-excel", { pid });
    },
  },
  components: {
    "info-project": () => import(`./info-project`),
    "info-teacher": () => import(`./info-teacher`),
    "project-notice": () => import(`./project-notice`),
    "project-file": () => import(`./project-file`),
  },
  async created() {
    let result = await this.$axiosGet("/bysj/project-detail");
    if (result.status) {
      this.pid = result.pid;
      this.tid = result.tid;
    }
    this.loading = false;
  },
};
</script>