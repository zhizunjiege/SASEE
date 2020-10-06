<template>
  <div class="app-container d-flex">
    <aside class="main-sidebar border-right">
      <bs4-listgroup id="accordion_sidebar" :items="modules" v-slot="{ item }">
        <a
          data-toggle="collapse"
          :href="'#' + item.name"
          class="d-flex justify-content-between align-items-center"
        >
          <span>
            <span class="fa mr-2" :class="item.icon"></span>
            {{ item.des }}
          </span>
          <span class="fa fa-chevron-right"></span>
        </a>
        <div :id="item.name" class="collapse" data-parent="#accordion_sidebar">
          <bs4-listgroup
            :items="item.subModules"
            :action="true"
            v-slot="{ item: subItem }"
          >
            <router-link
              style="display: block"
              :to="'/' + item.name + '/' + subItem.name"
            >
              <small>{{ subItem.des }}</small>
            </router-link>
          </bs4-listgroup>
        </div>
      </bs4-listgroup>
    </aside>
    <div class="main-content">
      <router-view ref="view" :key="updateKey"></router-view>
    </div>
    <div class="tool">
      <div @click="goHome" class="tool-item" title="返回顶部">
        <i class="fa fa-2x fa-angle-up"></i>
      </div>
      <div @click="refresh" class="tool-item" title="刷新内页">
        <i class="fa fa-lg fa-spinner" :class="{ 'fa-spin': loading }"></i>
      </div>
      <div @click="goEnd" class="tool-item" title="返回底部">
        <i class="fa fa-2x fa-angle-down"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    modules: Array,
  },
  data() {
    return {
      updateKey: 0,
      loading: false,
    };
  },
  methods: {
    refresh() {
      this.loading = true;
      this.updateKey++;
      this.$nextTick(() => {
        this.loading = false;
      });
    },
    goHome() {
      this.$refs.view.$el.scrollTop = 0;
    },
    goEnd() {
      this.$refs.view.$el.scrollTop = Number.MAX_SAFE_INTEGER;
    },
  },
};
</script>
<style scoped>
.tool {
  position: fixed;
  bottom: 4%;
  right: 1rem;
  z-index: 1001;
}

.tool > .tool-item {
  border-radius: 50%;
  cursor: pointer;
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ccffff1a;
  color: #0078e7;
}

.tool > .tool-item:hover {
  background-color: #0078e71a;
  color: #2e317c;
}
</style>