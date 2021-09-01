<template>
  <div class="up-main">
    <div class="uploadicon">
      <i class="el-icon-upload col97"></i>
    </div>
    <div class="uploadbox">
      <p class="uptitle colclc fon12">支持上传xlsx文件,表头为授权码</p>
      <div class="uploadbox-main">
        <el-upload
          ref="upload"
          class="avatar-uploader"
          :action="ITEMS_UP_IMG"
          :auto-upload="false"
          :show-file-list="true"
          :headers="myHeaders"
          :multiple="false"
          :on-success="handleVideoSuccess"
          :on-error="uperror"
          :on-remove="handleRemove"
          :on-change="changeUploadImg"
        >
          <span class="uptext col1ce fon14">上传文件</span>
        </el-upload>
        <span class="downmod col97 fon14 cp-hand" @click="handleDownload"
          >下载模板</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ITEMS_UP_IMG } from "@/utils/request_hotel";
import { Success, Infos, Warning } from "@/utils/tools/message.js";
import { getToken } from "@/utils/auth";
// var token =  localStorage.getItem('token') // 要保证取到
export default {
  created() {
    this.$emit("getupstate", false);
  },
  data() {
    return {
      myHeaders: { Authorization: "Bearer " + getToken() },
      ITEMS_UP_IMG: ITEMS_UP_IMG,
      tableData: [{ index: "此处填写授权码" }]
    };
  },
  methods: {
    //导出模板
    handleDownload() {
      import("@/utils/Export2Excel").then(excel => {
        const filterVal = ["index"]; //需要导出的
        const list = this.tableData;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: ["授权码"],
          data,
          filename: "批量绑定酒店授权码"
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    // 上传成功时函数
    handleVideoSuccess(res, file) {
      if (res.code == "0") {
        Success("上传成功!");
        setTimeout(() => {
          this.$emit("upstateshow", false);
        }, 500);
        this.ESpass();
      } else {
        this.$message.error(res.msg);
      }
    },
    //移除文件时
    handleRemove(file, fileList) {
      this.$emit("getupstate", false);
      this.Infos("文件已移除");
    },
    // 上传前函数
    changeUploadImg(file, fileList) {
      if (fileList.length > 1) {fileList.splice(0, 1)}//删除第一个选取的文件
      var reg = /^.*\.(?:xls|xlsx)$/i; //文件名可以带空格
      if (!reg.test(file.name)) {
        this.$message.error("请上传excel格式的文件!");
        this.$refs.upload.clearFiles();
        return false;
      }
      this.ESpass();
    },
    uperror(err, file, fileList) {
      this.$emit("getupstate", false);
      this.$message.error("上传失败!");
    },
    error() {
      this.$emit("getupstate", false);
    },
    // 点击向父级传值
    ESpass() {
      this.$emit("getupstate", "成功");
    },
    // 由父组件调用上传
    upload() {
      this.$refs.upload.submit();
    },
    //清空上传列表
    clearlist() {
      this.$emit("getupstate", false);
      console.log(111);
      this.$refs.upload.clearFiles();
    }
  }
};
</script>

<style lang="scss" scoped>
.up-main {
  width: 80%;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  border: 1px dashed #dcdfe6;
  border-radius: 5px;
  .uploadicon {
    border-radius: 5px;
    width: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 35px;
  }
  .uploadbox {
    padding: 0 10px;
    flex: 1;
    .uptitle {
      line-height: 20px;
      margin: 0;
    }
    .downmod {
      height: 30px;
      &:hover {
        border-bottom: 1px solid #971cfe;
      }
    }
    .uploadbox-main {
      display: flex;
      justify-content: space-between;
    }
  }
}
.el-upload {
  display: block;
}

.el-upload__tip {
  text-indent: 1em;
}
.uptext:hover {
  border-bottom: 1px solid #1cede7;
}
</style>
