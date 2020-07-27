<template>
  <div v-if="identity=='teacher'||notices.length" class="container-fluid">
    <div class="row p-3">
      <nav class="col-12 col-md-3 list-group nav nav-pills flex-column">
        <a
          v-if="identity=='teacher'"
          class="list-group-item list-group-item-action nav-link"
          :class="{'active':!notices.length}"
          data-toggle="pill"
          href="#submit_notice"
        >发布新通知</a>
        <a
          v-for="(notice,index) in notices"
          :key="index"
          :href="'#notice-'+index"
          :class="{'active':!index}"
          class="list-group-item list-group-item-action nav-link"
          data-toggle="pill"
        >
          <span class="d-inline-block w-50 ellipsis">{{notice.title}}</span>
          <span class="float-right">{{notice.date}}</span>
        </a>
      </nav>
      <div class="col-12 col-md-9 tab-content border rounded p-3">
        <div
          v-for="(notice,index) in notices"
          :key="index"
          v-html="notice.content"
          :id="'notice-'+index"
          :class="{'show active':!index}"
          class="tab-pane fade"
        ></div>
        <div id="submit_notice" class="tab-pane fade" :class="{'show active':!notices.length}">
          <wang-editor v-model="content" eid="teacher_notice_editor" :height="400"></wang-editor>
          <form @submit.prevent="submit" class="text-center">
            <input-text
              v-model="title"
              label="标题"
              placeholder="不超过255个字符（或汉字）"
              maxlength="255"
              required
            ></input-text>
            <div class="form-group form-row justify-content-end">
              <app-button
                class="btn btn-primary col-12 col-md-4 mb-3 mb-md-0"
                type="submit"
                warn="您确定发布该通知吗？"
              >
                <i class="fa fa-paper-plane"></i>发布
              </app-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="d-flex justify-content-center align-items-center" style="height: 250px">
    <h1 class="text-muted">暂无通知</h1>
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
      notices: [],
      title: "",
      content: "",
    };
  },
  methods: {
    async submit() {
      if (this.content.length > 20) {
        this.$alertResult(
          await this.$axiosPost("/bysj/notice", {
            content: this.content,
            title: this.title,
            pid: this.pid,
          })
        );
      } else {
        this.$alertWarn("请输入通知内容！");
      }
    },
  },
  async created() {
    let result = await this.$axiosGet("/bysj/project-notice", {
      pid: this.pid,
    });
    if (result.status) this.notices = result.notices;
    else this.$alertError(result.msg);
  },
};
</script>