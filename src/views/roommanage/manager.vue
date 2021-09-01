<template>
  <div class="app-container">
    <div class="header-box">
      <headertit :headertit="headertit" />
      <div id="search_box mgbot20">
        <el-form :model="searchdata" ref="searchdata" size="normal">
          <el-form-item label="审核状态：">
            <el-radio-group v-model="searchdata.checkStatus" size="mini">
              <el-radio
                v-for="(item, index) in typelist"
                :key="index"
                :label="item.val"
                @change="clickSearch()"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="销售状态：">
            <el-radio-group v-model="searchdata.status" size="mini">
              <el-radio
                v-for="(item, index) in secondlist"
                :key="index"
                :label="item.val"
                @change="clickSearch()"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="申请时间：">
            <el-date-picker
              size="mini"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="searchdata.startTime"
              type="date"
              placeholder="开始时间"
            />
            <span class="dateline"></span>
            <el-date-picker
              size="mini"
              @change="changeendtime()"
              value-format="yyyy-MM-dd"
              v-model="searchdata.endTime"
              type="date"
              placeholder="结束时间"
            />
          </el-form-item>
        </el-form>
        <div class="form_second">
          <el-form
            :model="searchdata"
            ref="searchdata"
            size="normal"
            :inline="true"
            label-position="left"
          >
            <el-form-item style="margin-right:20px">
              <el-input
                size="mini"
                placeholder="请输入酒店名称"
                v-model="searchdata.hotelName"
                @clear="clickSearch()"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" @click="clickSearch()">搜索</el-button>
              <el-button type="primary" size="mini" @click="clickReset()"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
          <div class="export">
            <selectexeport
              :filename="filename"
              :multipleSelection="multipleSelection"
              :tHeader="tHeader"
              :filterVal="filterVal"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="main-box">
      <div class="tab_box">
        <el-table
          :data="tableData"
          ref="tableData"
          v-loading="loading"
          element-loading-text="数据加载中"
          border
          max-height="500"
          height="500"
          :row-class-name="tableRowClassName"
          :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column
            prop="hotelName"
            align="center"
            label="酒店名称"
            width="120"
            show-overflow-tooltip
            :resizable="false"
          />
          <el-table-column
            prop="roomName"
            align="center"
            label="房型名称"
            :resizable="false"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="roomVideoUrl"
            align="center"
            label="视频"
            :resizable="false"
            width="100"
          >
            <template slot-scope="scope">
              <svg-icon icon-class="video" @click="clickvideo(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column
            :prop="lable.pro"
            align="center"
            :label="lable.labels"
            :resizable="false"
            v-for="lable in tablist"
            :key="lable.labels"
            show-overflow-tooltip
          />
          <el-table-column
            prop="createTimes"
            align="center"
            label="申请时间"
            :resizable="false"
            width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="checkTimes"
            align="center"
            label="审核时间"
            :resizable="false"
            width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="checkStatu"
            align="center"
            label="审核状态"
            :resizable="false"
            width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span class="col1ce" v-if="scope.row.checkStatu == '待审核'">{{
                scope.row.checkStatu
              }}</span>
              <span class="col333" v-if="scope.row.checkStatu == '审核通过'">{{
                scope.row.checkStatu
              }}</span>
              <span class="colf5" v-if="scope.row.checkStatu == '违规下架'">{{
                scope.row.checkStatu
              }}</span>
              <span class="colred" v-if="scope.row.checkStatu == '审核拒绝'">{{
                scope.row.checkStatu
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="statu"
            align="center"
            label="销售状态"
            :resizable="false"
            width="120"
            show-overflow-tooltip
          />
          <!-- 操作 -->
          <el-table-column
            label="操作"
            :resizable="false"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="info"
                size="mini"
                @click="clickDetails(scope.row)"
                >详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div id="paging" style="margin-top: 30px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchdata.page"
          :page-sizes="[10, 20, 50, 100, 1000]"
          :page-size="searchdata.rows"
          background
          layout="prev,pager,next,total,sizes"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <!--弹窗盒子-->
    <div class="dialog-box">
      <el-dialog
        title="视频"
        :visible.sync="videodialog"
        width="300px"
        @close="videodialog = false"
        @closed="closevideo()"
        :close-on-click-modal="false"
      >
        <video
          width="260"
          height="350"
          ref="video"
          :src="videodata.roomVideoUrl"
          controlslist="nofullscreen nodownload noremoteplayback"
          controls
        ></video>
        <span slot="footer" class="dialog-footer">
          <el-button @click="videodialog = false">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { roomlist } from "@/api/room/room";
import { switchtypeFin } from "@/utils/tools/switchfin";
export default {
  created() {
    this.fetchData(true);
  },
  data() {
    return {
      videodialog: false,
      headertit: "房型管理",
      filename: "房型管理", //导出的文件名
      tHeader: [
        "酒店名称",
        "房型名称",
        "视频",
        "房间数量",
        "可住人数",
        "销售价(元)",
        "优惠价(元)",
        "申请时间",
        "审核时间",
        "审核状态",
        "销售状态"
      ], //导出组件头部
      filterVal: [
        "hotelName",
        "roomName",
        "roomVideoUrl",
        "roomNumber",
        "roomResideNumber",
        "roomPrice",
        "roomSalePrice",
        "createTimes",
        "checkTimes",
        "checkStatu",
        "statu"
      ], //导出组件头部对应值
      multipleSelection: [],
      loading: false,
      sear_PayDate: [], //时间选择器时间
      time: "", //快捷选择下单时间
      total: 0,
      searchdata: {
        page: 1,
        rows: 20,
        checkStatus: "", //房间审核状态
        status: "", //房间状态
        startTime: "",
        endTime: "",
        hotelName: ""
      },
      searchinit: {
        page: 1,
        rows: 20,
        checkStatus: "",
        status: "",
        startTime: "",
        endTime: "",
        hotelName: ""
      },
      videodata: {},
      tablist: [
        { pro: "roomNumber", labels: "房间数量" },
        { pro: "roomResideNumber", labels: "可住人数" },
        { pro: "roomPrice", labels: "销售价(元)" },
        { pro: "roomSalePrice", labels: "优惠价(元)" }
      ],
      typelist: [
        { val: "", label: "全部" },
        { val: 1, label: "待审核" },
        { val: 2, label: "审核成功" },
        { val: 3, label: "审核拒绝" },
        { val: 4, label: "违规下架" }
      ],
      secondlist: [
        { val: "", label: "全部" },
        { val: 1, label: "上架" },
        { val: 2, label: "下架" }
      ],
      tableData: []
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else if (rowIndex % 2 !== 0) {
        return "success-row";
      }
      return "";
    },
    /*----------------------------------------------------*/
    changeendtime() {
      if (this.searchdata.endTime) {
        this.searchdata.endTime = `${this.searchdata.endTime} 23:59:59`;
      }
      if (this.searchdata.startTime && this.searchdata.endTime) {
        if (
          !this.timeCompare(this.searchdata.startTime, this.searchdata.endTime)
        ) {
          this.searchdata.endTime = "";
          this.Warning("结束时间不能早于开始时间!");
        }
      }
    },
    changeSephone() {
      let value = this.searchdata.reservePhone;
      if (value.length == 1) {
        this.searchdata.reservePhone = value.replace(/[^0-9]/g, "");
      } else {
        this.searchdata.reservePhone = value.replace(/\D/g, "");
      }
    },
    fetchData(val) {
      this.loading = val;
      roomlist(this.searchdata).then(response => {
        if (response.code == "0") {
          this.loading = false;
          this.total = response.data.total;
          this.tableData = response.data.records.map(item => {
            // 格式化时间
            if (item.createTime) {
              item.createTimes = item.createTime;
            }
            if (item.checkTime) {
              item.checkTimes = item.checkTime;
            }
            // 审核状态 1-待审核，2-审核通过，3-审核失败，4-违规下级
            switch (item.checkStatus) {
              case 1:
                item.checkStatu = "待审核";
                break;
              case 2:
                item.checkStatu = "审核通过";
                break;
              case 3:
                item.checkStatu = "审核拒绝";
                break;
              case 4:
                item.checkStatu = "违规下架";
                break;
              default:
                break;
            }
            //销售状态
            switch (item.status) {
              case 1:
                item.statu = "上架";
                break;
              case 2:
                item.statu = "下架";
                break;
              default:
                break;
            }
            return item;
          });
          this.loading = false;
        }
      });
    },
    // table中点击视频
    clickvideo(row) {
      this.videodialog = true;
      this.videodata = row;
      this.$nextTick(() => {
        this.$refs.video.play();
        this.$refs.video.disablePictureInPicture=true
      });
    },
    closevideo() {
      this.$refs.video.pause();
      this.videodata = "";
    },
    clickSearch() {
      if (!this.searchdata.startTime) {
        this.searchdata.endTime = "";
      }
      if (!this.searchdata.endTime) {
        this.searchdata.startTime = "";
      }
      this.searchdata.page = 1;
      this.fetchData(false);
    },
    clickReset() {
      this.searchdata = JSON.parse(JSON.stringify(this.searchinit));
      this.time = "";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    clearmultiple() {
      this.$refs.tableData.clearSelection();
    }, //重置勾选状态
    // 点击详情
    clickDetails(row) {
      sessionStorage.roomid = row.id;
      this.$router.push("/roommanage/details");
    },
    handleSizeChange(pageSize) {
      this.searchdata.rows = pageSize;
      this.fetchData(false);
    },
    handleCurrentChange(curPage) {
      this.searchdata.page = curPage;
      this.fetchData(false);
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  height: auto;
}
::v-deep .el-radio__inner {
  display: none !important;
}
.dateline {
  display: inline-block;
  width: 30px;
  height: 2px;
  background-color: #dcdfe6;
  margin: 0 5px;
}
.el-form-item {
  margin-bottom: 10px;
}
::v-deep .el-table td,
.el-table th {
  padding: 5px 0;
}
.form_second {
  display: flex;
  justify-content: start;
}
.export {
  padding-top: 5px;
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
</style>
