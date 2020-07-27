<template>
  <div class="p-3 app-container app-scroll">
    <div class="mb-3">
      <table class="table table-bordered table-fixed text-center">
        <tbody>
          <tr>
            <th scope="col" colspan="4">身份信息</th>
          </tr>
          <tr>
            <th>姓名</th>
            <td>{{user.name}}</td>
            <th>性别</th>
            <td>{{user.gender}}</td>
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
            <th scope="col" colspan="4">权限信息</th>
          </tr>
          <tr>
            <th>权限级别</th>
            <td>{{user.priv}}</td>
          </tr>
          <tr>
            <th scope="col" colspan="4">联系方式</th>
          </tr>
          <tr>
            <th>邮箱</th>
            <td>{{user.email}}</td>
            <th>电话</th>
            <td>{{user.tel}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        email: "无",
        tel: "无",
        priv: "无",
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
