<template>
  <div class="app-container">
    <div class="mains">
      <div class="cardtype-box">
        <div class="box-card-type">
          <span>酒店详情:</span>
          <span
            class="fon14 mgle10 card_tag_yellow"
            v-if="invoicedata.status == '营业中'"
            >{{ invoicedata.status }}</span
          >
        </div>
        <div class="box-card-btn" @click="clickreturn()">返回</div>
      </div>
      <div class="line"></div>
      <p class="fon12">申请时间：{{ invoicedata.createTime }}</p>
    </div>

    <div class="detailmain">
      <div class="detailmain-header">
        <div><span class="fonwei">酒店信息:</span></div>
      </div>
      <div class="detail-info mgbot20">
        <table class="vtable" cellpadding="0" cellspacing="0">
          <tr>
            <td>申请人</td>
            <td>联系方式</td>
          </tr>
          <tr>
            <td class="fon12">{{ invoicedata.contactName }}</td>
            <td class="fon12">{{ invoicedata.contactPhone }}</td>
          </tr>
          <!------------------------------------------------------------>
          <tr>
            <td>酒店名称</td>
            <td>酒店地址</td>
          </tr>
          <tr>
            <td class="fon12">{{ invoicedata.hotelName }}</td>
            <td class="fon12">{{ invoicedata.hotelAddrsssDetail }}</td>
          </tr>
          <!------------------------------------------------------------>
        </table>
      </div>
      <div class="fonwei">认证信息:</div>
      <div class="detail-info mgbot20">
        <table class="vtable" cellpadding="0" cellspacing="0">
          <tr>
            <td>营业执照</td>
            <td>
              <span v-if="invoicedata.status !== '审核失败'"
                >统一社会信用代码</span
              >
            </td>
          </tr>
          <tr>
            <td class="fon12">
              <el-image
                class="mgtp10"
                style="width: 50px; height: 50px"
                :lazy="true"
                :src="invoicedata.businessLicenseUrl"
                :preview-src-list="srcList"
                fit="contain"
              >
              </el-image>
            </td>
            <td class="fon12">
             <span class="mgri10">{{
                  invoicedata.socialUnifiedCreditCode
                }}</span>
            </td>
          </tr>
        </table>
      </div>
      <div class="detail-info">
        <div class="title fonwei">处理结果</div>
        <div class="detail-info mgbot20">
          <table class="vtable" cellpadding="0" cellspacing="0">
            <tr>
              <td>处理时间</td>
              <td>处理结果</td>
            </tr>
            <tr>
              <td class="fon12">{{ invoicedata.checkTime || "--" }}</td>
              <td class="fon12">{{ invoicedata.statu || "--" }}</td>
            </tr>
            <tr>
              <td>
                <span v-if="invoicedata.status == '审核失败'">拒绝原因</span>
              </td>
              <td></td>
            </tr>
            <tr>
              <td class="fon12">
                <span v-if="invoicedata.status == '审核失败'">{{
                  invoicedata.remark
                }}</span>
              </td>
              <td class="fon12"></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isSocialCode } from "@/utils/validate";
import { hotelGet } from "@/api/hotel/hotel";
export default {
  async created() {
    if (sessionStorage.hotelid) {
      this.searchdata.id = sessionStorage.hotelid;
    }
    await this.fetchData();
  },
  data() {
    return {
      // refusedia: false,
      noshow: false,
      invoicedata: {
        businessLicenseUrl:
          "https://meizhao.oss-cn-shanghai.aliyuncs.com/202107/5ac2177b765c4cc783d45d5b926a88b3.png"
      },
      srcList: [],
      searchdata: {
        id: "",
      }
    };
  },
  methods: {
    fetchData() {
      this.srcList = [];
      hotelGet(this.searchdata).then(respone => {
        if (respone.code == "0") {
          this.invoicedata = respone.data;
          switch (this.invoicedata.status) {
            case 1:
              this.invoicedata.status = "待审核";
              this.invoicedata.statu = "";
              this.noshow = true;
              break;
            case 2:
              this.invoicedata.status = "营业中";
              this.invoicedata.statu = "审核通过";
              this.noshow = false;
              break;
            case 3:
              this.invoicedata.status = "审核失败";
              this.invoicedata.statu = "审核失败";
              this.noshow = true;
              break;
            default:
              break;
          }
          this.srcList.push(this.invoicedata.businessLicenseUrl);
        }
      });
    },
    clickreturn() {
      sessionStorage.removeItem("hotelid");
      this.$router.go(-1);
    },
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  height: auto;
  color: #4d4f53;
  background-color: #fbfcfe;
}
::v-deep .el-table td,
.el-table th {
  padding: 5px 0;
}
.title {
  line-height: 50px;
}
.mains {
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 0 0 2px rgba($color: #000000, $alpha: 0.2);
}
.cardtype-box {
  display: flex !important;
  background-color: #fff;
  justify-content: space-between;
  border-radius: 2px;
  padding-bottom: 10px;
  .box-card-type {
    line-height: 30px;
  }
  .box-card-btn {
    cursor: pointer;
    font-size: 16px;
    line-height: 30px;
    width: 80px;
    border: 1px solid #e4e7ed;
    text-align: center;
    border-radius: 4px;
    transform: all 0.3s;
    &:hover {
      border-color: #409eff;
      color: #409eff;
    }
  }
}
.detailmain {
  height: calc(100% - 80px);
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba($color: #000000, $alpha: 0.2);
  .detailmain-header {
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    .detailmain-btn-box {
      padding-right: 20px;
    }
  }
  .detail-info {
    width: 100%;
    padding-top: 20px;
    table {
      width: 100%;
      height: 90px;
      margin-left: 10px;
    }
    td {
      width: 150px;
      line-height: 30px;
      height: 30px;
      tr {
        text-align: center;
        border-bottom: 1px solid #ebeef5;
      }
    }
  }
}
.num {
  display: inline-block;
  padding-left: 20px;
}
.svg-icon {
  margin-top: 10px;
  width: 2em;
  height: 2em;
  line-height: 30px;
  cursor: pointer;
}

::v-deep .dialog-box {
  span.el-dialog__title {
    font-size: 16px !important;
  }
}
::v-deep .el-image-viewer__canvas {
  margin-left: 100px !important;
}
.card_tag_yellow {
  color: #ffcc49;
}
::v-deep .el-image-viewer__mask {
  display: none !important;
  z-index: -1 !important;
}
::v-deep .el-image-viewer__img {
  max-width: 100% !important;
  max-height: 50% !important;
  margin-left: 200px;
}
::v-deep .el-image-viewer__close {
  top: 20%;
  right: calc(50% - 120px);
}
::v-deep .el-image-viewer__wrapper {
  width: 65%;
}

::v-deep .input-codebox .el-form-item.el-form-item--normal {
  margin-bottom: 0 !important;
}
::v-deep .el-image-viewer__btn {
  margin-left: 100px;
}
.refutit {
  margin-bottom: 20px;
}
::v-deep .el-dialog__body {
  padding: 30px 20px 0 20px !important;
}
</style>
