<template>
  <div class="form-group form-row">
    <label
      v-if="label"
      class="col-3 col-form-label"
      :class="{ required: 'required' in $attrs }"
      >{{ label }}</label
    >
    <textarea
      v-bind="$attrs"
      v-model="in_value"
      class="form-control textarea-alpha"
      :class="{ 'col-9': label }"
    ></textarea>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: String,
    label: {
      type: String,
      default: "",
    },
  },
  data() {
    return { in_value: this.value };
  },
  watch: {
    value() {
      this.in_value = this.value;
    },
    in_value() {
      this.$emit("change", this.in_value.replace(/\r/g, ""));
    },
  },
};
</script>