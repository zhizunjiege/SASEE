<template>
  <div class="app-container app-scroll text-center">
    <div v-if="students.length" class="row p-3">
      <nav class="col-12 col-md-3 list-group nav nav-pills flex-column">
        <a
          v-for="(s,index) in students"
          :key="index"
          :href="'#student-'+index"
          :class="{'active':!index}"
          class="list-group-item list-group-item-action nav-link"
          data-toggle="pill"
          style="position:sticky;top:1rem;height:54px;"
        >
          <span class="d-inline-block w-50 ellipsis">{{'学生'+(index+1)}}</span>
        </a>
      </nav>
      <div class="col-12 col-md-9 tab-content border rounded p-3">
        <div
          v-for="(s,index) in students"
          :key="index"
          :id="'student-'+index"
          :class="{'show active':!index}"
          class="tab-pane fade"
        >
          <info-student :sid="s"></info-student>
          <div class="row align-items-center justify-content-around">
            <app-button
              @click.native="submit(s)"
              class="btn btn-secondary col-12 col-md-3 mb-3 mb-md-0"
              type="button"
              warn="您确定选择该学生吗？"
            >
              <i class="fa fa-check"></i>选择该学生
            </app-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="d-flex justify-content-center" style="height: 150px">
      <h1 class="text-muted align-self-center">无需选择学生</h1>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      students: [],
    };
  },
  methods: {
    async submit(sid) {
      let rst = await this.$axiosGet("/bysj/confirm", {
        pid: this.$route.query.pid,
        sid,
      });
      this.$alertResult(rst);
      if (rst.status) {
        this.$router.push({ path: "/bysj/ktgl" });
      }
    },
  },
  components: {
    "info-student": () => import(`./info-student`),
  },
  async created() {
    let { pid } = this.$route.query;
    let result = await this.$axiosGet("/bysj/project-confirm", { pid });
    if (result.status) {
      this.students = result.students;
    } else {
      this.$alertError(result.msg);
    }
  },
};
</script>