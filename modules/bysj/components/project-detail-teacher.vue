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
          <project-notice :pid="pid" identity="teacher"></project-notice>
        </div>
        <div class="tab-pane fade text-center" id="project-info">
          <info-project :pid="pid" class="mb-3"></info-project>
          <info-student :sid="sid" class="mb-3"></info-student>
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
          <project-file :pid="pid" identity="teacher" class="mb-3"></project-file>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      pid: -1,
      sid: -1,
    };
  },
  components: {
    "info-project": () => import(`./info-project`),
    "info-student": () => import(`./info-student`),
    "project-notice": () => import(`./project-notice`),
    "project-file": () => import(`./project-file`),
  },
  async mounted() {
    let pid = this.$route.query.pid;
    let result = await this.$axiosGet("/bysj/project-detail", { pid });
    if (result.status) {
      this.pid = pid;
      this.sid = result.sid;
    }
    this.loading = false;
  },
};
</script>