<template>
  <div v-if="c.id" class="py-3 text-center">
    <div class="mb-3">
      <table class="table table-fixed table-bordered">
        <tbody>
          <tr>
            <th>班级</th>
            <td>{{c.class}}</td>
            <th>所属专业</th>
            <td>{{c.specialty}}</td>
          </tr>
          <tr>
            <th>男生人数</th>
            <td>{{c.male}}</td>
            <th>女生人数</th>
            <td>{{c.female}}</td>
          </tr>
          <tr>
            <th>指导教师</th>
            <td>{{c.teacher}}</td>
            <th>实习方式</th>
            <td>{{c.mode}}</td>
          </tr>
          <tr>
            <th>实习地点</th>
            <td>{{c.place}}</td>
            <th>实习单位</th>
            <td>{{c.employer}}</td>
          </tr>
          <tr>
            <th>起始时间</th>
            <td>{{c.startTime}}</td>
            <th>结束时间</th>
            <td>{{c.endTime}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div
    v-else
    class="d-flex justify-content-center align-items-center text-muted"
    style="height: 250px"
  >
    <h1>暂无实习信息！</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      c: {},
    };
  },
  async created() {
    let { cid } = this.$route.query;
    if (!cid) {
      cid = (await this.$axiosGet("/scsx/class-query")).cid;
    }
    if (cid > 0) {
      let result = await this.$axiosGet("/scsx/class-info", {
        cid,
        mode: 'detail',
      });
      if (result.status) {
        this.c = result.c;
      } else {
        this.$alertError(result.msg);
      }
    }
  },
};
</script>