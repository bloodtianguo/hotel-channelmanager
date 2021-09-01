<template>
  <div :class="$options.name">
    <el-upload
      class="upload-el"
      accept="image/*"
      ref="fileUpload"
      name="file"
      drag
      :action="action"
      :data="uploadData"
      :on-change="selectChange"
      :show-file-list="false"
      :auto-upload="false"
      :http-request="httpRequest"
    >
      <div v-show="!resultImg">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>
      <figure v-show="resultImg" class="result-img">
        <img :src="resultImg" />
        <!-- <el-button @click="updateCropper">重新上传</el-button> -->
      </figure>
    </el-upload>
    <div class="el-upload__tip" slot="tip">
      只能上传jpg/png文件，且不超过500kb
    </div>
    <cropper
      v-if="showCropper"
      :dialog-visible="showCropper"
      :cropper-img="cropperImg"
      @update-cropper="updateCropper"
      @colse-dialog="closeDialog"
      @upload-img="uploadImg"
    />
  </div>
</template>

<script>
import Cropper from "./Cropper.vue";
import axios from "@/common/axios";
import { loading } from "@/common";
import { uploadImg } from "@/api/upload";
export default {
  name: "UploadImg",
  components: {
    Cropper
  },
  data() {
    return {
      uploadData: {
        fileName: ""
      },
      action: process.env.VUE_APP_BASE_UPLOAD + "/api/v1/basic/uploadFile", // 上传地址，必填
      cropperImg: "", // 需要裁剪的图片
      showCropper: false, // 是否显示裁剪框
      uploadFile: "", // 裁剪后的文件
      resultImg: "" // 上传成功，后台返回的路径
    };
  },
  methods: {
    // submit 之后会触发此方法
    httpRequest(request) {
      const { action, data, filename } = request;
      // 新建formDate对象
      let formData = new FormData();
      for (let key in data) {
        formData.append(key, data[key]);
      }
      // 文件单独push,第三个参数指定上传的文件名
      formData.append(filename, this.uploadFile, data.fileName);
      loading.start(); // 上传中的loading
      uploadImg(formData)
        .then(({ data: resp }) => {
          loading.close();
          const { code, data, msg } = resp || {};
          if (resp) {
            this.showCropper = false; //成功后关闭裁剪框
            this.cropperImg=""// 上传成功后清空需要裁剪的图片数据
            this.resultImg = resp; // 上传成功后展示的图片
            this.ESpass(); // 将图片地址传到父级组件
          }
        })
        .catch(err => {
          loading.close();
          console.log(err);
        });
    },
    // 选择文件
    selectChange(file) {
      const { raw, name } = file;
      this.openCropper(raw);
      this.uploadData.fileName = name;
    },
    /**
     * @param {file} 上传的文件
     */
    openCropper(file) {
      var files = file;
      let isLt500kb = files.size > 1024 * 500;
      let isImage =
        ["image/png", "image/jpg","image/jpeg"].indexOf(file.type) == -1;
      if (isLt500kb) {
        this.$message.error("请上传500kb内的图片");
        return false;
      }
       if (isImage) {
        this.$message.error("只支持上传jpg，png格式图片!");
        return false;
      }
      // console.log(file);
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.cropperImg = JSON.parse(JSON.stringify(data));
      };
      // 转化为base64
      reader.readAsDataURL(file)
      // 转化为blob
      // reader.readAsArrayBuffer(files);
      this.showCropper = true;
    },
    // 上传图片
    uploadImg(file) {
      this.uploadFile = file;
      this.$refs.fileUpload.submit();
    },
    // 更新图片
    updateCropper() {
      this.$refs.fileUpload.$children[0].$el.click();
    },
    // 关闭窗口
    closeDialog() {
      this.showCropper = false;
    },
    //向父级传图片链接地址
    ESpass() {
      this.$emit("getimgUrl", this.resultImg);
    },
    // 重置img
    clearimg(){
      this.resultImg=""
    }
  }
};
</script>

<style lang="scss" scoped>
.UploadImg {
  .el-upload {
    display: block;
    width: 100px;
    margin: 30px auto 0;
  }
}
</style>
