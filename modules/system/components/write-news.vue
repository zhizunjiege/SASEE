<template>
  <div class="p-3 app-container app-scroll">
    <form class="app-container" @submit.prevent="submit">
      <div class="form-row justify-content-around align-items-center mb-3">
        <input-checkbox v-model="top" :checkboxs="[{ val: true, des: '置顶' }]" class="col-2"></input-checkbox>
        <input-text
          v-model="title"
          label="标题"
          placeholder="不超过255个字符（或汉字）"
          maxlength="255"
          required
          class="col-10 col-md-6 col-lg-4 mb-0"
        ></input-text>
      </div>
      <wang-editor
        v-model="content"
        eid="admin_news_editor"
        :full="true"
        :height="480"
        server="/system/editor-img"
      ></wang-editor>
      <div class="form-row justify-content-end mb-3">
        <app-button class="btn btn-primary col-12 col-md-4" type="submit" warn="您确定要发布该通知吗？">
          <i class="fa fa-paper-plane"></i>发布
        </app-button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      top: false,
      title: "",
      content: "",
    };
  },
  methods: {
    async submit() {
      if (this.content.length > 20) {
        let d = new FormData();
        d.append("content", this.content);
        d.append("title", this.title);
        d.append("top", Number(this.top));
        let rst = await this.$axiosFile("/system/write-news", d);
        this.$alertResult(rst);
        if (rst.status) {
          this.$router.push({
            path: "/system/tzgg",
          });
        }
      } else {
        this.$alertWarn("通知内容太短！");
      }
    },
  },
};
</script>