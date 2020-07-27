<template>
  <div>
    <div
      v-for="(radio,index) of radios"
      :key="index"
      class="custom-control custom-radio custom-control-inline"
    >
      <input
        v-bind="$attrs"
        v-model="in_checked"
        :value="radio.val"
        type="radio"
        :id="eid+'-radio-'+index"
        class="custom-control-input"
        required
      />
      <label :for="eid+'-radio-'+index" class="custom-control-label" v-html="radio.des"></label>
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
    radios: Array,
    checked: [String, Boolean],
  },
  data() {
    return { in_checked: this.checked, eid: new Date().toISOString() };
  },
  watch: {
    checked() {
      this.in_checked = this.checked;
    },
    in_checked() {
      this.$emit("change", this.in_checked);
    },
  },
};
</script>