
<template>
  <div class="rate" :class="{ disabled: disabled }">
    <i
      v-for="i in 5"
      :key="i"
      class="fa"
      @mouseenter="disabled ? '' : (curScore = i)"
      @mouseleave="disabled ? '' : (curScore = '')"
      @click="disabled ? '' : setScore(i)"
      :class="getClass(i)"
    >
      <i
        v-if="disabled && i == Math.floor(score) + 1"
        class="fa fa-star"
        :style="'width:' + width"
      ></i>
    </i>
    <span v-if="showText" class="text">{{ curScore || score }}分</span>
  </div>
</template>

<script>

/* 组件来源 https://www.cnblogs.com/conglvse/p/9562521.html */

export default {
  name: "MyRate",
  props: {
    score: {
      type: Number,
      default: 0,
      //required: true
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showText: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      curScore: "",
      width: "",
    };
  },
  created: function () {
    this.getDecimal();
  },
  methods: {
    getClass(i) {
      if (this.curScore === "") {
        return i <= this.score ? "fa-star" : "fa-star-o";
      } else {
        return i <= this.curScore ? "fa-star" : "fa-star-o";
      }
    },
    getDecimal() {
      this.width =
        Number(this.score * 100 - Math.floor(this.score) * 100) + "%";
    },
    setScore(i) {
      this.$emit("update:score", i); //使用`.sync`修饰符，对score 进行“双向绑定
    },
  },
};
</script>

<style scoped>
.rate > .fa {
  display: inline-block;
  position: relative;
  font-size: 18px;
  transition: 0.3s;
}
.fa + .fa {
  margin-left: 5px;
}
.fa .fa {
  position: absolute;
  left: 0;
  overflow: hidden;
}
.fa-star-o {
  color: #c0c4cc;
}
.fa-star {
  color: #f4cd17;
}
.rate:not(.disabled) .fa:hover {
  transform: scale(1.2);
  cursor: pointer;
}
</style>