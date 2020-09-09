<template>
  <div :id="eid" class="mb-3"></div>
</template>
<script>
import wangEditor from "wangeditor";

export default {
  model: {
    prop: "content",
    event: "change",
  },
  featureBase: [
    "head", // 标题
    "bold", // 粗体
    "fontSize", // 字号
    "fontName", // 字体
    "italic", // 斜体
    "justify", // 对齐方式
    "foreColor", // 文字颜色
    "backColor", // 背景颜色
    "link", // 插入链接
    "undo", // 撤销
    "redo", // 重复
  ],
  featureExtend: [
    "underline", // 下划线
    "strikeThrough", // 删除线
    "list", // 列表
    "table", // 表格
    "quote", // 引用
    "emoticon", // 表情
    "image", // 插入图片
    "video", // 插入视频
    "code", // 插入代码
  ],
  props: {
    content: {
      type: String,
      required: true,
    },
    eid: {
      type: String,
      required: true,
    },
    server: {
      type: String,
      default: "",
    },
    full: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      editor: null,
      inner: false,
    };
  },
  mounted() {
    let editor = (this.editor = new wangEditor(`#${this.eid}`));
    if (this.server) {
      editor.customConfig.uploadImgServer = this.server;
      editor.customConfig.uploadFileName = "file";
      editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
      editor.customConfig.uploadImgMaxLength = 1;
      editor.customConfig.uploadImgTimeout = 3000;
    }
    editor.customConfig.customAlert = (info) => {
      this.$alertWarn(info);
    };
    editor.customConfig.zIndex = 1000;
    editor.customConfig.menus = this.full
      ? this.$options.featureBase.concat(this.$options.featureExtend)
      : this.$options.featureBase;

    editor.create();
    editor.$textContainerElem[0].style.height = `${this.height}px`;

    editor.txt.html(this.content);

    this.$watch("content", function (n, o) {
      if (this.inner) {
        this.inner = false;
      } else {
        this.editor.txt.html(n);
      }
    });
    editor.$textElem[0].addEventListener("input", () => {
      this.inner = true;
      this.$emit("change", editor.txt.html());
    });
  },
};
</script>