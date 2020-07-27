<template>
  <div class="app-scroll" @scroll="scroll">
    <slot></slot>
    <div
      v-if="status"
      class="row justify-content-center align-items-center w-100"
      style="height:50px"
    >
      <span v-if="status=='loading'" class="spinner-border spinner-border-lg text-primary"></span>
      <span v-if="status=='end'" class="text-secondary">到底了~</span>
      <span v-if="status=='error'" class="text-warning">网络错误-_-</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    status: { type: String, default: "" },
    mode: { type: String, default: "continue" /* single */ },
    top: { type: Number, default: 100 },
    bottom: { type: Number, default: 100 },
    factor: { type: Number, default: 4 },
  },
  data() {
    return {
      lastTop_: 0,
      factorCount_: 0,
      upTriggered_: false,
      downTriggered_: false,
    };
  },
  methods: {
    scroll(e) {
      if (this.factorCount_ >= this.factor) {
        let { scrollHeight, clientHeight, scrollTop } = e.target,
          scrollDown = scrollHeight - clientHeight - scrollTop;
        if (scrollTop > this.lastTop_) {
          //scrollUp
          if (scrollDown <= this.bottom) {
            (this.mode != "continue" && this.upTriggered_) ||
              this.$emit("scroll::up");
            this.mode != "continue" && (this.upTriggered_ = true);
          }
          this.mode != "continue" &&
            scrollTop > this.top &&
            (this.downTriggered_ = false);
        } else {
          //scrollDown
          if (scrollTop <= this.top) {
            (this.mode != "continue" && this.downTriggered_) ||
              this.$emit("scroll::down");
            this.mode != "continue" && (this.downTriggered_ = true);
          }
          this.mode != "continue" &&
            scrollDown > this.bottom &&
            (this.upTriggered_ = false);
        }
        this.lastTop_ = scrollTop;
        this.factorCount_ = 0;
      } else {
        this.factorCount_++;
      }
    },
  },
};
</script>