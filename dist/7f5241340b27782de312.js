(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{27:function(t,s,e){"use strict";e.r(s);var _=function(){var t=this,s=t.$createElement,e=t._self._c||s;return Number(t.sid)>0?e("div",[e("div",{staticClass:"mb-3"},[e("h5",{staticClass:"text-primary"},[t._v("学生信息")]),t._v(" "),e("table",{staticClass:"table table-fixed table-bordered"},[e("tbody",[e("tr",[e("th",[t._v("姓名")]),t._v(" "),e("td",[t._v(t._s(t.student.name))]),t._v(" "),e("th",[t._v("性别")]),t._v(" "),e("td",[t._v(t._s(t.student.gender))])]),t._v(" "),e("tr",[e("th",[t._v("专业")]),t._v(" "),e("td",[t._v(t._s(t.student.specialty))]),t._v(" "),e("th",[t._v("方向")]),t._v(" "),e("td",[t._v(t._s(t.student.group))])]),t._v(" "),e("tr",[e("th",[t._v("班级")]),t._v(" "),e("td",[t._v(t._s(t.student.class))]),t._v(" "),e("th",[t._v("学号")]),t._v(" "),e("td",[t._v(t._s(t.student.schoolNum))])]),t._v(" "),e("tr",[e("th",[t._v("是否保研")]),t._v(" "),e("td",[t._v(t._s(t.student.postGraduate))])]),t._v(" "),e("tr",[e("th",[t._v("邮箱")]),t._v(" "),t.student.email?e("td",[e("a",{attrs:{href:"mailto:"+t.student.email,target:"_blank",title:"发送邮件"}},[t._v(t._s(t.student.email))])]):e("td",[t._v("暂无")]),t._v(" "),e("th",[t._v("个人主页")]),t._v(" "),e("td",[t.student.homepage?e("a",{attrs:{href:t.student.homepage,target:"_blank"}},[t._v(t._s(t.student.homepage))]):e("span",[t._v("无")])])]),t._v(" "),e("tr",[e("th",[t._v("微信")]),t._v(" "),e("td",[t._v(t._s(t.student.wechat))]),t._v(" "),e("th",[t._v("电话")]),t._v(" "),e("td",[t._v(t._s(t.student.tel))])])])])]),t._v(" "),e("div",{staticClass:"mb-3"},[e("h5",{staticClass:"text-primary"},[t._v("学生简介")]),t._v(" "),e("pre",{staticClass:"p-3 border rounded"},[t._v(t._s(t.student.resume))])])]):t._e()};_._withStripped=!0;var a={props:{sid:{type:[Number,String],required:!0}},data:()=>({student:{wechat:"无",tel:"无",resume:"无"}}),async created(){if(Number(this.sid)>0){let t=await this.$axiosGet("/bysj/info-student",{id:this.sid});t.status?this.student=Object.assign({},this.student,t.student):this.$alertError(t.msg)}}},d=e(0),v=Object(d.a)(a,_,[],!1,null,null,null);v.options.__file="modules/bysj/components/info-student.vue";s.default=v.exports}}]);