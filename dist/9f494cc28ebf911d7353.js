(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{31:function(t,s,e){"use strict";e.r(s);var a=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"app-container app-scroll px-0 px-md-3 text-center"},t._l(t.projects,(function(s,a){return e("div",{key:a,staticClass:"mb-3"},[e("header",{staticClass:"border-bottom border-secondary mb-3"},[e("h3",{staticClass:"pt-3 mb-0"},[t._v(t._s(s.title))])]),t._v(" "),e("div",{staticClass:"mb-3"},[e("table",{staticClass:"table table-fixed table-bordered"},[e("tbody",[e("tr",[e("th",[t._v("平行志愿")]),t._v(" "),e("td",[t._v(t._s(a+1))]),t._v(" "),e("th",[t._v("已选人数")]),t._v(" "),e("td",[t._v(t._s(s.chosen))])]),t._v(" "),e("tr",[e("th",[t._v("教师姓名")]),t._v(" "),e("td",[t._v(t._s(s.name))]),t._v(" "),e("th",[t._v("所属方向")]),t._v(" "),e("td",[t._v(t._s(s.group))])])])])]),t._v(" "),e("div",{staticClass:"row align-items-center justify-content-around"},[e("app-button",{staticClass:"btn btn-secondary col-12 col-md-4 mb-3 mb-md-0",attrs:{disabled:s.id<=0,type:"button",warn:"您确定退选吗？"},nativeOn:{click:function(e){return t.revoke(s.id,a)}}},[e("i",{staticClass:"fa fa-trash"}),t._v("退选\n      ")]),t._v(" "),e("app-button",{staticClass:"btn btn-primary col-12 col-md-4 mb-3 mb-md-0",attrs:{disabled:s.id<=0,type:"button"},nativeOn:{click:function(e){return t.detail(s.id,s.teacher)}}},[e("i",{staticClass:"fa fa-info"}),t._v("详细信息\n      ")])],1)])})),0)};a._withStripped=!0;var o={project:{id:-1,title:"无",chosen:0,name:"无",group:"无"},data(){return{projects:Array(3).fill(this.$options.project)}},methods:{async revoke(t,s){let e=await this.$axiosPost("/bysj/revoke",{id:t,target:s+1});e.status&&this.$set(this.projects,s,this.$options.project),this.$alertResult(e)},detail(t,s){this.$router.push({path:`/bysj/project-content?id=${t}&teacher=${s}&chooseUsable=no`})}},async mounted(){let t=await this.$axiosGet("/bysj/project-chosen");if(t.status)for(let s=0;s<this.projects.length;s++)t.projects[s]&&this.$set(this.projects,s,t.projects[s]);else this.$alertError(t.msg)}},i=e(0),r=Object(i.a)(o,a,[],!1,null,null,null);r.options.__file="modules/bysj/components/project-chosen.vue";s.default=r.exports}}]);