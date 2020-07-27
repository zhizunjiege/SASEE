<template>
  <div class="app-container app-scroll row justify-content-center px-0 px-md-3 text-center">
    <form class="col-8 py-3" @submit.prevent="submit">
      <div class="mb-3">
        <strong>
          <i>改变教师工号与学生学号将直接改变课题所属关系，请慎重修改！</i>
        </strong>
      </div>
      <input-text
        v-model="project.teaNum"
        label="教师工号"
        placeholder="1~16位字母或数字"
        pattern="[a-zA-Z0-9]{1,16}"
        required
      ></input-text>
      <input-text
        v-model="project.stuNum"
        label="学生学号"
        placeholder="1~16位字母或数字"
        pattern="[a-zA-Z0-9]{1,16}"
      ></input-text>
      <input-text
        v-model="project.title"
        label="题目名称"
        placeholder="不超过255个字符（或汉字）"
        maxlength="255"
        required
      ></input-text>
      <input-select
        v-model="project.type"
        label="题目类型"
        :options="['科学研究','工程设计','实验','其他']"
        required
      ></input-select>
      <input-select
        v-model="project.source"
        label="题目来源"
        :options="['科学研究','工程实际','实验室建设','假拟','其他']"
        required
      ></input-select>
      <input-textarea
        v-model="project.introduction"
        label="题目简介"
        rows="8"
        placeholder="请填写题目简介,最大1023个字符（或汉字）"
        maxlength="1023"
        required
      ></input-textarea>
      <input-textarea
        v-model="project.requirement"
        label="学生要求"
        rows="8"
        placeholder="请填写对学生的要求,最大1023个字符（或汉字）"
        maxlength="1023"
        required
      ></input-textarea>
      <input-select
        v-model="project.difficulty"
        label="题目难度"
        :options="['很难','比较难','一般','比较容易','很容易']"
        required
      ></input-select>
      <input-select
        v-model="project.weight"
        label="题目分量"
        :options="['很重','比较重','一般','比较轻','很轻']"
        required
      ></input-select>
      <input-select
        v-for="(ab,index) in [{key:'allRound',value:'解决问题综合能力'},{key:'experiment',value:'实验能力'},{key:'graphic',value:'绘图能力'},{key:'data',value:'数据处理能力'},{key:'analysis',value:'计算结果分析能力'}]"
        v-model="project.ability[ab.key]"
        :label="ab.value"
        :options="['很高','比较高','一般','比较低','很低']"
        :key="index"
        required
      ></input-select>
      <input-file v-model="files" label="附件" :pre="project.materials"></input-file>
      <div class="form-row justify-content-end align-items-center mb-3">
        <app-button
          class="btn btn-primary col-12 col-md-4 mb-3 mb-md-0"
          type="submit"
          warn="您确定提交该课题吗？"
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
      project: {
        title: "",
        type: "科学研究",
        source: "科学研究",
        introduction: "",
        requirement: "",
        difficulty: "一般",
        weight: "一般",
        ability: {
          allRound: "一般",
          experiment: "一般",
          graphic: "一般",
          data: "一般",
          analysis: "一般",
        },
        materials: "",
        teaNum: "",
        stuNum: "",
      },
      files: [],
    };
  },
  methods: {
    async submit() {
      let data = new FormData();
      if (this.files.length > 0) {
        data.append("file", this.files[0]);
        this.project.materials = this.files[0].name;
      }
      data.append("info", JSON.stringify(this.project));
      data.append("opt", this.$route.query.pid ? "edit" : "new");
      let result = await this.$axiosFile("/bysj/submit", data);
      if (result.status) {
        this.$router.push({ path: "/bysj/ktgl" });
      }
      this.$alertResult(result);
    },
  },
  async created() {
    if (this.$route.query.pid) {
      this.project = (
        await this.$axiosGet("/bysj/info-project", {
          id: this.$route.query.pid,
        })
      ).project;
    }
  },
};
</script>