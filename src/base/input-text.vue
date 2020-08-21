<template>
  <div class="form-group form-row">
    <label
      v-if="label"
      class="col-3 col-form-label"
      :class="{'required':'required' in $attrs}"
    >{{label}}</label>
    <input
      v-bind="$attrs"
      :value="value"
      :type="type"
      @input="$emit('input',$event.target.value)"
      class="form-control"
      :class="{'col-9':label}"
    />
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    value: [String,Number],
    label: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
  },
};
</script>