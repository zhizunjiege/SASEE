<template>
  <div class="form-group form-row">
    <label
      v-if="label"
      class="col-3 col-form-label"
      :class="{'required':'required' in $attrs}"
    >{{label}}</label>
    <div class="custom-file" :class="{'col-9':label}">
      <input
        ref="input"
        v-bind="$attrs"
        @change="onchange"
        type="file"
        :accept="accept"
        class="custom-file-input"
      />
      <label class="custom-file-label text-left">
        <small class="form-text text-muted">{{placeholder}}</small>
      </label>
    </div>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: [FileList, Array],
    label: {
      type: String,
      default: "",
    },
    accept: {
      type: String,
      default: ".7z,.rar,.zip,tar,.doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.xml",
    },
    pre: {
      type: String,
      default: "",
    },
  },
  note: "请上传文档、表格或压缩文件，不超过20M",
  data() {
    return {
      placeholder: this.pre || this.$options.note,
    };
  },
  watch: {
    value(n, o) {
      if (n.length == 0) {
        this.$refs.input.value = "";
        this.placeholder = this.$options.note;
      }
    },
  },
  methods: {
    onchange(e) {
      let files = e.target.files;
      if (files[0].size > 20 * 1024 * 1024) {
        this.$alertWarn("文件大小超出限制！");
        e.target.value = "";
        this.placeholder = this.$options.note;
      } else {
        this.placeholder = files[0].name;
        this.$emit("change", files);
      }
    },
  },
};
</script>