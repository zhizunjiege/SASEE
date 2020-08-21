<template>
  <div class="app-container">
    <div
      v-show="loading"
      class="app-backdrop row justify-content-center align-items-center h-100 w-100"
    >
      <div class="spinner-border spinner-border-lg text-primary"></div>
    </div>
    <header class="app-head">
      <div class="d-flex h-100 w-100 align-items-center justify-content-between mx-auto text-light">
        <div
          class="d-flex col-md-6 align-items-center point"
          @click="$router.push({path:online?'/system':'/'})"
        >
          <h3 class="mb-0 ml-1 ml-md-3 ml-lg-5">自动化科学与电气工程学院</h3>
        </div>
        <div class="d-none d-md-flex col-md-6 h-100 justify-content-end px-0">
          <div
            v-if="online"
            class="profile dropdown h-100 text-center border-left border-dark point"
          >
            <div
              class="dropdown-toggle d-flex w-100 h-100 justify-content-around align-items-center"
              data-toggle="dropdown"
              data-display="static"
            >
              <img :src="profile" class="float-left rounded-circle" alt="profile" height="80%" />
              <div class="d-flex align-items-center">
                <div class="h5 my-0 mr-2">{{user.name}}</div>
                <span class="badge badge-pill badge-info">{{user.identity}}</span>
              </div>
            </div>
            <div class="dropdown-menu">
              <div class="dropdown-item h-100">
                <router-link to="/system" class="d-block">返回主页</router-link>
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item h-100">
                <a href="#" @click.prevent="logout" class="d-block">退出登陆</a>
              </div>
            </div>
          </div>
          <div
            v-else
            class="d-flex col-12 col-md-10 col-lg-8 col-xl-6 h-100 justify-content-around align-items-center px-3"
          >
            <app-button
              @click.native="$router.push({path:'/login'})"
              class="btn btn-primary"
              type="button"
            >
              <i class="fa fa-sign-in px-1"></i>登陆
            </app-button>
            <app-button
              @click.native="$router.push({path:'/signup'})"
              class="btn btn-primary"
              type="button"
            >
              <i class="fa fa-user-plus px-1"></i>注册
            </app-button>
          </div>
        </div>
      </div>
    </header>
    <main class="app-body bg-main">
      <keep-alive>
        <router-view :modules="modules" @login="$emit('login',$event)"></router-view>
      </keep-alive>
    </main>
    <footer class="app-foot fixed-bottom row justify-content-between align-items-center">
      <div class="col-12 col-md-5 col-lg-4">
        <p class="mb-0 ml-3">
          系统时间：
          <span>{{footTime}}</span>
        </p>
      </div>
      <div class="col-12 col-md-7 col-lg-6 text-center">
        <div
          v-for="(link,index) in footLinks"
          :key="index"
          style="min-width:25%;max-width: 25%;display:inline-block;"
        >
          <router-link v-if="link.to" :to="link.to" class="d-block px-3">{{link.des}}</router-link>
          <a v-else :href="link.href" class="d-block px-3" target="_blank">{{link.des}}</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import VueRouter from "vue-router";

import mainPage from "./components/main-page";
import startPage from "./components/start-page";
import appLogin from "./components/app-login";
import appSignup from "./components/app-signup";
import appRetrieve from "./components/app-retrieve";
import appLicense from "./components/app-license";
import appNotFound from "./components/app-not-found";

export default {
  router: new VueRouter({
    routes: [
      {
        path: "/",
        component: startPage,
        children: [
          {
            path: "",
            component: appLogin,
          },
          {
            path: "login",
            component: appLogin,
          },
        ],
      },
      {
        path: "/signup",
        component: appSignup,
      },
      {
        path: "/retrieve",
        component: appRetrieve,
      },
      {
        path: "/license",
        component: appLicense,
      },
      {
        path: "*",
        component: appNotFound,
      },
    ],
  }),
  data() {
    return {
      online: false,
      loading: true,
      user: {
        profile: "",
        name: "",
        identity: "",
      },
      lastWriteTime: Date.now(),
      modules: [],
      serverTime: {
        time_: Date.now(),
        counter_: 0,
        updater_: 0,
        refresh: 0,
      },
      footLinks: [
        {
          href: "http://www.buaa.edu.cn/",
          des: "学校官网",
        },
        {
          href: "http://dept3.buaa.edu.cn/",
          des: "学院官网",
        },
        {
          href: "http://10.200.21.61:7001/",
          des: "本科教务",
        },
      ],
    };
  },
  computed: {
    profile() {
      return `./img/${this.user.profile}`;
    },
    footTime() {
      return new Date(this.serverTime.time_)
        .toLocaleISOString()
        .substring(0, 19)
        .replace("T", " ");
    },
  },
  methods: {
    reLogin() {
      this.$alertError("登陆信息失效，请重新登陆！");
      this.online = false;
      this.loading = false;
      this.modules.splice(2);
      this.$router.push({ path: "/login" });
    },
    timeCount() {
      this.serverTime.time_ += 1000;
      this.serverTime.counter_ = setTimeout(this.timeCount.bind(this), 1000);
    },
    async timeUpdate() {
      try {
        let result = await this.$axiosGet("/serverTime");
        clearTimeout(this.serverTime.counter_);
        this.serverTime.time_ = result.time;
        this.serverTime.updater_ = setTimeout(
          this.timeUpdate.bind(this),
          5 * 60 * 1000
        );
        this.timeCount();
        this.serverTime.refresh = 0;
      } catch (err) {
        if (this.serverTime.refresh <= 3) {
          this.serverTime.refresh++;
          this.serverTime.updater_ = setTimeout(
            this.timeUpdate.bind(this),
            8 * 1000
          );
        } else {
          clearTimeout(this.serverTime.updater_);
          this.$alertError("与服务器失去连接！");
        }
      }
    },
    async getModules() {
      let result = await this.$axiosGet("/modules");
      if (result.status) {
        let modules = [],
          routes = [];
        for (const module of result.routes) {
          if (module.subs.length) {
            let _module = {
                name: module.path,
                des: module.des,
                icon: module.icon,
                subModules: [],
              },
              _route = {
                path: `/${module.path}`,
                component: mainPage,
                children: [],
              };
            modules.push(_module);
            routes.push(_route);
            for (const subModule of module.subs) {
              if (subModule.des) {
                _module.subModules.push({
                  name: subModule.path,
                  des: subModule.des,
                });
              }
              if (subModule.component) {
                _route.children.push({
                  path: subModule.path,
                  component: () =>
                    import(
                      `../modules/${module.path}/components/${subModule.component}`
                    ),
                });
              }
            }
          }
        }
        this.modules = modules;
        this.$router.addRoutes(routes);
        return true;
      } else {
        this.$alertError(result.msg);
        this.$router.push({ path: `/?prevent=${this.$route.path}` });
        return false;
      }
    },
    async logout() {
      let result = await this.$axiosGet("/logout");
      if (result.status) this.$emit("logout", "/");
      this.$alertResult(result);
    },
  },
  async mounted() {
    window.addEventListener("beforeunload", (e) => {
      let msg = "离开页面将可能丢失数据，请谨慎操作！";
      e.returnValue = msg;
      return msg;
    });

    window.addEventListener("unload", (e) => {
      this.lastWriteTime = Date.now();
      localStorage.setItem(
        "status",
        JSON.stringify({
          online: this.online,
          user: this.user,
        })
      );
    });

    this.$router.beforeEach((to, from, next) => {
      if (to.path === from.query.prevent) {
        next(false);
      } else {
        next();
      }
    });

    this.$on("login", async function (result) {
      if (await this.getModules()) {
        this.online = true;
        this.user = result.user;
        this.$router.push({ path: "/system" });
      }
    });
    this.$on("logout", async function (path) {
      this.online = false;
      this.loading = false;
      this.modules = [];
      this.$router.push({ path, query: { prevent: this.$route.path } });
    });

    this.timeCount();

    await this.timeUpdate();

    let res = await this.$axiosGet("/query");

    if (res.online) {
      let data = JSON.parse(localStorage.getItem("status"));
      if (data) {
        this.online = data.online;
        this.user = data.user;
      }
      await this.getModules();
    } else {
      this.$router.push({ path: "/" });
    }
    this.loading = false;
  },
};
</script>
<style>
</style>