<template>
  <div v-if="Number(t.id)>0" class="app-container app-scroll text-center px-3">
    <header class="sticky-top bg-main border-bottom border-secondary mb-3">
      <h3 class="pt-3 mb-0">{{t.title}}</h3>
    </header>
    <div class="mb-3">
      <h5 class="text-primary">任务信息</h5>
      <table class="table table-fixed table-bordered">
        <tbody>
          <tr>
            <th>任务类型</th>
            <td>{{t.mode}}</td>
            <th>截止时间</th>
            <td>{{t.deadline}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mb-3">
      <h5 class="text-primary">任务简介</h5>
      <pre class="p-3 border rounded text-left">{{t.description}}</pre>
    </div>
    <div class="mb-3">
      <h5 class="text-primary">我的提交</h5>
      <table class="table table-fixed table-bordered">
        <tbody>
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

    <div class="row justify-content-center mt-5">
      <form
        @submit.prevent="submit"
        class="col-12 col-sm-9 col-md-8 col-lg-6 col-xl-5 text-center mt-3"
      >
        <input-file v-model="file"></input-file>
        <div class="form-row justify-content-end align-items-center mb-3">
          <app-button class="btn btn-primary col-12 col-md-5 mb-3 mb-md-0" type="submit">
            <i class="fa fa-arrow-up"></i>上传报告
          </app-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      t: {},
      file: [],
    };
  },
  methods: {
    async submit() {
      if (this.file.length > 0) {
        let formdata = new FormData();
        formdata.append("file", this.file[0]);
        formdata.append("tid", this.t.id);
        let rst = await this.$axiosFile("/scsx/upload-report", formdata);
        if (rst.status) {
          this.t.filename = this.file[0].name;
          this.t.time = new Date().toLocaleISOString();
        }
        this.$alertResult(rst);
        console.log(rst);
      } else {
        this.$alertWarn("请选择文件！");
      }
    },
  },
  async created() {
    let { tid } = this.$route.query;
    if (tid) {
      this.t = (await this.$axiosGet("/scsx/task-list", { tid })).t;
    }
  },
};
</script>