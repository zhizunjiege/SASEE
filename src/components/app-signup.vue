<template>
  <div class="app-container app-scroll row align-items-center justify-content-center">
    <form
      class="col-12 col-sm-9 col-md-8 col-lg-6 col-xl-5 text-center mt-3"
      @submit.prevent="submit"
    >
      <input-radio
        v-model="fields.identity"
        class="form-group form-row justify-content-around"
        :radios="[{ val: 'student', des: '学生' }, { val: 'teacher', des: '教师' }]"
      ></input-radio>
      <input-text
        v-model="fields.name"
        label="姓名"
        placeholder="1~16个汉字、字母或空格"
        pattern="[\u4E00-\u9FA5a-zA-Z\s]{1,16}"
        required
      ></input-text>
      <input-text
        v-model="fields.schoolNum"
        :label="fields.identity=='student'?'学号':'职工号'"
        placeholder="1~16位字母或数字"
        pattern="[a-zA-Z0-9]{1,16}"
        required
      ></input-text>
      <input-text
        v-model="fields.username"
        label="用户名"
        placeholder="1~16位字母、数字或下划线"
        pattern="\w{1,16}"
        required
      ></input-text>
      <input-text
        v-model="fields.password"
        type="password"
        label="密码"
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
      <input-text v-model="fields.email" type="email" label="邮箱" placeholder="请输入正确的邮箱地址" required></input-text>
      <input-pincode v-model="fields.pinCode" label="验证码" :extra="{email:fields.email}" required></input-pincode>
      <input-text
        v-model="fields.wechat"
        label="微信"
        placeholder="1~255位字母或数字"
        pattern="[a-zA-Z0-9]{1,255}"
      ></input-text>
      <input-text
        v-model="fields.tel"
        label="手机号"
        placeholder="11位数字"
        pattern="^[1]([3-9])[0-9]{9}$"
      ></input-text>
      <input-text v-model="fields.homepage" label="个人主页" placeholder="请输入正确的网址，不超过255位字符"></input-text>
      <template v-if="fields.identity=='teacher'">
        <input-text v-model="fields.office" label="办公地点" placeholder="不超过255个字符（或汉字）"></input-text>
        <input-text v-model="fields.field" label="研究领域" placeholder="不超过255个字符（或汉字）"></input-text>
      </template>
      <input-textarea
        v-model="fields.resume"
        label="个人简介"
        rows="12"
        placeholder="不超过1023个字符（或汉字）"
        maxlength="1023"
      ></input-textarea>
      <div class="form-row justify-content-between align-items-center mb-3">
        <input-checkbox
          v-model="fields.license"
          :checkboxs="checkboxs"
          class="col-12 col-md-7 mb-3 mb-md-0"
        ></input-checkbox>
        <app-button
          class="btn btn-primary col-12 col-md-5 mb-3 mb-md-0"
          :disabled="!fields.license"
          type="submit"
        >
          <i class="fa fa-paper-plane"></i>注册
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
      checkboxs: [
        {
          val: "license",
          des: '我已阅读并同意<a href="#/license">用户协议</a>',
        },
      ],
      fields: {
        identity: "student",
        name: "",
        schoolNum: "",
        username: "",
        password: "",
        repeatPW: "",
        email: "",
        pinCode: "",
        wechat: "",
        tel: "",
        homepage: "",
        resume: "",
        office: "",
        field: "",
        license: false,
      },
    };
  },
  methods: {
    async submit() {
      let fields = this.fields;
      if (fields.password !== fields.repeatPW) {
        this.$alertWarn("密码不一致！");
        return;
      }
      let data = Object.assign({}, fields);
      data.password = objectHash.MD5(fields.password);

      let result = await this.$axiosPost("/signup ", data);
      if (result.status) {
        this.$router.push({ path: "/login" });
      }
      this.$alertResult(result);
    },
  },
};
</script>