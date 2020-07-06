export default {
    template: `
    <div v-if="Number(sid)>0">
        <div class="mb-3">
            <h5 class="text-primary">学生信息</h5>
            <table class="table table-fixed table-bordered">
                <tbody>
                    <tr>
                        <th>姓名</th>
                        <td>{{student.name}}</td>
                        <th>性别</th>
                        <td>{{student.gender}}</td>
                    </tr>
                    <tr>
                        <th>专业</th>
                        <td>{{student.specialty}}</td>
                        <th>方向</th>
                        <td>{{student.group}}</td>
                    </tr>
                    <tr>
                        <th>班级</th>
                        <td>{{student.class}}</td>
                        <th>学号</th>
                        <td>{{student.schoolNum}}</td>
                    </tr>
                    <tr>
                        <th>是否保研</th>
                        <td>{{student.postGraduate}}</td>
                    </tr>
                    <tr>
                        <th>邮箱</th>
                        <td v-if="student.email"><a :href="'mailto:'+student.email" target="_blank" title="发送邮件">{{student.email}}</a></td>
                        <td v-else>暂无</td>
                        <th>个人主页</th>
                        <td>
                            <a v-if="student.homepage" :href="student.homepage">{{student.homepage}}</a>
                            <span v-else>无</span>
                        </td>
                    </tr>
                    <tr>
                        <th>微信</th>
                        <td>{{student.wechat}}</td>
                        <th>电话</th>
                        <td>{{student.tel}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="mb-3">
            <h5 class="text-primary">学生简介</h5>
            <pre class="p-3 border rounded">{{student.resume}}</pre>
        </div>
    </div>
    `,
    props: {
        sid: {
            type: [Number, String],
            required: true
        }
    },
    data() {
        return {
            student: {
                wechat: '无',
                tel: '无',
                resume: '无'
            }
        };
    },
    async created() {
        if (Number(this.sid) > 0) {
            let result = await this.$axiosGet('/bysj/info-student', { id: this.sid });
            if (result.status) this.student = Object.assign({}, this.student, result.student);
            else this.$alertError(result.msg);
        }
    }
}