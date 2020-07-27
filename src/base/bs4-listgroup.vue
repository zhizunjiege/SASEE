<template>
  <dl class="list-group" :class="{'list-group-flush':flush}">
    <dd
      class="list-group-item"
      :class="{'list-group-item-action':action}"
      v-for="(item,index) in items"
      :key="index"
    >
      <slot :item="item"></slot>
    </dd>
  </dl>
</template>
<script>
export default {
  props: {
    flush: {
      type: Boolean,
      default: true,
    },
    action: {
      type: Boolean,
      default: false,
    },
    items: Array,
  },
};
</script>