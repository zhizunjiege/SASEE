(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{45:function(t,a,s){"use strict";s.r(a);var n=function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"app-container app-scroll px-0 px-md-3 text-center position-relative"},[s("div",{staticClass:"sticky-top form-group form-row justify-content-around border-bottom border-primary py-2"},[s("app-button",{staticClass:"btn btn-warning",attrs:{type:"button",warn:"您确定要删除所有分组吗？"},nativeOn:{click:function(a){return t.truncate(a)}}},[s("i",{staticClass:"fa fa-trash"}),t._v("删除所有\n    ")]),t._v(" "),s("app-button",{staticClass:"btn btn-primary",attrs:{type:"button"},nativeOn:{click:function(a){return t.add(a)}}},[s("i",{staticClass:"fa fa-plus"}),t._v("新增分组\n    ")]),t._v(" "),s("a",{attrs:{href:"/kcsj/export-table",download:""}},[s("app-button",{staticClass:"btn btn-secondary",attrs:{type:"button"}},[s("i",{staticClass:"fa fa-arrow-down"}),t._v("导出总表\n      ")])],1)],1),t._v(" "),t.groups.length?t._l(t.groups,(function(a,n){return s("div",{key:n,staticClass:"py-3 border-bottom border-secondary"},[s("header",{staticClass:"mb-3"},[s("h3",{staticClass:"pt-3 mb-0"},[t._v(t._s(a.group.substr(2)+"-第"+a.num+"组"))])]),t._v(" "),s("div",{staticClass:"mb-3"},[s("table",{staticClass:"table table-fixed table-bordered"},[s("tbody",[s("tr",[s("th",[t._v("上课时间")]),t._v(" "),s("td",[t._v(t._s(a.time))]),t._v(" "),s("th",[t._v("上课地点")]),t._v(" "),s("td",[t._v(t._s(a.place))])]),t._v(" "),s("tr",[s("th",[t._v("课程容量")]),t._v(" "),s("td",[t._v(t._s(a.capacity))]),t._v(" "),s("th",[t._v("课程简介")]),t._v(" "),s("td",[t._v(t._s(a.description))])])])])]),t._v(" "),s("div",{staticClass:"row align-items-between justify-content-around"},[s("app-button",{staticClass:"btn btn-warning col-12 col-md-3 mb-3 mb-md-0",attrs:{type:"button",warn:"您确定删除该分组吗？"},nativeOn:{click:function(s){return t.remove(a.id,n)}}},[s("i",{staticClass:"fa fa-trash"}),t._v("删除\n        ")]),t._v(" "),s("app-button",{staticClass:"btn btn-secondary col-12 col-md-3 mb-3 mb-md-0",attrs:{type:"button"},nativeOn:{click:function(s){return t.edit(a.id)}}},[s("i",{staticClass:"fa fa-pencil"}),t._v("修改\n        ")]),t._v(" "),s("app-button",{staticClass:"btn btn-primary col-12 col-md-3 mb-3 mb-md-0",attrs:{type:"button"},nativeOn:{click:function(s){return t.detail(a.id)}}},[s("i",{staticClass:"fa fa-info"}),t._v("详情\n        ")])],1)])})):s("div",{staticClass:"d-flex justify-content-center align-items-center text-muted",staticStyle:{height:"250px"}},[s("h1",[t._v("暂无分组信息！")])])],2)};n._withStripped=!0;var e={data:()=>({groups:[]}),methods:{async truncate(){this.$alertResult(await this.$axiosGet("/kcsj/truncate")),this.groups=[]},async remove(t,a){let s=await this.$axiosGet("/kcsj/group-remove",{gid:t});s.status&&this.groups.splice(a,1),this.$alertResult(s)},add(){this.$router.push({path:"/kcsj/xzfz"})},edit(t){this.$router.push({path:"/kcsj/xgfz",query:{gid:t}})},detail(t){this.$router.push({path:"/kcsj/fzxx",query:{gid:t}})}},async created(){let t=await this.$axiosGet("/kcsj/group-manage");t.status&&(this.groups=t.groups)}},i=s(0),r=Object(i.a)(e,n,[],!1,null,null,null);r.options.__file="modules/kcsj/components/group-manage-admin.vue";a.default=r.exports}}]);