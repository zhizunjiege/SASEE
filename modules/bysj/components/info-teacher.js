export default {
    template: `
    <div v-if="Number(tid)>0">
        <div class="mb-3">
            <h5 class="text-primary">教师信息</h5>
            <table class="table table-fixed table-bordered">
                <tbody>
                    <tr>
                        <th>姓名</th>
                        <td>{{teacher.name}}</td>
                        <th>性别</th>
                        <td>{{teacher.gender}}</td>
                    </tr>
                    <tr>
                        <th>工号</th>
                        <td>{{teacher.schoolNum}}</td>
                        <th>职称</th>
                        <td>{{teacher.proTitle}}</td>
                    </tr>
                    <tr>
                        <th>方向</th>
                        <td>{{teacher.group}}</td>
                        <th>系别</th>
                        <td>{{teacher.department}}</td>
                    </tr>
                    <tr>
                        <th>研究领域</th>
                        <td>{{teacher.field}}</td>
                        <th>办公地点</th>
                        <td>{{teacher.office}}</td>
                    </tr>
                    <tr>
                        <th>邮箱</th>
                        <td v-if="teacher.email"><a :href="'mailto:'+teacher.email" target="_blank" title="发送邮件">{{teacher.email}}</a></td>
                        <td v-else>暂无</td>
                        <th>个人主页</th>
                        <td>
                            <a v-if="teacher.homepage" :href="teacher.homepage">{{teacher.homepage}}</a>
                            <span v-else>无</span>
                        </td>
                    </tr>
                    <tr>
                        <th>微信</th>
                        <td>{{teacher.wechat}}</td>
                        <th>电话</th>
                        <td>{{teacher.tel}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="mb-3">
            <h5 class="text-primary">教师简介</h5>
            <pre class="p-3 border rounded">{{teacher.resume}}</pre>
        </div>
    </div>
    `,
    props: {
        tid: {
            type: [Number,String],
            required: true
        }
    },
    data() {
        return {
            teacher: {
                field: '无',
                office: '无',
                wechat: '无',
                tel: '无',
                resume: '无'
            }
        };
    },
    async created() {
        let result = await this.$axiosGet('/bysj/info-teacher', { id: this.tid });
        if (result.status) this.teacher = Object.assign({}, this.teacher, result.teacher);
        else this.$alertError(result.msg);
    }
}