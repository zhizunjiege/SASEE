<template>
  <div class="app-container row align-items-center justify-content-center">
    <form class="col-12 col-sm-9 col-md-8 col-lg-6 col-xl-5 text-center" @submit.prevent="submit">
      <input-text
        v-model="fields.oldPW"
        type="password"
        label="旧密码"
        placeholder="1~16位字母、数字或下划线"
        pattern="\w{1,16}"
        required
      ></input-text>
      <input-text
        v-model="fields.newPW"
        type="password"
        label="新密码"
        placeholder="1~16位字母、数字或下划线"
        pattern="\w{1,16}"
        required
      ></input-text>
      <input-text
        v-model="fields.repeatPW"
        type="password"
        label="重复密码"
        placeholder="1~16位字母、数字或下划线"
        pattern="\w{1,16}"
        required
      ></input-text>
      <div class="form-row justify-content-end align-items-center mb-3">
        <app-button class="btn btn-primary col-12 col-md-5 mb-3 mb-md-0" type="submit">
          <i class="fa fa-paper-plane"></i>修改
        </app-button>
      </div>
    </form>
  </div>
</template>

<script>
import objectHash from "object-hash";

export default {
  data() {
    return {
      fields: {
        oldPW: "",
        newPW: "",
        repeatPW: "",
      },
    };
  },
  methods: {
    async submit() {
      let fields = this.fields;
      if (fields.newPW !== fields.repeatPW) {
        this.$alertWarn("密码不一致！");
        return;
      }
      let result = await this.$axiosPost("/user/set-password", {
        oldPW: objectHash.MD5(fields.oldPW),
        newPW: objectHash.MD5(fields.newPW),
      });
      if (result.status) {
        this.$root.$emit("logout", "/login");
      }
      this.$alertResult(result);
    },
  },
};
</script>