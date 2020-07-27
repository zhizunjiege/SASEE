<template>
  <div v-if="show" class="p-3 app-container app-scroll">
    <wang-editor
      v-model="content"
      eid="admin_license_editor"
      server="/system/editor-img"
      :full="true"
      :height="530"
    ></wang-editor>
    <div class="form-row justify-content-end mb-3">
      <app-button
        @click.native="submit"
        class="btn btn-primary col-12 col-md-4"
        type="button"
        warn="您确定要发布该协议吗？"
      >
        <i class="fa fa-paper-plane"></i>发布
      </app-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      content: "",
    };
  },
  methods: {
    async submit() {
      if (this.content.length > 20) {
        let d = new FormData();
        d.append("content", this.content);
        this.$alertResult(await this.$axiosFile("/system/write-license", d));
      } else {
        this.$alertWarn("协议内容太短！");
      }
    },
  },
  async created() {
    this.content = await this.$axiosGet("/license");
    this.show = true;
  },
};
</script>