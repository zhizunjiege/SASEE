<template>
  <div v-if="show" class="d-flex flex-column h-100">
    <nav class="nav nav-tabs nav-justified sticky-top bg-main">
      <a
        data-toggle="tab"
        class="nav-item nav-link active"
        href="#manual_editor"
        @click="identity='student'"
      >学生</a>
      <a
        data-toggle="tab"
        class="nav-item nav-link"
        href="#manual_editor"
        @click="identity='teacher'"
      >教师</a>
      <a
        data-toggle="tab"
        class="nav-item nav-link"
        href="#manual_editor"
        @click="identity='admin'"
      >管理员</a>
    </nav>
    <div class="tab-content p-3 app-container app-scroll">
      <div class="tab-pane fade show active" id="manual_editor">
        <wang-editor
          v-model="content[identity]"
          eid="admin_manual_editor"
          server="/system/editor-img"
          :full="true"
          :height="480"
        ></wang-editor>
        <div class="form-row justify-content-end mb-3">
          <app-button
            @click.native="submit"
            class="btn btn-primary col-12 col-md-4"
            type="button"
            warn="您确定要发布该手册吗？"
          >
            <i class="fa fa-paper-plane"></i>发布
          </app-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      identity: "student",
      content: {
        student: "",
        teacher: "",
        admin: "",
      },
    };
  },
  methods: {
    async submit() {
      let d = new FormData();
      for (const k of Object.keys(this.content)) {
        d.append(k, this.content[k]);
      }
      this.$alertResult(await this.$axiosFile("/system/write-manual", d));
    },
  },
  async created() {
    for (const k of Object.keys(this.content)) {
      this.content[k] = await this.$axiosGet(`/system/manual?identity=${k}`);
    }
    this.show = true;
  },
};
</script>