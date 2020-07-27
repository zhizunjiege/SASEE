<template>
  <div class="app-container app-scroll px-0 px-md-3 text-center">
    <info-project :pid="pid" class="mb-3"></info-project>
    <info-teacher :tid="tid" class="mb-3"></info-teacher>
    <info-student :sid="sid" class="mb-3"></info-student>
    <div class="row align-items-center justify-content-center my-4">
      <form class="w-100 row justify-content-center text-left" @submit.prevent="submit">
        <div class="col-6">
          <template
            v-for="(f,index) in [{
                        name: 'ifClear',
                        des: '1、本题目的要求、任务、内容是否明确具体'
                    }, {
                        name: 'ifDifficultyProper',
                        des: '2、工作量是否饱满，题目难度是否适中'
                    }, {
                        name: 'ifMeetGoal',
                        des: '3、本题目能否满足综合训练学生的基本教学要求'
                    }, {
                        name: 'ifConditionWell',
                        des: '4、做本题目的条件是否满足'
                    }, {
                        name: 'ifPass',
                        des: '5、审查是否通过'
                    }]"
          >
            <label :key="index" class="required">{{f.des}}</label>
            <input-radio
              :key="index"
              v-model="check[f.name]"
              :radios="[{val:true,des:'是/YES'},{val:false,des:'否/NO'}]"
              class="row justify-content-around"
            ></input-radio>
          </template>
        </div>
        <div class="col-6">
          <label>&ensp;6、其他意见</label>
          <input-textarea
            v-model="check.extra"
            rows="8"
            placeholder="选填，最大1023个字符（或汉字）"
            maxlength="1023"
          ></input-textarea>
          <div class="form-row justify-content-center align-items-end">
            <app-button class="btn btn-primary col-12 col-md-6" type="submit">
              <i class="fa fa-check"></i>提交审核结果
            </app-button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pid: 0,
      tid: 0,
      sid: 0,
      check: {
        ifClear: true,
        ifDifficultyProper: true,
        ifMeetGoal: true,
        ifConditionWell: true,
        ifPass: true,
        extra: "",
      },
    };
  },
  components: {
    "info-project": () => import(`./info-project`),
    "info-teacher": () => import(`./info-teacher`),
    "info-student": () => import(`./info-student`),
  },
  methods: {
    async submit() {
      let rst = await this.$axiosPost("/bysj/check", {
        pid: this.pid,
        check: this.check,
      });
      this.$alertResult(rst);
      if (rst.status) {
        this.$router.push({ path: "/bysj/ktsh" });
      }
    },
  },
  async created() {
    let query = this.$route.query;
    this.pid = query.pid;
    this.tid = query.tid;
    this.sid = query.sid;
  },
};
</script>