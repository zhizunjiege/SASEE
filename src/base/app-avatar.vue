<template>
  <img
    :src="src"
    class="rounded-circle"
    alt="avatar"
    :width="size"
    :height="size"
  />
</template>

<script>
export default {
  props: {
    size: {
      type: [Number, String],
      required: true,
    },
    src: {
      type: String,
      require: true,
    },
  },
};
</script>