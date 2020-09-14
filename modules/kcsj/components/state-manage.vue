<template>
  <div class="row h-100 align-items-center justify-content-center p-3">
    <h4 class="col-12 text-center">自动模式</h4>
    <form class="col-12 col-md-8 col-lg-6 text-center" @submit.prevent="submit">
      <input-time v-model="time.open" label="开放选择" required></input-time>
      <input-time v-model="time.close" label="禁止选择" required></input-time>

      <div class="row justify-content-end">
        <app-button
          class="btn btn-primary col-12 col-md-4 mb-3 mb-md-0"
          type="submit"
          warn="你确定提交吗？"
        >
          <i class="fa fa-paper-plane"></i>提交
        </app-button>
      </div>
    </form>
    <h4 class="col-12 text-center">手动模式（现在状态：{{time.CHOOSEUSABLE?'允许选择':'禁止选择'}}）</h4>
    <div class="d-flex col-12 justify-content-around py-3">
      <app-button
        @click.native="operation('open')"
        class="btn btn-success col-12 col-md-3 mb-3 mb-md-0"
        type="button"
      >
        <i class="fa fa-check"></i>允许选择
      </app-button>
      <app-button
        @click.native="operation('close')"
        class="btn btn-warning col-12 col-md-3 mb-3 mb-md-0"
        type="button"
      >
        <i class="fa fa-times"></i>禁止选择
      </app-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: {
        open: "",
        close: "",
        CHOOSEUSABLE: false,
      },
    };
  },
  methods: {
    async submit() {
      if (this.time.close > this.time.open) {
        this.$alertResult(
          await this.$axiosPost("/kcsj/date", {
            open: this.time.open,
            close: this.time.close,
          })
        );
      } else {
        this.$alertWarn("禁止时间应晚于允许时间，请重新设置！");
      }
    },
    async operation(mode = "open") {
      let rst = await this.$axiosPost("/kcsj/operation", { mode });
      if (rst.status) {
        this.time.CHOOSEUSABLE = mode == "open";
      }
      this.$alertResult(rst);
    },
  },
  async created() {
    let rst = await this.$axiosGet("/kcsj/state-info");
    if (rst.status) {
      this.time = rst.time;
    }
  },
};
</script>
