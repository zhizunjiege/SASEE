(window.webpackJsonp=window.webpackJsonp||[]).push([[42],{42:function(t,e,n){"use strict";n.r(e);var s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.show?n("div",{staticClass:"p-3 app-container app-scroll"},[n("wang-editor",{attrs:{eid:"admin_license_editor",server:"/system/editor-img",full:!0,height:530},model:{value:t.content,callback:function(e){t.content=e},expression:"content"}}),t._v(" "),n("div",{staticClass:"form-row justify-content-end mb-3"},[n("app-button",{staticClass:"btn btn-primary col-12 col-md-4",attrs:{type:"button",warn:"您确定要发布该协议吗？"},nativeOn:{click:function(e){return t.submit(e)}}},[n("i",{staticClass:"fa fa-paper-plane"}),t._v("发布\n    ")])],1)],1):t._e()};s._withStripped=!0;var i={data:()=>({show:!1,content:""}),methods:{async submit(){if(this.content.length>20){let t=new FormData;t.append("content",this.content),this.$alertResult(await this.$axiosFile("/system/write-license",t))}else this.$alertWarn("协议内容太短！")}},async created(){this.content=await this.$axiosGet("/license"),this.show=!0}},a=n(0),o=Object(a.a)(i,s,[],!1,null,null,null);o.options.__file="modules/system/components/write-license.vue";e.default=o.exports}}]);