(window.webpackJsonp=window.webpackJsonp||[]).push([[45],{65:function(t,e,s){"use strict";s.r(e);var n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"p-3 app-container app-scroll"},[s("form",{staticClass:"app-container",on:{submit:function(e){return e.preventDefault(),t.submit(e)}}},[s("div",{staticClass:"form-row justify-content-around align-items-center mb-3"},[s("input-checkbox",{staticClass:"col-2",attrs:{checkboxs:[{val:!0,des:"置顶"}]},model:{value:t.top,callback:function(e){t.top=e},expression:"top"}}),t._v(" "),s("input-text",{staticClass:"col-10 col-md-6 col-lg-4 mb-0",attrs:{label:"标题",placeholder:"不超过255个字符（或汉字）",maxlength:"255",required:""},model:{value:t.title,callback:function(e){t.title=e},expression:"title"}})],1),t._v(" "),s("wang-editor",{attrs:{eid:"admin_news_editor",full:!0,height:480,server:"/system/editor-img"},model:{value:t.content,callback:function(e){t.content=e},expression:"content"}}),t._v(" "),s("div",{staticClass:"form-row justify-content-end mb-3"},[s("app-button",{staticClass:"btn btn-primary col-12 col-md-4",attrs:{type:"submit",warn:"您确定要发布该通知吗？"}},[s("i",{staticClass:"fa fa-paper-plane"}),t._v("发布\n      ")])],1)],1)])};n._withStripped=!0;var a={data:()=>({top:!1,title:"",content:""}),methods:{async submit(){if(this.content.length>20){let t=new FormData;t.append("content",this.content),t.append("title",this.title),t.append("top",Number(this.top));let e=await this.$axiosFile("/system/write-news",t);this.$alertResult(e),e.status&&this.$router.push({path:"/system/tzgg"})}else this.$alertWarn("通知内容太短！")}}},i=s(0),l=Object(i.a)(a,n,[],!1,null,null,null);l.options.__file="modules/system/components/write-news.vue";e.default=l.exports}}]);