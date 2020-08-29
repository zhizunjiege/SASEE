<template>
  <div v-if="Number(t.id)>0" class="app-container app-scroll text-center px-3">
    <header class="sticky-top bg-main border-bottom border-secondary mb-3">
      <h3 class="pt-3 mb-0">{{t.title}}</h3>
    </header>
    <div class="mb-3">
      <h5 class="text-primary">任务信息</h5>
      <table class="table table-fixed table-bordered">
        <tbody>
          <tr>
            <th>任务类型</th>
            <td>{{t.mode}}</td>
            <th>截止时间</th>
            <td>{{t.deadline}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mb-3">
      <h5 class="text-primary">任务简介</h5>
      <pre class="p-3 border rounded text-left">{{t.description}}</pre>
    </div>
    <div class="mb-3">
      <h5 class="text-primary">未提交学生名单({{unsubmitted.length}}人)</h5>
      <pre class="p-3 border rounded text-left">{{unsubmitted.join(',')}}</pre>
    </div>
    <div class="mb-4">
      <h5 class="text-primary">已提交学生名单({{submitted.length}}人)</h5>
      <table class="table table-fixed table-bordered">
        <thead class="thead-light">
          <tr>
            <th>学生姓名</th>
            <th>学生学号</th>
            <th>报告文件</th>
            <th>提交时间</th>
            <th>分数/等第</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="submitted.length>0">
            <tr v-for="s in submitted" :key="s.id">
              <td>{{s.name}}</td>
              <td>{{s.schoolNum}}</td>
              <td>
                <a
                  :href="`/scsx/download-report?task_id=${t.id}&report_id=${s.id}&filename=${s.filename}`"
                  download
                >{{s.filename}}</a>
              </td>
              <td>{{s.time}}</td>
              <td class="editable">
                <input-select
                  v-model="s.score"
                  :options="['优秀','良好','中等','及格','不及格']"
                  class="mb-0"
                  required
                ></input-select>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td>暂无</td>
            <td>暂无</td>
            <td>暂无</td>
            <td>暂无</td>
            <td>暂无</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mb-5 row justify-content-end">
      <app-button
        @click.native="submit"
        :disabled="submitted.length<=0"
        class="btn btn-primary col-3"
        warn="您确定提交评分吗？"
      >
        <i class="fa fa-paper-plane"></i>提交评分
      </app-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      t: {},
      submitted: [],
      unsubmitted: [],
    };
  },
  methods: {
    async submit() {
      let data = this.submitted
        .filter((i) => Boolean(i.score))
        .map((i) => ({
          id: i.id,
          score: i.score,
        }));
      this.$alertResult(
        await this.$axiosPost("/scsx/task-score", { scores: data })
      );
    },
  },
  async created() {
    let { tid } = this.$route.query;
    if (tid) {
      let rst = await this.$axiosGet("/scsx/task-detail", { tid });
      this.submitted = rst.submitted;
      this.unsubmitted = rst.unsubmitted;
      this.t = (await this.$axiosGet("/scsx/task-info", { tid })).t;
    }
  },
};
</script>

<style>
.editable {
  outline: 0;
  padding: 0 !important;
  background-color: #6bd9fe;
  vertical-align: middle !important;
  text-align: center;
  text-align-last: center;
}
.editable select {
  border: 0 !important;
}
</style>