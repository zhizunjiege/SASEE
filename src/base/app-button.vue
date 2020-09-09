<template>
  <button @click="onclick">
    <slot></slot>
  </button>
</template>
<script>
export default {
  props: {
    interval: {
      type: Number,
      default: 2000,
    },
    warn: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      lastTime: 0,
    };
  },
  methods: {
    onclick(e) {
      let now = Date.now();
      if (e.isTrusted) {
        if (now - this.lastTime < this.interval) {
          e.preventDefault();
          e.stopImmediatePropagation();
          this.$alertWarn('点击太快啦，请2秒后再次尝试~');
          return ;
        } else if (this.warn) {
          e.preventDefault();
          e.stopImmediatePropagation();
          this.$alertWarn(this.warn, () => {
            let $event = new MouseEvent("click");
            this.$el.dispatchEvent($event);
          });
        }
      }
      this.lastTime = now;
    },
  },
};
</script>