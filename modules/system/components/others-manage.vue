<template>
  <div
    class="d-flex flex-column justify-content-around align-items-center app-container position-relative py-3"
  >
    <div
      v-show="waiting"
      class="backdrop row justify-content-center align-items-center h-100 w-100"
    >
      <div class="spinner-border spinner-border-lg text-primary"></div>
    </div>
    <div class="row w-100 justify-content-around">
      <app-button
        @click.native="backup"
        class="btn btn-primary col-12 col-md-4"
        type="button"
        warn="您确定要备份数据库吗？"
      >
        <i class="fa fa-angle-double-left"></i>备份数据库
      </app-button>
      <app-button
        @click.native="recovery"
        class="btn btn-secondary col-12 col-md-4"
        type="button"
        warn="您确定要恢复数据库吗？"
      >
        恢复数据库
        <i class="fa fa-angle-double-right"></i>
      </app-button>
    </div>
    <div class="row w-100 justify-content-center">
      <app-button
        @click.native="reset"
        class="btn btn-primary col-12 col-md-4"
        type="button"
        warn="您确定要重置系统吗？"
      >
        <i class="fa fa-power-off"></i>重置系统
      </app-button>
    </div>
    <div class="row w-100">
      <input-checkbox
        v-model="checked"
        :checkboxs="modules"
        class="d-flex w-100 justify-content-around align-items-center mb-5"
      ></input-checkbox>
      <div class="row w-100 justify-content-around">
        <app-button
          @click.native="modulesOpt(true)"
          class="btn btn-primary col-12 col-md-4"
          type="button"
          warn="您确定要开放这些模块吗？"
        >
          <i class="fa fa-check"></i>开放模块
        </app-button>
        <app-button
          @click.native="modulesOpt(false)"
          class="btn btn-secondary col-12 col-md-4"
          type="button"
          warn="您确定要关闭这些模块吗？"
        >
          <i class="fa fa-times"></i>关闭模块
        </app-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modules: [],
      checked: [],
      waiting: false,
    };
  },
  methods: {
    async backup() {
      this.$alertResult(await this.$axiosGet("/system/data-backup"));
    },
    async recovery() {
      this.$alertResult(await this.$axiosGet("/system/data-recovery"));
    },
    async reset() {
      this.waiting = true;
      this.$alertResult(await this.$axiosGet("/reset-system"));
      this.waiting = false;
    },
    async modulesOpt(mode = true) {
      if (this.checked.length) {
        this.$alertResult(
          await this.$axiosPost("/modules-opt", {
            mode,
            modules: this.checked,
          })
        );
      } else {
        this.$alertWarn("请选择模块！");
      }
    },
  },
  async created() {
    this.modules = (await this.$axiosGet("/modules-list")).modules;
  },
};
</script>

<style scoped>
.backdrop {
  background-color: #cdfbffcf;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20000;
}
</style>