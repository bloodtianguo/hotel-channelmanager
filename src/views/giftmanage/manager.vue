<template>
  <div class="app-container">
    <div class="header-box">
      <headertit :headertit="headertit" />
      <div id="search_box mgbot20">
        <el-form
          :model="searchdata"
          ref="searchdata"
          size="normal"
          class="search"
        >
          <el-form-item label="订单状态：">
            <el-radio-group
              v-model="searchdata.putawayStatus"
              size="mini"
              class="hearder-radio"
            >
              <el-radio
                v-for="(item, index) in typelist"
                :key="index"
                :label="item.val"
                @change="clickSearch()"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
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
            <el-form-item>
              <el-input
                size="mini"
                placeholder="请输入礼包名称"
                v-model="searchdata.spreeName"
                @clear="clickSearch()"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" @click="clickSearch()">搜索</el-button>
              <el-button type="primary" size="mini" @click="clickReset()"
                >重置</el-button
              >
              <el-button type="success" size="mini" @click="clickadd()"
                >新增礼包</el-button
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
          :max-height="550"
          :height="550"
          :row-class-name="tableRowClassName"
          :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column
            prop="spreeName"
            align="center"
            :resizable="false"
            label="礼包名称"
            show-overflow-tooltip
          />
          <el-table-column
            prop="spreeTitle"
            align="center"
            :resizable="false"
            label="副标题"
            show-overflow-tooltip
          />
          <el-table-column
            prop="spreeIcon"
            align="center"
            width="70"
            :resizable="false"
            label="图片"
          >
            <template slot-scope="scope">
              <el-popover placement="right" trigger="click">
                <el-image
                  style="width: 150px; height: 150px"
                  :src="scope.row.spreeIcon"
                  fit="cover"
                ></el-image>
                <el-image
                  slot="reference"
                  class="cp-hand"
                  style="height: 100%"
                  :src="scope.row.spreeIcon"
                  fit="cover"
                  :key="scope.row.spreeIcon"
                ></el-image>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="salesNumber"
            align="center"
            :resizable="false"
            label="赠送数量"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="putawayStatu"
            align="center"
            :resizable="false"
            label="状态"
          >
          </el-table-column>
          <el-table-column
            prop="updateTime"
            align="center"
            width="180"
            :resizable="false"
            label="最后修改时间"
            show-overflow-tooltip
          />
          <!-- 操作 -->
          <el-table-column
            label="操作"
            width="230"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scope">
               <el-button
                type="warning"
                size="mini"
                v-if="scope.row.putawayStatu == '下架'"
                @click="offlineup(scope.row)"
                >上架</el-button
              >
              <el-button
                type="danger"
                size="mini"
                v-if="scope.row.putawayStatu == '上架'"
                @click="offline(scope.row)"
                >下架</el-button
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
    <!-- 添加礼包 -->
    <el-dialog
      title="新增礼包"
      :visible.sync="addshow"
       width="30%"
      :close-on-click-modal="false"
      :before-close="handleClose"
      @closed="addclosed"
    >
      <el-form
        :model="adddata"
        ref="adddata"
        label-width="100px"
        :rules="rules"
        class="demo-ruleForm"
      >
        <el-form-item label="礼包名称：" prop="spreeName">
          <el-input
            maxlength="10"
            v-model="adddata.spreeName"
            placeholder="请输入礼包名称"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="副标题：" prop="spreeTitle">
          <el-input
            maxlength="8"
            v-model="adddata.spreeTitle"
            placeholder="请输入礼包副标题"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="礼包图片：" prop="spreeIcon">
          <upload @getimgUrl="changeimg" ref="uploadimg"/>
        </el-form-item>
        <el-form-item label="状态：" prop="putawayStatus">
          <el-radio-group v-model="adddata.putawayStatus" size="mini">
            <el-radio
              v-for="(item, index) in typelistadd"
              :key="index"
              :label="item.val"
              @change="clickSearch()"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addclose()">取 消</el-button>
        <el-button type="primary" @click="handleOk()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { relationList, spreeAdd, spreeOffline,spreeonline } from "@/api/gift/gift";
import upload from "@/components/UploadImg"; //引入上传

export default {
  components: {
    upload
  },
  created() {
    this.fetchData();
  },
  data() {
    return {
      srcList: [], //点击方法图片数组
      // 验证
      rules: {
        spreeName: [
          { required: true, message: "请输入礼包名称", trigger: "blur" }
        ],
        spreeTitle: [
          { required: true, message: "请输入副标题", trigger: "change" }
        ],
        spreeIcon: [
          { required: true, message: "请上传礼包图片", trigger: "change" }
        ],
        putawayStatus: [
          { required: true, message: "请选择状态", trigger: "change" }
        ]
      },
      addshow: false,
      headertit: "礼包列表",
      filename: "礼包管理", //导出的文件名
      tHeader: [
        "礼包名称",
        "副标题",
        "图片",
        "赠送数量",
        "状态",
        "最后修改时间"
      ], //导出组件头部
      filterVal: [
        "spreeName",
        "spreeTitle",
        "spreeIcon",
        "salesNumber",
        "putawayStatus",
        "reservePhone"
      ], //导出组件头部对应值
      multipleSelection: [],
      loading: false,
      sear_PayDate: [], //时间选择器时间
      time: "", //快捷选择下单时间
      total: 0,
      searchdata: {
        page: 1,
        rows: 10,
        putawayStatus: "",
        spreeName: "" //礼包名称(字段需修改)
      },
      searchinit: {
        page: 1,
        rows: 10,
        putawayStatus: "",
        spreeName: ""
      },
      typelistadd: [
        { val: 1, label: "上架" },
        { val: 0, label: "下架" }
      ],
      typelist: [
        { val: "", label: "全部" },
        { val: 1, label: "上架" },
        { val: 0, label: "下架" }
      ],
      adddata: {
        spreeName: "", //礼包名称
        spreeTitle: "", //礼包副标题
        spreeIcon: "", //礼包图片
        putawayStatus: 1 //状态
      },
      tableData: [],
      // 上下架
      spreedata: {
        id: ""
      }
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
    fetchData() {
      this.loading = true;
      relationList(this.searchdata).then(response => {
        if (response.code == 0) {
          this.loading = false;
          if (response.data) {
            this.total = response.data.total;
            this.tableData = response.data.records.map(item => {
              if(item.updateTime){
              item.updateTime=this.changedata(item.updateTime)
              }
              switch (item.putawayStatus) {
                case 1:
                  item.putawayStatu="上架"
                  break;
               case 0:
                  item.putawayStatu="下架"
                  break;
                default:
                  break;
              }
              return item;
            });
          } else {
            this.total = 0;
            this.tableData = [];
          }
        }
      });
    },
    clickSearch() {
      this.searchdata.page=1
      this.fetchData();
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
    /*----------------------------------------------------*/
    // 图片上传成功后的地址
    changeimg(val) {
      if (val) {
        this.adddata.spreeIcon = val;
      }
    },
    clickadd() {
      this.addshow = true;
    },
    // 添加弹窗关闭
    handleClose() {
      this.$refs.adddata.resetFields()
      this.addshow = false;
    },
    addclose(){
      this.addshow = false;
      this.$refs.adddata.resetFields()
    },
    addclosed(){
      this.$refs.uploadimg.clearimg()//清空组件中的img
      this.$refs.uploadimg.clearFiles()//清空组件上传的文件数组
      this.$refs.adddata.resetFields()
    },
    handleOk() {
      this.$refs.adddata.validate(valid => {
        if (valid) {
          // 发送添加接口
          spreeAdd(this.adddata).then(response => {
            if (response.code == 0) {
              this.Success("新增礼包成功");
              this.fetchData();
              this.addshow = false;
      this.$refs.adddata.resetFields()
            }
          });
        } else {
          return false;
        }
      });
    },
    /*----------------------------------------------------*/
    //上架
    offlineup(row){
       this.spreedata.id = row.id;
        spreeonline(this.spreedata).then(response => {
          if (response.code == 0) {
            this.Success("上架成功");
            this.spreedata.id =""
            this.fetchData()
          }
        });
    },
    // 下架
    offline(row) {
      this.$confirm("下架后无法在视频中展示哦", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.spreedata.id = row.id;
        spreeOffline(this.spreedata).then(response => {
          if (response.code == 0) {
            this.Success("下架成功");
            this.spreedata.id =""
            this.fetchData()
          }
        });
      });
    },
    handleSizeChange(pageSize) {
      this.searchdata.rows = pageSize;
      this.fetchData();
    },
    handleCurrentChange(curPage) {
      this.searchdata.page = curPage;
      this.fetchData();
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  height: auto;
}
.hearder-radio ::v-deep .el-radio__inner {
  display: none !important;
}
.dateline {
  display: inline-block;
  width: 30px;
  height: 2px;
  background-color: #dcdfe6;
  margin: 0 5px;
}
.search .el-form-item {
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
::v-deep .el-table__body-wrapper{
  overflow-y: auto !important;
}
</style>
