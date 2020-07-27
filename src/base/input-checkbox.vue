<template>
  <div>
    <div
      v-for="(checkbox,index) of checkboxs"
      :key="index"
      class="custom-control custom-checkbox custom-control-inline"
    >
      <input
        v-bind="$attrs"
        v-model="in_checked"
        :value="checkbox.val"
        type="checkbox"
        :id="eid+'-checkbox-'+index"
        class="custom-control-input"
      />
      <label :for="eid+'-checkbox-'+index" class="custom-control-label" v-html="checkbox.des"></label>
    </div>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  model: {
    prop: "checked",
    event: "change",
  },
  props: {
    checkboxs: Array,
    checked: [Array, Boolean],
  },
  data() {
    return {
      in_checked:
        this.checkboxs.length > 1 ? this.checked.slice() : this.checked,
      eid: new Date().toISOString(),
    };
  },
  watch: {
    checked() {
      this.in_checked =
        this.checkboxs.length > 1 ? this.checked.slice() : this.checked;
    },
    in_checked() {
      this.$emit("change", this.in_checked);
    },
  },
};
</script>