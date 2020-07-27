<template>
  <div class="app-container d-flex">
    <aside class="main-sidebar border-right border-light">
      <bs4-listgroup id="accordion_sidebar" :items="modules" v-slot="{item}">
        <a
          data-toggle="collapse"
          :href="'#'+item.name"
          class="d-flex justify-content-between align-items-center"
        >
          <span>
            <span class="fa mr-2" :class="item.icon"></span>
            {{item.des}}
          </span>
          <span class="fa fa-chevron-right"></span>
        </a>
        <div :id="item.name" class="collapse" data-parent="#accordion_sidebar">
          <bs4-listgroup :items="item.subModules" :action="true" v-slot="{item:subItem}">
            <router-link style="display: block;" :to="'/' + item.name + '/' + subItem.name">
              <small>{{subItem.des}}</small>
            </router-link>
          </bs4-listgroup>
        </div>
      </bs4-listgroup>
    </aside>
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    modules: Array,
  },
};
</script>