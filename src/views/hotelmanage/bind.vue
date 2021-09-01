<template>
  <div class="app-container">
    <div class="header-box">
      <headertit :headertit="headertit" />
      <div id="search_box">
        <div class="form_second">
          <el-form
            :model="searchdata"
            ref="searchdata"
            size="normal"
            :inline="true"
            label-position="left"
            label-width="90px"
          >
            <el-form-item style="margin-right:20px">
              <el-input
                size="mini"
                placeholder="请输入酒店名称"
                v-model="searchdata.hotelName"
                @clear="fetchData()"
                clearable
              />
            </el-form-item>
            <el-form-item style="margin-right:20px">
              <el-input
                size="mini"
                placeholder="请输入授权码"
                style="width:180px"
                v-model="searchdata.authCode"
                @clear="fetchData()"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" @click="fetchData()">搜索</el-button>
              <el-button type="primary" size="mini" @click="bindopen()"
                >绑定酒店</el-button
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
          max-height="650"
          height="650"
          :row-class-name="tableRowClassName"
          :header-cell-style="{ background: '#F3F5FA', color: '#000' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column
            prop="hotelName"
            align="center"
            :resizable="false"
            label="酒店名称"
            show-overflow-tooltip
          />
          <el-table-column
            prop="authCode"
            align="center"
            width="590"
            :resizable="false"
            label="授权码"
            show-overflow-tooltip
          />
          <el-table-column
            prop="createTimes"
            align="center"
            :resizable="false"
            label="添加时间"
            show-overflow-tooltip
          />
          <!-- 操作 -->
          <el-table-column
            label="操作"
            width="230"
            :resizable="false"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="warning"
                size="mini"
                @click="clickunbind(scope.row)"
                >解绑</el-button
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
    <!-- 绑定弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      @closed="closebind()"
      width="30%"
      title="绑定酒店"
      :visible.sync="bindshow"
    >
      <el-form :model="binddate" ref="binddate" :rules="rules" size="normal">
        <el-form-item label="绑定酒店：" label-width="120" prop="bindstate">
          <el-radio-group
            v-model="binddate.bindstate"
            size="mini"
            @change="changebind"
          >
            <el-radio
              v-for="(item, index) in typelist"
              :key="index"
              :label="item.val"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="授权码："
          label-width="120"
          prop="authCode"
          v-if="!binddate.bindstate"
          :error="auchErr"
        >
          <el-input
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 4 }"
            resize="none"
            style="width:80%"
            maxlength="64"
            show-word-limit
            placeholder="请输入授权码"
            v-model="binddate.authCode"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="批量授权码："
          label-width="120"
          :error="uploadErr"
          prop="updatestate"
          v-else
        >
          <uploadExcel @getupstate="changeupstate" @upstateshow="changeshow" ref="uploadExcel" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindshow = false">取 消</el-button>
        <el-button type="primary" @click="bindok()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { relationList, relabind, relaunbind } from "@/api/hotel/bind";
import uploadExcel from "@/components/uploadExcel"; //引入上传exelc
export default {
  components: {
    uploadExcel
  },
  created() {
    this.fetchData();
  },
  data() {
    return {
      rules: {
        bindstate: [
          { required: true, message: "请输入选择绑定方式", trigger: "blur" }
        ],
        authCode: [
          { required: true, message: "请输入授权码", trigger: "change" }
        ],
        updatestate: [
          { required: false, message: "请选择表格", trigger: "change" }
        ]
      },

      bindshow: false,
      headertit: "绑定管理",
      filename: "绑定管理", //导出的文件名
      loading: false,
      total: 0,
      tHeader: ["酒店名称", "授权码", "添加时间"], //导出组件头部
      filterVal: ["hotelName", "authCode", "createTimes"], //导出组件头部对应值
      multipleSelection: [],
      searchdata: {
        _uid: Number(sessionStorage.userId),
        page: 1,
        rows: 10,
        hotelName: "",
        authCode: ""
      },
      tableData: [],
      typelist: [
        { val: 0, label: "单个绑定" },
        { val: 1, label: "批量绑定" }
      ],
      //是否上传验证
      uploadErr: null,
      auchErr:null,
      binddate: {
        bindstate: 0,
        authCode: "",
        updatestate: false
      }
    };
  },
  methods: {
    changeupstate(val) {
      this.binddate.updatestate = val;
      if (this.binddate.updatestate) {
        this.fetchData();
      }
    },
    changeshow(val){
      this.bindshow = val;
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else if (rowIndex % 2 !== 0) {
        return "success-row";
      }
      return "";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取列表数据
    fetchData() {
      relationList(this.searchdata).then(response => {
        if (response.code == 0) {
          if (response.data.records) {
            this.tableData = response.data.records.map(item => {
              item.createTimes = this.changedata(item.createTime);
              return item;
            });
            this.total = response.data.total;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        }
      });
    },
    closebind() {
      this.binddate.bindstate = 0;
    },
    changebind() {
      if (this.binddate.bindstate) {
        this.binddate.authCode=""
        this.auchErr=null
        this.$refs['binddate'].clearValidate();
      }else{
        this.uploadErr=null
      }
    },
    clickunbind(row) {
      this.$confirm("你真的要解绑该酒店？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          relaunbind(row).then(response => {
            if (response.code == 0) {
              this.Success("解绑成功");
              this.fetchData();
            }
          });
        })
        .catch(() => {
          this.Infos("已取消解绑");
        });
    },
    /*-------------------------------------*/
    bindopen() {
      this.bindshow = true;
      this.$nextTick(() => {
        this.$refs.binddate.resetFields();
        this.$refs.uploadExcel.clearlist();
      });

    },
    bindclose() {
      this.bindshow = false;
      this.binddate.updatestate = false;
    },
    // 单个绑定函数
    singbind() {
      this.$refs.binddate.validate(valid => {
        if (valid) {
          relabind(this.binddate).then(response => {
            if (response.code == 0) {
              this.Success("绑定成功");
              this.$refs.binddate.resetFields();
              this.bindshow = false;
              this.fetchData();
            }
          });
        } else {
          return false;
        }
      });
    },
    bindok() {
      if (!this.binddate.bindstate) {
        // 单个绑定
        this.singbind();
      } else {
        // 多个绑定
        if (this.binddate.updatestate == "成功") {
          this.uploadErr = null;
          this.$refs.uploadExcel.upload();
        } else if (this.binddate.updatestate == false) {
          this.$nextTick(() => {
            this.uploadErr = "请选取上传表格";
          });
        }
      }
    },

    clearmultiple() {
      this.$refs.tableData.clearSelection();
    }, //重置勾选状态
    handleSizeChange(pageSize) {
      this.searchdata.rows = pageSize;
      this.fetchData();
    },
    handleCurrentChange(curPage) {
      this.searchdata.page = curPage;
      this.fetchData();
    }
  },
  watch: {
    "binddate.updatestate": function(val, oldval) {
      if (val == "成功") {
        this.uploadErr = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form_second {
  display: flex;
  justify-content: start;
}
.export {
  padding-top: 7px;
}
::v-deep .el-textarea .el-input__count {
  line-height: 20px !important;
}
</style>
