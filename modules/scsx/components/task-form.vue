<template>
  <div class="app-container app-scroll row justify-content-center px-0 px-md-3 text-center">
    <form class="col-8 py-3" @submit.prevent="submit">
      <input-text
        v-model="t.title"
        label="任务标题"
        placeholder="不超过255个字符（或汉字）"
        maxlength="255"
        required
      ></input-text>
      <input-select v-model="t.mode" label="任务类型" :options="['学习感想','个人总结']" required></input-select>
      <input-time v-model="t.deadline" label="截止时间" required></input-time>
      <input-textarea
        v-model="t.description"
        label="任务简介"
        rows="8"
        placeholder="最大1023个字符（或汉字）"
        maxlength="1023"
        required
      ></input-textarea>

      <div class="form-row justify-content-end align-items-center mb-3">
        <app-button
          class="btn btn-primary col-12 col-md-4 mb-3 mb-md-0"
          type="submit"
          warn="您确定提交该任务吗？"
        >
          <i class="fa fa-paper-plane"></i>提交
        </app-button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      t: {},
    };
  },
  methods: {
    async submit() {
      let result = await this.$axiosPost(
        `/scsx/task-${this.$route.query.tid ? "edit" : "add"}`,
        this.t
      );
      if (result.status) {
        this.$router.push({ path: "/scsx/rwgl" });
      }
      this.$alertResult(result);
    },
  },
  async created() {
    if (this.$route.query.tid) {
      this.t = (
        await this.$axiosGet("/scsx/task-info", {
          tid: this.$route.query.tid,
        })
      ).t;
      this.t.deadline = this.t.deadline.replace(" ", "T");
    } else {
      this.t = {
        title: "",
        mode: "学习感想",
        deadline: "",
        description: "",
      };
    }
  },
};
</script>