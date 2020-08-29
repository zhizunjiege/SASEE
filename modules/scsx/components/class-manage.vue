<template>
  <div class="d-flex flex-column h-100">
    <div class="px-3 app-container flex-grow-1 app-scroll">
      <div class="position-relative h-100">
        <table v-if="classes.length" class="table table-hover table-bordered text-center py-3">
          <thead class="thead-light">
            <tr>
              <th>选择</th>
              <th v-for="(h,index) in heads" scope="col" :key="index">{{h.des}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(c,index) in classes" :key="c.id">
              <td>
                <div class="custom-control custom-checkbox">
                  <input
                    v-model="selected"
                    :value="c.id"
                    type="checkbox"
                    :id="'checkbox-'+index"
                    class="custom-control-input"
                  />
                  <label :for="'checkbox-'+index" class="custom-control-label"></label>
                </div>
              </td>
              <td v-for="(h,index) in heads" :key="index">{{c[h.key]}}</td>
            </tr>
          </tbody>
        </table>
        <div
          v-else
          class="d-flex justify-content-center align-items-center text-muted"
          style="height: 250px"
        >
          <h1>暂无小组信息！</h1>
        </div>
      </div>
    </div>
    <div class="form-group form-row justify-content-around border-top border-secondary py-3 mb-0">
      <app-button
        @click.native="select"
        :disabled="classes.length<=0"
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
        warn="您确定要删除所选小组吗？"
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
      <app-button @click.native="add" class="btn btn-primary" type="button">
        <i class="fa fa-plus"></i>新建
      </app-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      heads: [
        { key: "class", des: "班级" },
        { key: "specialty", des: "专业" },
        { key: "teacher", des: "指导教师" },
        { key: "mode", des: "实习方式" },
        { key: "place", des: "实习地点" },
        { key: "employer", des: "实习单位" },
        { key: "startTime", des: "起始时间" },
        { key: "endTime", des: "结束时间" },
      ],
      classes: [],
      selected: [],
    };
  },
  methods: {
    async remove() {
      let rst = await this.$axiosPost("/scsx/class-remove", {
        cid: this.selected,
      });
      if (rst.status) {
        this.classes = this.classes.filter((i) => {
          return this.selected.indexOf(i.id) < 0;
        });
        this.selected = [];
      }
      this.$alertResult(rst);
    },
    add() {
      this.$router.push({
        path: "/scsx/xzxz",
      });
    },
    edit() {
      this.$router.push({
        path: "/scsx/xgxz",
        query: { cid: this.selected[0] },
      });
    },
    select() {
      let selected = [];
      for (const i of this.classes) {
        if (this.selected.indexOf(i.id) < 0) {
          selected.push(i.id);
        }
      }
      this.selected = selected;
    },
  },
  async created() {
    let rst = await this.$axiosGet("/scsx/class-manage");
    if (rst.status) {
      this.classes = rst.classes;
    }
  },
};
</script>