export default {
    template: `
    <div class="app-container app-scroll px-3">
        <table class="table table-hover text-center col-11 mx-auto table-fixed">
            <thead class="thead-light">
                <tr>
                    <th scope="col">教师姓名</th>
                    <th scope="col">教师性别</th>
                    <th scope="col">教师工号</th>
                    <th scope="col">教师职称</th>
                    <th scope="col">已发布/课题上限</th>
                    <th scope="col">联系邮箱</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="t in teachers">
                    <td>{{ t.name }}</td>
                    <td>{{ t.gender }}</td>
                    <td>{{ t.schoolNum }}</td>
                    <td>{{ t.proTitle }}</td>
                    <td>{{ ''+t.submitted+'/'+map[t.proTitle] }}</td>
                    <td v-if="t.email"><a :href="'mailto:'+t.email" target="_blank" title="发送邮件">{{t.email}}</a></td>
                    <td v-else>暂无</td>
                </tr>
            </tbody>
            <caption class="text-primary text-center">
                本方向共&ensp;<strong>{{ totalStudents }}</strong>&ensp;名学生，<strong>{{ teachers.length }}</strong>&ensp;位教师，已有课题&ensp;<strong>{{ pass+uncheck+unpass }}</strong>&ensp;个。
                <br>
                其中，通过&ensp;<strong>{{ pass }}</strong>&ensp;个，未审核&ensp;<strong>{{ uncheck }}</strong>&ensp;个，未通过&ensp;<strong>{{ unpass }}</strong>&ensp;个。
            </caption>
        </table>
    </div>
    `,
    data() {
        return {
            teachers: [],
            map: {},
            totalStudents: 0,
            pass: 0,
            uncheck: 0,
            unpass: 0
        }
    },
    async created() {
        let rst = await this.$axiosGet('/bysj/project-statistics');
        if (rst.status) {
            this.teachers = rst.teachers;
            this.map = rst.map;
            this.totalStudents = rst.totalStudents;
            this.totalProjects = rst.totalProjects;
            this.pass = rst.pass;
            this.uncheck = rst.uncheck;
            this.unpass = rst.unpass;
        }
        else {
            this.$alertError(rst.msg);
        }
    }
};