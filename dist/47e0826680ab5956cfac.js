(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{34:function(e,t,s){"use strict";s.r(t);var l=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"app-container app-scroll row align-items-center justify-content-center"},[s("form",{staticClass:"col-12 col-sm-11 col-md-10 col-lg-9 col-xl-8 text-center mt-3",on:{submit:function(t){return t.preventDefault(),e.submit(t)}}},[s("input-text",{attrs:{label:"微信",placeholder:"1~255位字母或数字",pattern:"[a-zA-Z0-9]{1,255}"},model:{value:e.fields.wechat,callback:function(t){e.$set(e.fields,"wechat",t)},expression:"fields.wechat"}}),e._v(" "),s("input-text",{attrs:{label:"手机号",placeholder:"11位数字",pattern:"^[1]([3-9])[0-9]{9}$"},model:{value:e.fields.tel,callback:function(t){e.$set(e.fields,"tel",t)},expression:"fields.tel"}}),e._v(" "),s("input-text",{attrs:{label:"个人主页",placeholder:"请输入正确的网址，不超过255位字符"},model:{value:e.fields.homepage,callback:function(t){e.$set(e.fields,"homepage",t)},expression:"fields.homepage"}}),e._v(" "),s("input-textarea",{attrs:{label:"个人简介",rows:"12",placeholder:"不超过1023个字符（或汉字）",maxlength:"1023"},model:{value:e.fields.resume,callback:function(t){e.$set(e.fields,"resume",t)},expression:"fields.resume"}}),e._v(" "),s("div",{staticClass:"form-row justify-content-end align-items-center mb-3"},[s("app-button",{staticClass:"btn btn-primary col-12 col-md-5 mb-3 mb-md-0",attrs:{type:"submit"}},[s("i",{staticClass:"fa fa-paper-plane"}),e._v("提交\n      ")])],1)],1)])};l._withStripped=!0;var a={data:()=>({fields:{wechat:"",tel:"",homepage:"",resume:""}}),methods:{async submit(){let e=!1,t=Object.assign({},this.fields);for(const[s,l]of Object.entries(this.fields))l?e=!0:delete t[s];if(e){let e=await this.$axiosPost("/user/perfect-info",t);this.$alertResult(e)}else this.$alertWarn("请至少填写一个项目！")}}},i=s(0),n=Object(i.a)(a,l,[],!1,null,null,null);n.options.__file="modules/user/components/perfect-info-student.vue";t.default=n.exports}}]);