<template>
  <div class="app-container app-scroll px-0 px-md-3 text-center">
    <info-project :pid="id" class="mb-3"></info-project>
    <info-teacher :tid="teacher" class="mb-3"></info-teacher>
    <div v-if="chooseUsable=='yes'" class="row align-items-center justify-content-center mb-3">
      <form class="col-12 col-sm-9 col-md-8 col-lg-6 col-xl-5 text-center" @submit.prevent="submit">
        <input-radio
          v-model="target"
          :radios="[{val:'1',des:'平行志愿一'},{val:'2',des:'平行志愿二'},{val:'3',des:'平行志愿三'}]"
          class="mb-3"
        ></input-radio>
        <div class="form-row justify-content-center align-items-center">
          <app-button class="btn btn-primary col-12" type="submit" warn="您确定选择此课题吗？">
            <i class="fa fa-check"></i>选择此课题
          </app-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      teacher: "",
      chooseUsable: "yes",
      target: "1",
    };
  },
  components: {
    "info-project": () => import(`./info-project`),
    "info-teacher": () => import(`./info-teacher`),
  },
  methods: {
    async submit() {
      this.$alertResult(
        await this.$axiosPost("/bysj/choose", {
          id: this.id,
          target: this.target,
        })
      );
    },
  },
  created() {
    let query = this.$route.query;
    this.id = query.id;
    this.teacher = query.teacher;
    this.chooseUsable = query.chooseUsable;
  },
};
</script>