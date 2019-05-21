<template>
  <div class="main">
    <headerCom :color="'#0074FF'"></headerCom>
    <div class="content">
      <div class="form">
        <div class="title">注册</div>
        <inputComponent type="tel" placeholder="账号( 请输入手机号码 )" v-model="phone" @pblur="checkPhone">
          <span class="check">{{checkObject.checkPhoneValue}}</span>
        </inputComponent>
        <inputComponent
          type="text"
          :width="228"
          placeholder="图形验证码"
          v-model="imgCaptcha"
          @pblur="checkImgCaptcha"
        >
          <img v-lazy="captcha" class="captcha" @click="UpdateimgCaptcha"/>
          <span class="check">{{checkObject.checkImgCaptchaVlaue}}</span>
        </inputComponent>
        <inputComponent
          :width="228"
          placeholder="短信验证码"
          v-model="smsCaptcha"
          @pblur="checkSMSCaptcha"
        >
          <buttonComponent
            @click.native="getCaptcha"
            :disabled="isdisabled"
            value="获取验证码"
            class="captchaBtn"
          ></buttonComponent>
          <span class="check">{{checkObject.checkSMSCaptchaValue}}</span>
        </inputComponent>
        <inputComponent
          type="password"
          placeholder="密码( 请输入6-20位字符 )"
          minlength="6"
          maxlength="20"
          v-model="password"
          @pblur="checkPassword"
        >
          <span class="check">{{checkObject.checkPasswordValue}}</span>
        </inputComponent>
        <inputComponent
          type="password"
          placeholder="确认密码"
          minlength="6"
          maxlength="20"
          v-model="comfirPasssword"
          @pblur="checkComfirmPassword"
        >
          <span class="check">{{checkObject.checkComfirmPasswordValue}}</span>
        </inputComponent>
        <div class="finishDiv">
          <buttonComponent
            type="button"
            class="finishButton"
            value="注册"
            @click.native="registmethod"
          ></buttonComponent>
        </div>
        <div class="form-bottom">
          <span>已经有APIS账号了</span>
          <router-link :to="{name:'login'}">
            <buttonComponent value="登录" class="loginButton"></buttonComponent>
          </router-link>
        </div>
      </div>
    </div>
    <footerCom></footerCom>
  </div>
</template>

<script>
import headerCom from "../../components/common/header";
import footerCom from "../../components/common/footer";
import inputComponent from "../../components/input/input-text";
import buttonComponent from "../../components/input/input-button";
import {
  getImgCaptcha,
  getSmsCaptcha,
  getSmsCaptchaReceive,
  regist
} from "../../api/user.js";
import { check, checkConfirmPsw } from "../../utils/utils";
export default {
  components: {
    headerCom,
    footerCom,
    inputComponent,
    buttonComponent
  },
  data() {
    return {
      captcha: "",
      isdisabled: false,
      phone: "",
      imgCaptcha: "",
      smsCaptcha: "",
      password: "",
      comfirPasssword: "",
      captchasuccess: false,
      checkObject: {
        checkPhoneValue: "",
        checkImgCaptchaVlaue: "",
        checkSMSCaptchaValue: "",
        checkPasswordValue: "",
        checkComfirmPasswordValue: ""
      }
    };
  },

  methods: {
    checkPhone() {
      let self = this;
      return (self.checkObject.checkPhoneValue = check(
        self.phone,
        "请输入手机号",
        /^1[34578]\d{9}$/,
        "手机号有误，请重新输入"
      ));
    },
    checkImgCaptcha() {
      let self = this;
      return (self.checkObject.checkImgCaptchaVlaue = check(
        self.imgCaptcha,
        "请输入图形验证码"
      ));
    },
    checkSMSCaptcha() {
      let self = this;
      return (self.checkObject.checkSMSCaptchaValue = check(
        self.smsCaptcha,
        "请输入手机验证码"
      ));
    },
    checkPassword() {
      let self = this;
      return (self.checkObject.checkPasswordValue = check(
        self.password,
        "请输入密码",
        /^[\w]{6,12}$/,
        "必须是6-24位"
      ));
    },
    checkComfirmPassword() {
      let self = this;
      return (self.checkObject.checkComfirmPasswordValue = checkConfirmPsw(
        self.confirmpassword,
        "请确认密码",
        /^[\w]{6,12}$/,
        "必须是6-24位",
        self.password,
        "两次密码不一致"
      ));
    },
    // 获取短信验证码
    getCaptcha() {
      let self = this;
      if (self.checkPhone()) return;
      if (self.captchasuccess) {
        self.getCaptchaRecevie();
      } else {
        getSmsCaptcha({
          phone: self.phone,
          type: "register",
          imgCaptcha: self.imgCaptcha
        })
          .then(res => {
            res.data.code === "success" ||
            res.data.code === "sms_captcha_has_sent"
              ? (self.captchasuccess = true)
              : self.$message.error(res.data.message);
          })
          .catch(err => {});
      }
    },
    // 获取短信验证码
    getCaptchaRecevie() {
      let self = this;
      getSmsCaptchaReceive({ phone: self.phone, type: "register" })
        .then(res => {
          res.data.code === "success"
            ? self.$message({
                type: "success",
                message: "您的短信验证码是" + res.data.data.smsCaptcha
              })
            : self.$message.error(res.data.message);
        })
        .catch(err => {
          // 错误处理
        });
    },
    registmethod() {
      let self = this;
      if (self.checkPhone()) return;
      if (self.checkImgCaptcha()) return;
      if (self.checkSMSCaptcha()) return;
      if (self.checkPassword()) return;
      if (self.checkComfirmPassword()) return;
      regist({
        phone: self.phone,
        password: self.password,
        smsCaptcha: self.smsCaptcha
      })
        .then(res => {
          if (res.data.code === "success") {
            self.$message({
              type: "success",
              message: "注册成功"
            });
            self.goLogin();
          } else {
            self.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取图片验证码
    getImgCaptchaMethod() {
      getImgCaptcha()
        .then(res => {
          this.captcha = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    UpdateimgCaptcha() {
      this.getImgCaptchaMethod();
    }
  },
  created() {
    this.getImgCaptchaMethod();
    document.documentElement.scrollTop = 0;
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  height: 860px;
  background: url("../../assets/bg_sign.png");
  position: relative;
}
.content .form {
  width: 568px;
  position: absolute;
  left: 674px;
  top: 107px;
  background: #466d9c;
  box-shadow: 6px 6px 14px 5px rgba(39, 52, 101, 0.08);
}
.content .form .title {
  font-size: 36px;
  color: #ffffff;
  text-align: center;
  margin: 40px 0 30px 0;
}
.content .form .finishDiv {
  width: 380px;
  margin: 40px auto 50px;
}
.content .form .form-bottom {
  height: 50px;
  border-top: 1px solid #fff;
  color: #ffffff;
  font-size: 14px;
  box-sizing: border-box;
  vertical-align: middle;
  line-height: 50px;
  padding: 10px 20px 0 20px;
}
.content .form .form-bottom > span {
  float: left;
}
.content .form .form-bottom .loginButton {
  width: 66px;
  height: 41px;
  font-size: 20px;
  background: #ffffff;
  color: #0d407e;
  float: right;
}
.content .form .finishDiv .finishButton {
  width: 100%;
  height: 53px;
  color: #ffffff;
  background: #ff8000;
}
.captchaBtn {
  width: 139.8px;
  color: #ffffff;
  background: #ff8000;
  margin-left: 12px;
}
.captcha {
  width: 140px;
  margin-left: 12px;
  height: 56px;
  float: right;
  padding: 10px 30px;
  box-sizing: border-box;
  cursor: pointer;
}
.check {
  color: #f00;
  font-size: 12px;
}
</style>