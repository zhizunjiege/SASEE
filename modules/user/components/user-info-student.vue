<template>
  <div class="p-3 app-container app-scroll">
    <div class="mb-3">
      <table class="table table-bordered table-fixed text-center">
        <tbody>
          <tr>
            <th scope="col" colspan="4">学籍信息</th>
          </tr>
          <tr>
            <th>姓名</th>
            <td>{{user.name}}</td>
            <th>性别</th>
            <td>{{user.gender}}</td>
          </tr>
          <tr>
            <th>学号</th>
            <td>{{user.schoolNum}}</td>
            <th>小班</th>
            <td>{{user.class}}</td>
          </tr>
          <tr>
            <th>专业</th>
            <td>{{user.specialty}}</td>
            <th>方向</th>
            <td>{{user.group}}</td>
          </tr>
          <tr>
            <th>是否保研</th>
            <td>{{user.postGraduate}}</td>
          </tr>
          <tr>
            <th scope="col" colspan="4">账户信息</th>
          </tr>
          <tr>
            <th>用户名</th>
            <td>{{user.username}}</td>
            <th>密码</th>
            <td>********</td>
          </tr>
          <tr>
            <th scope="col" colspan="4">联系方式</th>
          </tr>
          <tr>
            <th>邮箱</th>
            <td>{{user.email}}</td>
            <th>微信</th>
            <td>{{user.wechat}}</td>
          </tr>
          <tr>
            <th>电话</th>
            <td>{{user.tel}}</td>
            <th>个人主页</th>
            <td>
              <a v-if="user.homepage" :href="user.homepage" target="_blank">{{user.homepage}}</a>
              <span v-else>无</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="mb-3">
        <h5 class="text-center">个人简介</h5>
        <pre class="p-3 border rounded">{{user.resume}}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        email: "无",
        wechat: "无",
        tel: "无",
        resume: "无",
      },
    };
  },
  async mounted() {
    let result = await this.$axiosGet("/user/info");
    if (result.status) {
      Object.assign(this.user, result.user);
    } else {
      this.$alertError(result.msg);
    }
  },
};
</script>