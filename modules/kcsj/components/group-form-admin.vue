<template>
  <div class="app-container app-scroll row justify-content-center px-0 px-md-3 text-center">
    <form class="col-8 py-3" @submit.prevent="submit">
      <input-select v-model="group.group" label="所属分组" :options="groups" required></input-select>
      <input-text
        v-model="group.num"
        label="分组序号"
        type="number"
        min="1"
        placeholder="大于0的序号"
        required
      ></input-text>
      <input-text
        v-model="group.capacity"
        label="分组容量"
        type="number"
        min="1"
        placeholder="大于0的容量"
        required
      ></input-text>
      <input-text
        v-model="group.time"
        label="上课时间"
        placeholder="不超过255个字符（或汉字）"
        maxlength="255"
        required
      ></input-text>
      <input-text
        v-model="group.place"
        label="上课地点"
        placeholder="不超过255个字符（或汉字）"
        maxlength="255"
        required
      ></input-text>
      <input-textarea
        v-model="group.description"
        label="分组简介"
        rows="8"
        placeholder="请填写分组简介,最大1023个字符（或汉字）"
        maxlength="1023"
        required
      ></input-textarea>

      <div v-if="teachers.length" class="row mb-5">
        <label class="col-3 col-form-label required">选择教师</label>
        <input-checkbox v-model="group.teachers" :checkboxs="teachers" class="col-9"></input-checkbox>
      </div>

      <div v-if="students.length" class="row mb-5">
        <label class="col-3 col-form-label required">选择学生</label>
        <input-checkbox v-model="group.students" :checkboxs="students" class="col-9"></input-checkbox>
      </div>

      <div class="form-row justify-content-end align-items-center mb-3">
        <app-button
          class="btn btn-primary col-12 col-md-4 mb-3 mb-md-0"
          type="submit"
          warn="您确定提交该分组吗？"
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
      group: {},
      teachers: [],
      students: [],
      groups: [
        "1-自动控制与模式识别",
        "2-自主导航与精确制导",
        "3-检测与自动化工程",
        "4-飞行器控制与仿真",
        "5-机电控制与液压",
        "6-电气",
      ],
      notFirst: false,
    };
  },
  methods: {
    async submit() {
      if (this.group.teachers.length) {
        let result = await this.$axiosPost(
          `/kcsj/group-${this.$route.query.gid ? "edit" : "add"}`,
          this.group
        );
        if (result.status) {
          this.$router.push({ path: "/kcsj/glfz" });
        }
        this.$alertResult(result);
      } else {
        this.$alertWarn("请选择教师！");
      }
    },
  },
  watch: {
    "group.group": async function (n, o) {
      let rst = null;
      this.teachers = [];
      this.students = [];
      for (const i of ["teacher", "student"]) {
        rst = await this.$axiosGet("/kcsj/users", {
          identity: i,
          group: n,
        });
        if (rst.status) {
          for (const j of rst.users) {
            this[`${i}s`].push({
              val: j.id,
              des: j.name,
            });
          }
        }
      }
      if (this.notFirst) {
        this.group.teachers = [];
        this.group.students = [];
      }
      this.notFirst = true;
    },
  },
  async created() {
    if (this.$route.query.gid) {
      this.group = (
        await this.$axiosGet("/kcsj/group-info", {
          gid: this.$route.query.gid,
        })
      ).group;
    } else {
      this.group = {
        group: "",
        num: 0,
        capacity: 1,
        time: "",
        place: "",
        description: "",
        teachers: [],
        students: [],
      };
    }
  },
};
</script>