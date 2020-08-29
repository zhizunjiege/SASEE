<template>
  <div v-if="id>0" class="d-flex flex-column h-100">
    <div class="px-3 app-container flex-grow-1 app-scroll">
      <div class="position-relative h-100">
        <table v-if="tasks.length" class="table table-hover table-bordered text-center py-3">
          <thead class="thead-light">
            <tr>
              <th>选择</th>
              <th v-for="(h,index) in heads" scope="col" :key="index">{{h.des}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t,index) in tasks" :key="t.id">
              <td>
                <div class="custom-control custom-checkbox">
                  <input
                    v-model="selected"
                    :value="t.id"
                    type="checkbox"
                    :id="'checkbox-'+index"
                    class="custom-control-input"
                  />
                  <label :for="'checkbox-'+index" class="custom-control-label"></label>
                </div>
              </td>
              <td v-for="(h,index) in heads" :key="index">{{t[h.key]}}</td>
            </tr>
          </tbody>
        </table>
        <div
          v-else
          class="d-flex justify-content-center align-items-center text-muted"
          style="height: 250px"
        >
          <h1>暂无任务！</h1>
        </div>
      </div>
    </div>
    <div class="form-group form-row justify-content-around border-top border-secondary py-3 mb-0">
      <app-button
        @click.native="select"
        :disabled="tasks.length<=0"
        class="btn btn-primary"
        type="button"
      >
        <i class="fa fa-check"></i>反选
      </app-button>
      <app-button
        @click.native="remove"
        :disabled="selected.length<=0"
        class="btn btn-warning"
        type="button"
        warn="您确定要删除所选任务吗？"
      >
        <i class="fa fa-trash"></i>删除
      </app-button>
      <app-button
        @click.native="edit"
        :disabled="selected.length!=1"
        class="btn btn-secondary"
        type="button"
      >
        <i class="fa fa-pencil"></i>修改
      </app-button>
      <app-button
        @click.native="detail"
        :disabled="selected.length!=1"
        class="btn btn-info"
        type="button"
      >
        <i class="fa fa-info"></i>详情
      </app-button>
      <app-button @click.native="add" class="btn btn-primary" type="button">
        <i class="fa fa-plus"></i>新建
      </app-button>
    </div>
  </div>
  <div
    v-else
    class="d-flex justify-content-center align-items-center text-muted"
    style="height: 250px"
  >
    <h1>无相关信息！</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      heads: [
        { key: "title", des: "任务标题" },
        { key: "mode", des: "任务类型" },
        { key: "deadline", des: "截止时间" },
        { key: "submitted", des: "已提交人数" },
      ],
      id: -1,
      tasks: [],
      selected: [],
    };
  },
  methods: {
    async remove() {
      let rst = await this.$axiosPost("/scsx/task-remove", {
        tid: this.selected,
      });
      if (rst.status) {
        this.tasks = this.tasks.filter((i) => {
          return this.selected.indexOf(i.id) < 0;
        });
        this.selected = [];
      }
      this.$alertResult(rst);
    },
    add() {
      this.$router.push({
        path: "/scsx/xzrw",
      });
    },
    edit() {
      this.$router.push({
        path: "/scsx/xgrw",
        query: { tid: this.selected[0] },
      });
    },
    detail() {
      this.$router.push({
        path: "/scsx/rwxq",
        query: { tid: this.selected[0] },
      });
    },
    select() {
      let selected = [];
      for (const i of this.tasks) {
        if (this.selected.indexOf(i.id) < 0) {
          selected.push(i.id);
        }
      }
      this.selected = selected;
    },
  },
  async created() {
    let rst = await this.$axiosGet("/scsx/task-manage");
    if (rst.status) {
      this.id = rst.id;
      this.tasks = rst.tasks;
    }
  },
};
</script>