<template>
  <div>
    <div class="userMsg">
      <h1>用户中心</h1>
      <h3>{{userInfo.nickName}}</h3>
    </div>

    <div class="drag" ref="drag">
      <input type="file" name="file" @change="fileHandle" />
    </div>
    <div>
      <el-progress :text-inside="true" :stroke-width="26" :percentage="progress"></el-progress>
    </div>
    <div class="uploadView">
      <el-button @click="uploadFile">上传</el-button>
    </div>
  </div>
</template>

<script>
import { log } from "util";
import { resolve } from "url";
export default {
  data() {
    return {
      userInfo: {},
      progress: 0
    };
  },
  mounted() {
    this.getData();
    this.dragEvent();
  },
  methods: {
    dragEvent() {
      let drag = this.$refs.drag;
      drag.addEventListener("dragover", e => {
        drag.style.borderColor = "red";
        e.preventDefault();
      });
      drag.addEventListener("dragleave", e => {
        drag.style.borderColor = "#eee";
        e.preventDefault();
      });
      drag.addEventListener("drop", e => {
        let fileList = e.dataTransfer.files;
        this.file = fileList[0];
        drag.style.borderColor = "#eee";
        e.preventDefault();
      });
    },
    async getData() {
      let res = await this.$http.get("/user/info");
      this.userInfo = res.data;
    },
    async blobToString(blob) {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => {
          console.log(reader.result);
          const ret = reader.result
            .split("")
            .map(v => v.charCodeAt())
            .map(v => v.toString(16).toUpperCase())
            .map(v => v.padStart(2, "0"))
            .join(" ");
          resolve(ret);
        };
        reader.readAsBinaryString(blob);
      });
    },
    async isJpg(file) {
      let len = file.size;
      let start = await this.blobToString(file.slice(0, 2));
      let end = await this.blobToString(file.slice(-2, len));
      const isjpg = start == "FF D8" && end == "FF D9";
      return isjpg;
    },
    async isPng(file) {
      let ret = await this.blobToString(file.slice(0, 8));
      const ispng = ret == "89 50 4E 47 0D 0A 1A 0A";
      console.log(ispng);

      return ispng;
    },
    async isGif(file) {
      let ret = await this.blobToString(file.slice(0, 6));
      const isgif = ret == "47 49 46 38 39 61" || ret == "47 49 46 38 37 61";
      return isgif;
    },
    async isImage(file) {
      return (
        (await this.isGif(file)) ||
        (await this.isPng(file)) ||
        (await this.isJpg(file))
      );
    },
    async uploadFile() {
      // if (!(await this.isImage(this.file))) {
      //   console.log("图片格式错误");
      //   this.$message.error("图片格式错误");
      //   return;
      // }
      const form = new FormData();
      form.append("name", "file");
      form.append("file", this.file);
      let res = await this.$http.post("/uploadfile", form, {
        onUploadProgress: pro => {
          this.progress = Number(((pro.loaded / pro.total) * 100).toFixed(2));
        }
      });
      console.log(res);
    },
    fileHandle(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.progress = 0;
      this.file = file;
    }
  }
};
</script>

<style>
.userMsg {
  text-align: center;
}
.drag {
  width: 100%;
  height: 90px;
  border: 1px dashed #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
}
.uploadView {
  margin: 10px;
  text-align: center;
}
</style>