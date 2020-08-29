<template>
  <div v-if="show" class="d-flex flex-column h-100">
    <nav class="nav nav-tabs nav-justified sticky-top bg-main">
      <a
        data-toggle="tab"
        class="nav-item nav-link active"
        href="#docs-manager"
        @click="identity='student'"
      >学生</a>
      <a
        data-toggle="tab"
        class="nav-item nav-link"
        href="#docs-manager"
        @click="identity='teacher'"
      >教师</a>
    </nav>
    <div class="tab-content px-3 app-container flex-grow-1 app-scroll">
      <div class="position-relative h-100 tab-pane fade show active" id="docs-manager">
        <table class="table table-fixed table-hover table-bordered text-center py-3">
          <thead class="thead-light">
            <tr>
              <th>选择</th>
              <th v-for="(h,index) in heads" scope="col" :key="index">{{h.des}}</th>
              <th>上传文件</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="docs[identity].length">
              <tr
                v-for="(d,i) in docs[identity]"
                :key="i"
                :class="{editing:editing&&i==selected[0]}"
              >
                <td>
                  <div class="custom-control custom-checkbox">
                    <input
                      v-model="selected"
                      :value="i"
                      type="checkbox"
                      :id="'checkbox-'+i"
                      class="custom-control-input"
                      :disabled="editing&&i!=selected[0]"
                    />
                    <label :for="'checkbox-'+i" class="custom-control-label"></label>
                  </div>
                </td>
                <td v-for="(h,j) in heads" :key="j" :title="d[h.key]">{{d[h.key]}}</td>
                <td>
                  <app-button
                    @click.native="getFile"
                    :disabled="!editing||i!=selected[0]"
                    class="btn btn-link py-0"
                  >上传文件</app-button>
                  <input-file v-model="d.file" @change="gotFile(i)" class="d-none"></input-file>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td>暂无</td>
              <td>暂无</td>
              <td>暂无</td>
              <td>暂无</td>
              <td>暂无</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div
      class="w-100 form-group d-flex justify-content-around border-top border-secondary py-3 mb-0"
    >
      <app-button
        @click.native="select"
        :disabled="docs[identity].length<=0||adding||editing"
        class="btn btn-primary"
        type="button"
      >
        <i class="fa fa-check"></i>反选
      </app-button>
      <app-button
        @click.native="remove"
        :disabled="selected.length<=0||adding||editing"
        class="btn btn-warning"
        type="button"
        warn="您确定要删除所选文件吗？"
      >
        <i class="fa fa-trash"></i>删除
      </app-button>
      <app-button
        @click.native="edit"
        :disabled="selected.length!=1||adding"
        class="btn btn-secondary"
        type="button"
      >
        <i class="fa fa-pencil"></i>
        {{editing?'确认':'修改'}}
      </app-button>
      <app-button
        @click.native="add"
        :disabled="editing&&!adding"
        class="btn btn-primary"
        type="button"
      >
        <i class="fa fa-plus"></i>
        {{adding?'确认':'新增'}}
      </app-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      identity: "student",
      heads: [
        { key: "filename", des: "文件名" },
        { key: "time", des: "更新时间" },
        { key: "count", des: "下载次数" },
      ],
      docs: {
        student: [],
        teacher: [],
      },
      selected: [],

      editing: false,
      adding: false,
    };
  },
  watch: {
    identity() {
      this.selected = [];
      this.editing = false;
      this.adding = false;
    },
    selected(n, o) {
      if (n.length < o.length) {
        if (this.editing) {
          this.editing = false;
        }
        if (this.adding) {
          this.adding = false;
          this.selected = [];
          this.docs[this.identity].pop();
        }
      }
    },
  },
  methods: {
    async remove() {
      let rst = await this.$axiosPost("/scsx/remove-doc", {
        indexes: this.selected,
        identity: this.identity,
      });
      if (rst.status) {
        this.docs[this.identity] = this.docs[this.identity].filter((_, i) => {
          return this.selected.indexOf(i) < 0;
        });
        this.selected = [];
      }
      this.$alertResult(rst);
    },
    async add() {
      if (this.adding) {
        let ref = this.docs[this.identity][this.selected[0]],
          file = ref.file[0];
        if (file) {
          let data = new FormData();
          data.append("file", file);
          data.append("identity", this.identity);

          let rst = await this.$axiosFile("/scsx/add-doc", data);
          if (rst.status) {
            this.editing = false;
            this.adding = false;
            this.selected = [];
            ref.file = [];
          }
          this.$alertResult(rst);
        } else {
          this.$alertWarn("请选择文件！");
        }
      } else {
        let one = {
          filename: "",
          time: "",
          count: 0,
          file: [],
        };
        this.selected = [this.docs[this.identity].push(one) - 1];
        this.editing = true;
        this.adding = true;
        this.$nextTick(() => {
          document.querySelector("tr.editing").scrollIntoView(false);
        });
      }
    },
    async edit() {
      if (this.editing) {
        let index = this.selected[0],
          ref = this.docs[this.identity][index],
          file = ref.file[0];
        if (file) {
          let data = new FormData();
          data.append("file", file);
          data.append("identity", this.identity);
          data.append("index", index);

          let rst = await this.$axiosFile("/scsx/edit-doc", data);
          if (rst.status) {
            this.editing = false;
            this.selected = [];
            ref.file = [];
          }
          this.$alertResult(rst);
        } else {
          this.$alertWarn("请选择文件！");
        }
      } else {
        this.editing = true;
      }
    },
    select() {
      let len = this.docs[this.identity].length,
        selected = [];
      for (let i = 0; i < len; i++) {
        if (this.selected.indexOf(i) < 0) {
          selected.push(i);
        }
      }
      this.selected = selected;
    },
    getFile(e) {
      e.target.nextElementSibling.children[0].children[0].click();
    },
    gotFile(index) {
      let i = this.docs[this.identity][index];
      i.filename = i.file[0].name;
      i.time = new Date().toLocaleISOString();
    },
  },
  async created() {
    let rst = await this.$axiosGet("/scsx/docs-templates");
    if (rst.status) {
      this.docs = rst.docs;
      for (const i of ["student", "teacher"]) {
        for (const j of this.docs[i]) {
          j.file = [];
        }
      }
      this.show = true;
    }
  },
};
</script>