<template>
  <div class="app-container app-scroll p-3 text-center">
    <h3 class="text-primary">文档目录</h3>
    <table class="table table-fixed table-bordered">
      <thead class="thead-light">
        <tr>
          <th>序号</th>
          <th>文件名(点击下载)</th>
          <th>更新时间</th>
          <th>下载次数</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="docs.length>0">
          <tr v-for="(d,index) in docs" :key="index">
            <td :title="index+1">{{index+1}}</td>
            <td :title="d.filename">
              <a
                :href="`/scsx/download-docs?index=${index}&filename=${d.filename}`"
                download
              >{{d.filename}}</a>
            </td>
            <td>{{d.time}}</td>
            <td>{{d.count}}</td>
          </tr>
        </template>
        <tr v-else>
          <td>暂无</td>
          <td>暂无</td>
          <td>暂无</td>
          <td>暂无</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      docs: [],
    };
  },
  async created() {
    let rst = await this.$axiosGet("/scsx/docs-templates");
    if (rst.status) {
      this.docs = rst.docs;
    }
  },
};
</script>