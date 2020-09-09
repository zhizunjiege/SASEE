<template>
  <div class="form-group form-row">
    <label
      v-if="label"
      class="col-3 col-form-label"
      :class="{'required':'required' in $attrs}"
    >{{label}}</label>
    <div class="input-group px-0" :class="{'col-9':label}">
      <input
        v-bind="$attrs"
        :value="value"
        @input="$emit('input',$event.target.value)"
        class="form-control px-1"
        type="text"
        placeholder="6位验证码，5分钟内有效"
        pattern="\d{6}"
      />
      <div class="input-group-append">
        <button
          @click="send"
          type="button"
          class="btn btn-outline-primary"
          :disabled="sent"
        >{{sent?''+count+'s':'发送验证码'}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { counter } from "../util";

export default {
  inheritAttrs: false,
  props: {
    value: String,
    label: {
      type: String,
      default: "",
    },
    extra: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      sent: false,
      count: 60,
    };
  },
  methods: {
    async send() {
      let emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      let msg = "";
      this.count = 60;
      if ("username" in this.extra && !this.extra.username) {
        msg = "请输入用户名！";
      } else if ("identity" in this.extra && !this.extra.identity) {
        msg = "请选择身份！";
      } else if ("email" in this.extra && !emailReg.test(this.extra.email)) {
        msg = "请输入正确的邮箱地址！";
      }
      if (msg) {
        this.$alertWarn(msg);
      } else {
        let result = await this.$axiosGet("/sendPinCode", this.extra);
        if (result.status) {
          this.sent = true;
          counter({
            count: 60,
            doing: (c) => {
              this.count = c;
            },
            done: () => {
              this.sent = false;
            },
          });
        } else {
          this.sent = false;
        }
        this.$alertResult(result);
      }
    },
  },
};
</script>