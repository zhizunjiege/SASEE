<template>
  <div class="app-container app-scroll row justify-content-center px-0 px-md-3 text-center">
    <form class="col-8 py-3" @submit.prevent="submit">
      <input-select v-model="c.class" label="班级" :options="classes" required></input-select>
      <input-select
        v-model="c.specialty"
        label="专业"
        :options="['自动化','电气工程及其自动化','高等理工学院']"
        required
      ></input-select>
      <input-select v-model="c.teacher" label="指导教师" :options="teachers" required></input-select>
      <input-select v-model="c.mode" label="实习方式" :options="['校外集中','校内集中','个人自主','小组自主']" required></input-select>
      <input-text
        v-model="c.place"
        label="实习地点"
        placeholder="不超过255个字符（或汉字）"
        maxlength="255"
        required
      ></input-text>
      <input-text
        v-model="c.employer"
        label="实习单位"
        placeholder="不超过255个字符（或汉字）"
        maxlength="255"
        required
      ></input-text>
      <input-time v-model="c.startTime" type="date" label="起始时间" required></input-time>
      <input-time v-model="c.endTime" type="date" label="结束时间" required></input-time>

      <div class="form-row justify-content-end align-items-center mb-3">
        <app-button
          class="btn btn-primary col-12 col-md-4 mb-3 mb-md-0"
          type="submit"
          warn="您确定提交该小组信息吗？"
        >
          <i class="fa fa-paper-plane"></i>提交
        </app-button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      c: {},
      classes: [],
      teachers: [],
    };
  },
  methods: {
    async submit() {
      let result = await this.$axiosPost(
        `/scsx/class-${this.$route.query.cid ? "edit" : "add"}`,
        this.c
      );
      if (result.status) {
        this.$router.push({ path: "/scsx/xzgl" });
      }
      this.$alertResult(result);
    },
  },
  async created() {
    let rst = await this.$axiosGet("/scsx/get-class-teacher");
    if (rst.status) {
      this.classes = rst.classes;
      this.teachers = rst.teachers;
    }
    if (this.$route.query.cid) {
      this.c = (
        await this.$axiosGet("/scsx/class-info", {
          cid: this.$route.query.cid,
        })
      ).c;
    } else {
      this.c = {
        class: "",
        specialty: "自动化",
        teacher: "",
        mode: "校外集中",
        place: "",
        employer: "",
        startTime: "",
        endTime: "",
      };
    }
  },
};
</script>