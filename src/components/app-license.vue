<template>
  <div v-if="content.length" class="app-container app-scroll row justify-content-center p-0 p-md-3">
    <h3 class="col-12 text-center">用户协议</h3>
    <div class="col-12 col-md-10 col-lg-9 mb-3" v-html="content"></div>
    <app-button
      type="button"
      class="btn btn-primary col-8 col-md-6 col-lg-4 mb-3"
      @click.native="$router.back()"
    >
      <i class="fa fa-backward"></i>返回前页
    </app-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      content: "",
    };
  },
  async mounted() {
    this.content = await this.$axiosGet("/license");
  },
};
</script>