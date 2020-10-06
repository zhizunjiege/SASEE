<template>
  <app-scroll
    class="app-container"
    :status="status"
    mode="continue"
    :bottom="60"
    @scroll::up="scrollUp"
  >
    <div class="">
      <div class="row justify-content-center align-items-start p-3">
        <div
          class="p-2 d-flex flex-column justify-content-center align-items-center"
        >
          <app-avatar
            src="./img/unknown.png"
            size="72px"
            class="mb-3"
          ></app-avatar>
          <feedback-star :score.sync="star" showText></feedback-star>
        </div>
        <div class="col-10">
          <form @submit.prevent="submit">
            <input-textarea
              v-model="content"
              rows="5"
              placeholder="请匿名留下您宝贵的意见吧，不超过1023个字符（或汉字）"
              maxlength="1023"
            >
            </input-textarea>
            <div>
              <div class="row w-100 justify-content-end">
                <app-button
                  @click.native="cancel"
                  class="btn btn-secondary mr-md-3"
                  type="button"
                >
                  <i class="fa fa-times"></i>清空内容
                </app-button>
                <app-button
                  class="btn btn-primary ml-md-3"
                  type="submit"
                  warn="您确定要提交反馈吗？"
                >
                  <i class="fa fa-paper-plane"></i>提交反馈
                </app-button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div
      v-if="!comments.length"
      class="d-flex justify-content-center"
      style="height: 250px"
    >
      <h3 class="text-muted align-self-center">大家的反馈会显示在这里哦~</h3>
    </div>
    <div v-else class="">
      <h4 class="sticky-top bg-main p-3 mb-0">
        <span class="mx-2 text-primary">{{ total }}</span
        >反馈
      </h4>
      <div v-for="comment in comments" :key="comment.id" class="px-3 comment">
        <div class="d-flex w-100 justify-content-start align-items-center">
          <div class="mx-3">
            <app-avatar src="./img/unknown.png" size="48px"></app-avatar>
          </div>
          <div class="mr-5">
            <div class="nickname">匿名用户</div>
            <div class="date">{{ comment.time }}</div>
          </div>
          <feedback-star
            disabled
            showText
            :score="comment.star"
          ></feedback-star>
        </div>
        <div class="content">
          <pre class="py-3 rounded text-left">{{ comment.content }}</pre>
        </div>
      </div>
    </div>
  </app-scroll>
</template>

<script>
export default {
  data() {
    return {
      total: -1,
      comments: [],
      content: "",
      star: 5,
      status: "",
    };
  },
  components: {
    "feedback-star": () => import(`./feedback-star`),
  },
  methods: {
    async getList(start, length) {
      if (this.status == "end") return "end";
      let result = await this.$axiosGet("/system/comments-list", {
        start,
        length,
      });
      if (result.status) {
        if (result.comments && result.comments.length) {
          this.comments.push(...result.comments);
          if (result.comments.length == length) return "";
        }
        this.end = true;
        return "end";
      } else {
        return "error";
      }
    },
    async scrollUp() {
      this.status = "loading";
      this.status = await this.getList(this.comments.length, 10);
    },
    cancel(index) {
      this.content = "";
    },
    async submit() {
      if (this.content.length < 20) {
        this.$alertWarn("字数太少，请多说一点吧！");
        return;
      }
      let rst = await this.$axiosPost("/system/submit-feedback", {
        content: this.content,
        star: this.star,
      });
      this.$alertResult(rst);
      if (rst.status) {
        this.comments.unshift({
          id: rst.id,
          star: this.star,
          time: new Date().toLocaleISOString(),
          content: this.content,
        });
        this.total++;
        this.content = "";
        this.star = 5;
      }
    },
  },
  async mounted() {
    let rst = await this.$axiosGet("/system/comments-total");
    if (rst.status) {
      this.total = rst.total;
    }
    this.getList(0, 20);
  },
};
</script>

<style scoped>
.nickname {
  font-size: 14px;
}
.date {
  font-size: 12px;
  color: grey;
}
.comment > .content > pre {
  position: relative;
  left: 80px;
  width: calc(100% - 96px);
}
.comment:not(:last-child) > .content > pre {
  border-bottom: 1px dashed #ebc8c8;
}
</style>