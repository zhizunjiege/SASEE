<template>
  <div class="d-flex w-100 h-75 align-items-center justify-content-center">
    <div class="px-5 pt-5 pb-4 rounded-lg" style="background-color: #63877d87;color:white;">
      <form class="form-sm text-center" @submit.prevent="submit">
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
        <input-radio
          v-model="fields.identity"
          :radios="radios"
          class="form-group form-row justify-content-around"
        ></input-radio>
        <div class="form-row justify-content-around align-items-center mb-3">
          <input-checkbox
            v-model="fields.save"
            :checkboxs="[{ val: 'save', des: '记住密码' }]"
            class="col-6 col-md-6 mb-3 mb-md-0"
          ></input-checkbox>
          <app-button class="btn btn-primary col-6 col-md-6 mb-3 mb-md-0" type="submit">
            <i class="fa fa-paper-plane"></i>登陆
          </app-button>
        </div>
      </form>
      <div class="text-right px-3">
        <router-link to="/retrieve" style="color:black;">找回密码</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import objectHash from "object-hash";

export default {
  data() {
    return {
      radios: [
        { val: "student", des: "学生" },
        { val: "teacher", des: "教师" },
      ],
      fields: {
        username: localStorage.getItem("username") || "",
        password: localStorage.getItem("password") || "",
        identity: localStorage.getItem("identity") || "student",
        save: localStorage.getItem("save") == "user",
      },
    };
  },
  methods: {
    async submit() {
      let data = this.fields,
        result = await this.$axiosPost("/login", {
          username: data.username,
          password: objectHash.MD5(data.password),
          identity: data.identity,
        });
      if (result.status) {
        localStorage.setItem("username", data.username);
        localStorage.setItem("identity", data.identity);
        if (data.save) {
          localStorage.setItem("password", data.password);
          localStorage.setItem("save", "user");
        } else {
          localStorage.removeItem("password", data.password);
          localStorage.setItem("save", "auto");
        }
        this.$parent.$emit("login", result);
      } else {
        this.$alertError(result.msg);
      }
    },
  },
  created() {
    if (
      this.$route.query.admin ||
      localStorage.getItem("identity") == "admin"
    ) {
      this.radios.push({ val: "admin", des: "管理员" });
      this.fields.identity = "admin";
    }
  },
};
</script>