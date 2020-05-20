export default {
    template: `
    <div class="p-3">
        <div class="mb-3 text-center">
            <table class="table table-bordered table-fixed">
                <tbody>
                    <tr>
                        <th scope="col" colspan="4">身份信息</th>
                    </tr>
                    <tr>
                        <th>姓名</th>
                        <td>{{user.name}}</td>
                        <th>性别</th>
                        <td>{{user.gender}}</td>
                    </tr>
                    <tr>
                        <th>工号</th>
                        <td>{{user.schoolNum}}</td>
                        <th>职称</th>
                        <td>{{user.proTitle}}</td>
                    </tr>
                    <tr>
                        <th>系别</th>
                        <td>{{user.department}}</td>
                        <th>方向</th>
                        <td>{{user.group}}</td>
                    </tr>
                    <tr>
                        <th>办公地点</th>
                        <td>{{user.office}}</td>
                        <th>研究方向</th>
                        <td>{{user.field}}</td>
                    </tr>
                    <tr>
                        <th>是否负责人</th>
                        <td>{{user.ifDean}}</td>
                    </tr>
                    <tr>
                        <th scope="col" colspan="4">账户信息</th>
                    </tr>
                    <tr>
                        <th>用户名</th>
                        <td>{{user.username}}</td>
                        <th>密码</th>
                        <td>********</td>
                    </tr>
                    <tr>
                        <th scope="col" colspan="4">联系方式</th>
                    </tr>
                    <tr>
                        <th>邮箱</th>
                        <td>{{user.email}}</td>
                        <th>微信</th>
                        <td>{{user.wechat}}</td>
                    </tr>
                    <tr>
                        <th>电话</th>
                        <td>{{user.tel}}</td>
                        <th>个人主页</th>
                        <td>
                            <a v-if="user.homepage" :href="user.homepage">{{user.homepage}}</a>
                            <span v-else>无</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="mb-3">
                <h5 class="text-center">个人简介</h5>
                <pre class="p-3 border rounded">{{user.resume}}</pre>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            user: {
                office: '无',
                field: '无',
                email: '无',
                wechat: '无',
                tel: '无',
                homepage: '',
                resume: '无'
            }
        }
    },
    async mounted() {
        let result = await this.$axiosGet('/user/info');
        if (result.status) {
            Object.assign(this.user, result.user);
        } else {
            this.$alertError(result.msg);
        }
    }
}