<template>
  <div class="app-alert" v-show="alert.show_" :class="alertColor">
    <h4 class="alert-heading p-3 mb-0">{{alertTitle}}</h4>
    <p class="px-3" style="text-indent:2rem">{{alert.msg}}</p>
    <p v-if="Boolean(alert.count)" class="px-3 py-2 mb-0 border-top border-info">
      消息框将在
      <strong class="px-1">{{alert.count}}</strong>秒后自动消失,点击
      <a href="#" @click.prevent="alertHide" class="alert-link">此处</a>可立即关闭。
    </p>
    <div v-else class="border-top border-info btn-group w-100">
      <button
        @click="alertCancel"
        class="btn btn-outline-secondary w-50 border-0"
        style="border-radius:0 0 0 .5rem"
      >关闭</button>
      <div class="border-left border-info"></div>
      <button
        @click="alertOk"
        class="btn btn-outline-primary w-50 border-0"
        style="border-radius:0 0 .5rem 0"
      >确定</button>
    </div>
  </div>
</template>

<script>
import { counter } from "./util";

export default {
  data() {
    return {
      alert: {
        show_: false,
        type: "success",
        msg: "",
        count: 0,
        ok: null,
        cancel: null,

        count_: null,
      },
    };
  },
  computed: {
    alertColor() {
      return this.$options.alertColor[this.alert.type];
    },
    alertTitle() {
      return this.$options.alertTitle[this.alert.type];
    },
  },
  methods: {
    alertHide() {
      this.alert.show_ = false;
      this.alert.count_ && clearTimeout(this.alert.count_.id);
      this.alert.count = 0;
    },
    alertShow({
      type = "success",
      msg = "",
      count = 0,
      ok = null,
      cancel = null,
    } = {}) {
      this.alert.show_ = true;
      this.alert.type = type;
      this.alert.msg = msg;
      this.alert.ok = ok;
      this.alert.cancel = cancel;
      if (count) {
        this.alert.count_ = counter({
          count,
          doing: (c) => (this.alert.count = c),
          done: () => this.alertHide(),
        });
      } else {
        this.alert.count = 0;
      }
    },
    alertOk() {
      this.alertHide();
      this.alert.ok && this.alert.ok();
    },
    alertCancel() {
      this.alertHide();
      this.alert.cancel && this.alert.cancel();
    },
  },
  alertColor: {
    success: "alert-primary",
    error: "alert-danger",
    warn: "alert-warning",
  },
  alertTitle: {
    success: "成功",
    error: "错误",
    warn: "警告",
  },
};
</script>