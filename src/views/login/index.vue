<template>
  <div class="login-container">
    <div class="right-cont-scan">
      <div class="title">
        <p style="color:#333333">{{ loginMode == 1 ? "二维码登录" : "欢迎登录" }}</p>
        <img
          class="icon"
          src="../../assets/images/zhanghao.png"
          v-show="loginMode == 1"
          @click="cutLoginMode('1')"
        />
        <img
          class="icon"
          src="../../assets/images/qrcode.png"
          v-show="loginMode == 2"
          @click="cutLoginMode('2')"
        />
      </div>
      <div v-show="loginMode == 1">
        <div class="scan">
          <div ref="qrCode" id="qrCode" class="scan-can"></div>
          <div class="overtimeTip" v-show="qrOverTime" @click="refreshQr">
            <p>二维码失效</p>
            <p>请点击刷新</p>
          </div>
        </div>
        <div class="tips">
          <p>打开没找APP点击"扫一扫"</p>
          <p>扫码二维码登录</p>
        </div>
      </div>
      <!--手机验证码登录-->
      <div class="sans" v-show="loginMode == 2">
        <div class="main">
          <el-form
            :model="loginData"
            ref="loginData"
            hide-required-asterisk
            :rules="rules"
          >
            <el-form-item prop="phone" :error="phoneErr">
              <el-input
                ref="phonenum"
                placeholder="请输入手机号"
                maxlength="11"
                onkeyup="value=value.replace(/[^\d\.]/g,'')"
                v-model="loginData.phone"
                class="inputcon"
                size="medium"
              >
                <template slot="prepend">
                  <img class="phone-icon" src="../../assets/images/phone.png" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="phoneSms">
              <el-input
                placeholder="请输入验证码"
                maxlength="4"
                onkeyup="value=value.replace(/[^\d\.]/g,'')"
                v-model="loginData.phoneSms"
                class="inputcon"
                size="medium"
              >
                <template slot="prepend">
                  <img class="phone-icon" src="../../assets/images/dun.png" />
                </template>
                <template slot="append">
                  <span @click="onGetValidate">
                    {{
                      myTime === undefined ? "获取验证码" : times + "秒"
                    }}</span
                  >
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div
          @click="loginHandler()"
          id="handle-login"
          :class="{ 'btn-disabed': loginData.phone && loginData.phoneSms }"
        >
          登录
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import { Message } from "element-ui";
import { getSms, login } from "@/api/user";
let setRemUnit;
let pageshow;
let rem;
function setRem(window, document) {
  let docEl = document.documentElement;
  setRemUnit = function() {
    if (docEl.clientWidth < 1200) return;
    rem = docEl.clientWidth / 10;
    docEl.style.fontSize = rem + "px";
  };
  pageshow = function(e) {
    if (e.persisted) {
      setRemUnit();
    }
  };
  setRemUnit();
  window.addEventListener("resize", setRemUnit);
  window.addEventListener("pageshow", pageshow);
}
import { getToken, removeToken, setToken } from "@/utils/auth";
export default {
  name: "Login",
  data() {
    return {
      phoneErr: null,
      times: 60,
      time:undefined,
      loginMode: 1, // 登陆方式，1：扫码 2：密码
      qrOverTime: false, // 表示二维码是否超时
      errorMeg: "", // 错误提示
      errShow: false,
      myTime: undefined, // 接收定时器变量
      getSmsval:true,
      loginData: {
        phone: "",
        phoneSms: ""
      },
      rules: {
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        phoneSms: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      }
    };
  },
  mounted() {
    if (getToken()) {
      removeToken();
    }
  },
  created() {
    this.scanStr = ""; // 生成二维码需要的字符串
  },
  beforeMount() {
    setRem(window, document);
  },
  mounted() {
    this.createScan();
  },
  beforeDestroy() {
    window.removeEventListener("resize", setRemUnit);
    window.removeEventListener("pageshow", pageshow);
    document.documentElement.style.fontSize = "";
  },
  methods: {
    // 登陆方式切换
    cutLoginMode(num) {
      if (num == 1) {
        this.loginMode = 2;
        clearTimeout(this.time);
        this.scanStr=""
      } else {
        this.loginMode = 1;
        clearTimeout(this.myTime);
        this.myTime = undefined;
        this.createScan();
      }
    },
    //点击获取验证码
    onGetValidate() {
      if (this.loginData.phone == ""&&this.getSmsval) {
        this.phoneErr = "请输入手机号码";
        this.$refs.phonenum.focus();
        return;
      }
      this.getSmsval=false
      if (this.myTime !== undefined) return;
      getSms(this.loginData).then(response => {
        if (response.code == 0) {
          // 如果定时器存在则直接退出改方法
          this.myTime = setInterval(() => {
            this.times--;
            if (this.times == 0) {
              clearInterval(this.myTime);
              this.myTime = undefined;
              this.times = 60;
              this.getSmsval=true
            }
          }, 1000);
        }
      });
    },
    // 点击登录
    loginHandler() {
      this.$refs.loginData.validate(valid => {
        if (valid) {
          login(this.loginData).then(response => {
            setToken(response.data.token);
            sessionStorage.setItem("userId", response.data.userId);
            sessionStorage.setItem("serverId", response.data.id);
            this.$router.push("/home");
          });
        }
      });
    },

    // 刷新二维码
    refreshQr() {
      this.scanStr = "";
      this.createScan();
    },

    // 生成二维码
    async createScan() {
      if (this.scanStr == "") {
        try {
          this.scanStr = await this.$store.dispatch("user/getScanStr");
        } catch (error) {
          console.log(error);
        }
      }
      this.$refs.qrCode.innerHTML = null;
      let qr = new QRCode(this.$refs.qrCode, {
        width: 300,
        height: 300,
        text: this.scanStr
      });
      qr._el.title = "";
      this.qrOverTime = false;
      this.getScanData(this.scanStr);
    },
    // 轮询扫码登陆结果
    // code: 1.登陆成功，2.无登陆权限 , 3.二维码已失效 ， 0. API模块未授权
    getScanData(str) {
      this.$store
        .dispatch("user/scanlogin", str)
        .then(res => {
          if (res.code == 0 && !res.data) {
            clearTimeout(this.time);
            this.time = setTimeout(() => {
              this.getScanData(str);
            }, 1500);
          } else if (res.data) {
            Message({
              message: "扫码成功，欢迎登录",
              type: "success",
              duration: 1000
            });
            sessionStorage.setItem("userId", res.data.userId);
            sessionStorage.setItem("serverId", res.data.id);
            setToken(res.data.token);
            this.$router.push({ path: "/home" });
          }else if (res.code == 2) {
            this.refreshQr();
            Message({
              message: "您没有登录权限",
              type: "warning",
              duration: 2 * 1000,
              center: true
            });
          } else if (res.code == 3) {
            this.qrOverTime = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    isLogin() {
      return this.loginData.phone != "" && this.loginData.phoneSms.length >= 4;
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  height: 100%;
  min-width: 1200px;
  background: url(../../assets/images/loginbgi.jpg) no-repeat center;
  background-size: cover;
  overflow: hidden;
  .right-cont-scan {
    border-radius: 10px;
  }
  .right-cont-scan,
  .right-cont-login {
    position: absolute;
    top: 50%;
    right: 10%;
    transform: translateY(-50%);
    width: 440px;
    height: 520px;
    border-radius: 10px;
    background: #fff;
    .title {
      position: relative;
      p:first-child {
        font-family: "MicrosoftYaHeiUI";
        font-size: 28px;
        color: #666;
        font-weight: 400;
        text-indent: 1em;
        border-bottom: 2px solid #f8f8f8;
        line-height: 100px;
        padding-bottom: 10px;
        margin: 0;
      }
      .icon {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 80px;
        height: 80px;
        cursor: pointer;
      }
    }
    .scan {
      position: relative;
      display: block;
      width: 264px;
      height: 271px;
      margin: 30px auto 20px;
      //border-radius: 0.15625rem;
      overflow: hidden;
      .scan-can {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
      }
      .overtimeTip {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 2000;
        p {
          font-size: 20px;
          font-weight: 900;
          color: #fff;
        }
      }
    }
    .tips {
    padding: 30px auto;
      font-size: 20px;
        font-family: "MicrosoftYaHeiUI";
      font-weight: 400;
      color: #333;
      p {
        margin: 0;
        text-align: center;
      }
    }
  }
}
// 输入框验证码部分
.main {
  font-size: 16px;
  margin-top: 30px;
  ::v-deep .el-input-group__prepend {
    background-color: transparent !important;
    border: none;
  }
  ::v-deep .el-input-group__append {
    background-color: transparent !important;
    border: 2px solid #292bfe;
    color: #292bfe;
    border-radius: 5px;
    right: 20px;
    width: 100px !important;
    cursor: pointer;
  }

  ::v-deep .inputcon {
    padding-bottom: 15px;
    margin-top: 30px;
    border-bottom: 2px solid #f8f8f8;
    font-size: 18px;
  }
  ::v-deep .el-input__inner {
    border: none !important;
  }
}
// 登录按钮
#handle-login {
  margin: 0 auto;
  font-size: 22px;
  width: 330px;
  text-align: center;
  line-height: 44px;
  border-radius: 5px;
  color: #fff;
  background-color: #cccccc;
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  cursor: not-allowed;
}
.btn-disabed {
  background-image: linear-gradient(to top, #0bdcee 0%, #16f8e6 100%);
  cursor: pointer !important;
}
</style>

<style lang="scss">
.login-container {
  .right-cont-scan {
    .scan {
      .scan-can {
        img {
          width: 100% !important;
          height: 100% !important;
        }
      }
    }
  }
}

.el-message__icon {
  font-size: x-large !important;
}
.el-form-item__error {
  left: 18%;
}
</style>
