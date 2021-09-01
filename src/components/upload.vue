<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="ITEMS_UP_IMG"
      :show-file-list="false"
      :multiple="false"
      :on-success="handleVideoSuccess"
      :on-error="uperror"
      drag
      :before-upload="beforeUploadImg"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
      <!-- <el-image class="avatar" v-if="imgUrl" :src="imgUrl" fit="contain"></el-image>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <span slot="tip" class="el-upload__tip marginle10"
        >只能上传png/jpg文件,且不超过500KB</span
      > -->
    </el-upload>
  </div>
</template>

<script>
import { ITEMS_UP_IMG } from "@/utils/request_upload";
import { Success, Infos, Warning } from "@/utils/tools/message.js";
export default {
  data() {
    return {
      imgUrl: "",
      ITEMS_UP_IMG: ITEMS_UP_IMG
    };
  },
  methods: {
    // 上传成功时函数
    handleVideoSuccess(res, file) {
      if (res.code == "0") {
        this.imgUrl = res.data;
        this.ESpass();
        Success("上传图片成功!");
      } else {
        this.$message.error("图片上传失败!");
      }
    },
    // 上传前函数
    beforeUploadImg(file) {
      const isImage =
        ["image/png", "image/jpg", "image/jpeg"].indexOf(file.type) == -1;
      const isLt500kb = file.size / 1024 / 500;
      if (isImage == true) {
        this.$message.error("只支持上传PDF、bmp、jpg，png格式!");
        this.fileList = [];
      }
      if (!isLt500kb) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return !isImage && isLt500kb;
    },
    uperror(err, file, fileList) {
      this.$message.error("图片上传失败!");
    },
    // 点击向父级传值
    ESpass() {
      this.$emit("getimgUrl", this.imgUrl);
    },
    clear() {
      this.imgUrl = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.el-upload {
  display: block;
}

.el-upload__tip{
 text-indent: 1em;
}
</style>
