<template>
  <div v-if="group.id" class="py-3 text-center">
    <header class="mb-3 border-bottom border-secondary">
      <h3 class="mb-0">{{`${group.group}-第${group.num}组`}}</h3>
    </header>
    <div class="mb-3">
      <table class="table table-fixed table-bordered">
        <tbody>
          <tr>
            <th>所属方向</th>
            <td>{{group.group}}</td>
            <th>课程容量</th>
            <td>{{group.capacity}}</td>
          </tr>
          <tr>
            <th>上课时间</th>
            <td>{{group.time}}</td>
            <th>上课地点</th>
            <td>{{group.place}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row mb-3">
      <div class="col">
        <h5 class="text-primary">分组简介</h5>
        <pre class="p-3 border rounded text-left">{{group.description}}</pre>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col">
        <h5 class="text-primary">教师名单</h5>
        <pre class="p-3 border rounded text-left">{{group.teachers}}</pre>
      </div>
      <div class="col">
        <h5 class="text-primary">学生名单</h5>
        <pre class="p-3 border rounded text-left">{{group.students||'暂无'}}</pre>
      </div>
    </div>
  </div>
  <div
    v-else
    class="d-flex justify-content-center align-items-center text-muted"
    style="height: 250px"
  >
    <h1>暂无分组信息！</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      group: {},
    };
  },
  async created() {
    let { gid } = this.$route.query;
    if (!gid) {
      gid = (await this.$axiosGet("/kcsj/group-query")).gid;
    }
    if (gid) {
      let result = await this.$axiosGet("/kcsj/group-info", {
        gid,
        name: true,
      });
      if (result.status) {
        this.group = result.group;
        this.group.group = result.group.group.substr(2);
      } else {
        this.$alertError(result.msg);
      }
    }
  },
};
</script>