<template>
  <div class="row p-3">
    <div class="col-12 col-lg-6 mb-3 mb-lg-0">
      <div class="card bg-main">
        <header class="card-header">
          <h5 class="mb-0 text-left">下载文件</h5>
        </header>
        <div class="card-body" style="min-height: 200px">
          <ul v-if="files.down.length" class="list-group list-group-flush">
            <a
              v-for="(file,index) in files.down"
              :key="index"
              class="list-group-item"
              :href="href(file)"
              download
            >
              <div class="row justify-content-between align-items-center">
                <small class="d-inline-block w-50 ellipsis">{{file.filename}}</small>
                <small class="float-right">{{file.date}}</small>
              </div>
            </a>
          </ul>
          <div class="d-flex justify-content-center align-items-center" style="height: 150px">
            <h3 class="text-muted">暂无可下载文件</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-6 mb-3 mb-lg-0">
      <div class="card bg-main">
        <div class="card-body" style="min-height: 200px">
          <ul v-if="files.up.length" class="list-group list-group-flush">
            <a
              v-for="(file,index) in files.up"
              :key="index"
              @click.prevent.stop
              href="#"
              class="list-group-item"
            >
              <div class="row justify-content-between align-items-center">
                <small class="d-inline-block w-50 ellipsis">{{file.filename}}</small>
                <small class="float-right">{{file.date}}</small>
              </div>
            </a>
          </ul>
          <div
            v-else
            class="d-flex justify-content-center align-items-center"
            style="height: 150px"
          >
            <h3 class="text-muted">未上传文件</h3>
          </div>
        </div>
        <footer class="card-footer d-flex align-items-center justify-content-end">
          <a href="#" @click.prevent.stop="uploading=true">
            <h5 class="mb-0 mr-3 d-inline-block">上传文件</h5>
          </a>
        </footer>
      </div>
    </div>
    <div v-show="uploading" class="row justify-content-center mt-5 w-100">
      <form
        @submit.prevent="submit"
        class="col-12 col-sm-9 col-md-8 col-lg-6 col-xl-5 text-center mt-3"
      >
        <input-file v-model="files.uploading"></input-file>
        <div class="form-row justify-content-between align-items-center mb-3">
          <app-button
            @click.native.stop="uploading=false"
            class="btn btn-secondary col-12 col-md-5 mb-3 mb-md-0"
            type="button"
          >
            <i class="fa fa-ban"></i>取消
          </app-button>
          <app-button class="btn btn-primary col-12 col-md-5 mb-3 mb-md-0" type="submit">
            <i class="fa fa-arrow-up"></i>上传
          </app-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pid: [Number, String],
    identity: String,
  },
  data() {
    return {
      files: {
        down: [],
        up: [],
        uploading: [],
      },
      uploading: false,
    };
  },
  computed: {
    href(file) {
      return this.identity == "student"
        ? `/bysj/download?pid=${this.pid}&filename=${file.filename}`
        : `/bysj/download?pid=${this.pid}&uploader=${file.uploader}&filename=${file.filename}`;
    },
  },
  methods: {
    async submit() {
      if (this.files.uploading.length > 0) {
        let formdata = new FormData();
        formdata.append("file", this.files.uploading[0]);
        formdata.append("pid", this.pid);
        this.$alertResult(await this.$axiosFile("/bysj/upload", formdata));
        let now = this.files.uploading[0];
        this.files.up.push({
          filename: now.name,
          date: new Date().toLocaleISOString().substr(0, 10),
        });
        this.files.uploading = [];
      } else {
        this.$alertWarn("请选择文件！");
      }
    },
  },
  async created() {
    let result = await this.$axiosGet("/bysj/project-file", { pid: this.pid });
    if (result.status) {
      if (this.identity == "student") {
        this.files.down = result.teacherFiles;
        this.files.up = result.studentFiles;
      } else {
        this.files.down = result.studentFiles;
        this.files.up = result.teacherFiles;
      }
    } else this.$alertError(result.msg);
  },
};
</script>