<template>
  <div class="form-group form-row">
    <label
      v-if="label"
      class="col-3 col-form-label"
      :class="{'required':'required' in $attrs}"
    >{{label}}</label>
    <select
      v-bind="$attrs"
      v-model="in_value"
      class="custom-select form-control"
      :class="{'col-9':label}"
    >
      <option
        v-for="(opt,index) in options"
        :key="index"
        :value="typeof opt=='string'?opt:opt.val"
      >{{typeof opt=='string'?opt:opt.des}}</option>
    </select>
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
    value: [String, Number],
    label: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      required: true,
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
      this.$emit("change", this.in_value);
    },
  },
};
</script>