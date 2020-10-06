<template>
  <div class="app-container row align-items-center justify-content-center">
    <form
      class="col-12 col-sm-9 col-md-8 col-lg-6 col-xl-5 text-center"
      @submit.prevent="submit"
    >
      <input-radio
        v-model="fields.identity"
        class="form-group form-row justify-content-around"
        :radios="[
          { val: 'student', des: '学生' },
          { val: 'teacher', des: '教师' },
        ]"
      ></input-radio>
      <input-text
        v-model="fields.schoolNum"
        :label="fields.identity == 'student' ? '学号' : '职工号'"
        placeholder="1~16位字母、数字或下划线"
        pattern="\w{1,16}"
        required
      ></input-text>
      <input-pincode
        v-model="fields.pinCode"
        label="验证码"
        :extra="{ schoolNum: fields.schoolNum, identity: fields.identity }"
        required
      ></input-pincode>
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
        <app-button
          class="btn btn-primary col-12 col-md-5 mb-3 mb-md-0"
          type="submit"
        >
          <i class="fa fa-paper-plane"></i>提交
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
        schoolNum: "",
        pinCode: "",
        identity: "student",
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
      let result = await this.$axiosPost("/retrieve", {
        schoolNum: fields.schoolNum,
        pinCode: fields.pinCode,
        identity: fields.identity,
        newPW: objectHash.MD5(fields.newPW),
      });
      if (result.status) {
        this.$router.push({ path: "/login" });
      }
      this.$alertResult(result);
    },
  },
};
</script>