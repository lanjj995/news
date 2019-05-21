<template>
  <div class="main">
    <headerComponent class="header" :color="'#fff'"></headerComponent>
    <div class="content">
      <div class="updatepsw">
        <div class="title">
          <span></span>账户设置-修改密码
        </div>
        <div class="form">
          <inputComponent
            type="tel"
            placeholder="请输入手机号"
            :border="'1px solid #DCDCDC'"
            v-model="phone"
            @pblur="checkPhone"
          > 
            <span class="check">{{checkObject.checkPhoneValue}}</span>
          </inputComponent>
          <inputComponent
            type="text"
            :width="228"
            placeholder="图形验证码"
            :border="'1px solid #DCDCDC'"
            v-model="imgCaptcha"
            @pblur="checkImgCaptcha"
          >
            <img v-lazy="captcha" class="captcha" @click="getImgCaptchaMethod"/>
            <span class="check">{{checkObject.checkImgCaptchaVlaue}}</span>
          </inputComponent>
          <inputComponent
            :width="228"
            placeholder="短信验证码"
            :border="'1px solid #DCDCDC'"
            v-model="smsCaptcha"
            @pblur="checkSMSCaptcha"
          >
            <buttonComponent value="获取验证码" class="captchaBtn" @click.native="getCaptcha"></buttonComponent>
            <span class="check">{{checkObject.checkSMSCaptchaValue}}</span>
          </inputComponent>
          <inputComponent
            type="password"
            placeholder="请输入新密码"
            :border="'1px solid #DCDCDC'"
            v-model="password"
            @pblur="checkPassword"
          >
          <span class="check">{{checkObject.checkPasswordValue}}</span>
          </inputComponent>
          <inputComponent
            type="password"
            placeholder="确认密码"
            :border="'1px solid #DCDCDC'"
            v-model="confirmpassword"
            @pblur="checkComfirmPassword"
          >
            <span class="check">{{checkObject.checkComfirmPasswordValue}}</span>
          </inputComponent>
          <div class="finishDiv">
            <buttonComponent width class="finishButton" @click.native="updatePswMethod" value="完成"></buttonComponent>
          </div>
        </div>
      </div>
    </div>
    <footerComponent ></footerComponent>
  </div>
</template>
<script>
import headerComponent from "../../components/common/header";
import footerComponent from "../../components/common/footer";
import inputComponent from "../../components/input/input-text";
import buttonComponent from "../../components/input/input-button";
import { updateUserMessage } from "../../api/account.js";
import {
  getImgCaptcha,
  updatepsw,
  getSmsCaptchaReceive,
  getSmsCaptcha
} from "../../api/user.js";
import {check,checkConfirmPsw} from "../../utils/utils"
export default {
  components: {
    headerComponent,
    footerComponent,
    inputComponent,
    buttonComponent
  },
  data() {
    return {
      phone: "",
      imgCaptcha: "",
      smsCaptcha: "",
      password: "",
      confirmpassword: "",
      captcha: "",
      checkObject: {
        checkPhoneValue: "",
        checkImgCaptchaVlaue: "",
        checkSMSCaptchaValue: "",
        checkPasswordValue: "",
        checkComfirmPasswordValue: ""
      },
      captchaSuccess: false
    };
  },
  methods: {
    checkPhone() {
      let self = this;
      return self.checkObject.checkPhoneValue = check(self.phone,'请输入手机号',/^1[34578]\d{9}$/,'手机号有误，请重新输入');
    },
    checkImgCaptcha() {
      let self = this;
      return self.checkObject.checkImgCaptchaVlaue = check(self.imgCaptcha,'请输入图形验证码');
    },
    checkSMSCaptcha() {
      let self = this;
      return self.checkObject.checkSMSCaptchaValue = check(self.smsCaptcha,'请输入手机验证码');
    },
    checkPassword() {
      let self = this;
      return self.checkObject.checkPasswordValue = check(self.password,'请输入密码',/^[\w]{6,12}$/,'必须是6-24位');
    },
    checkComfirmPassword() {
      let self = this;
      return self.checkObject.checkComfirmPasswordValue = checkConfirmPsw(self.confirmpassword,'请确认密码',/^[\w]{6,12}$/,'必须是6-24位',self.password,'两次密码不一致');
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
          type: "reset",
          imgCaptcha: self.imgCaptcha
        })
          .then(res => {
            (res.data.code === "success" || res.data.code === "sms_captcha_has_sent") ? self.captchasuccess = true : self.$message.error(res.data.message);
          })
          .catch(err => {});
      }
    },
    getCaptchaRecevie() {
      let self = this;
      getSmsCaptchaReceive({ phone: self.phone, type: "reset" })
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
    // 获取图片验证码
    getImgCaptchaMethod() {
      let self = this;
      getImgCaptcha()
        .then(res => {
          self.captcha = res.data;
        })
        .catch(err => {
          // 错误处理
          self.$router.push("/404");
        });
    },
    updatePswMethod() {
      let self = this;
      if (self.checkPhone()) return;
      if (self.checkImgCaptcha()) return;
      if (self.checkSMSCaptcha()) return;
      if (self.checkPassword()) return;
      if (self.checkComfirmPassword()) return;
      updatepsw({
        phone: self.phone,
        smsCaptcha: self.smsCaptcha,
        password: self.password
      })
        .then(res => {
          if (res.data.code === "success") {
            self.$message({
              type: "success",
              message: "修改成功"
            });
            self.$store.commit("setUser", "");
            self.$store.commit("setToken", "");
            self.$router.push({ name: "login" });
          } else {
            self.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.getImgCaptchaMethod();
  }
};
</script>
<style scoped>
.main {
  width: 100%;
  background: #f9f9f9;
  position: relative;
}
.main .content{
  padding: 50px 0 50px 0;
}
.main .content .updatepsw {
  width: 1032px;
  background: #fff;
  margin: auto;
  padding-bottom: 30px;
}
.main .content .updatepsw .title {
  height: 30px;
  padding: 20px 0 20px 0;
  border-bottom: 1px solid #dcdcdc;
  margin-bottom: 30px;
}
.main .content .updatepsw .title > span {
  display: inline-block;
  width: 0;
  height: 100%;
  border-left: 2px solid #0074ff;
  border-right: 2px solid #0074ff;
  margin-right: 50px;
  vertical-align: middle;
}
.main .content .updatepsw .form .captchaBtn {
  width: 139.8px;
  color: #ffffff;
  background: #ff8000;
  margin-left: 12px;
}
.main .content .updatepsw .form .finishDiv {
  width: 380px;
  margin: 40px auto 50px;
}
.main .content .updatepsw .form .finishDiv .finishButton {
  width: 380px;
  height: 53px;
  color: #ffffff;
  background: #ff8000;
}
.check {
  color: #f00;
  font-size: 12px !important;
}
.captcha {
  display: block;
  width: 140px;
  margin-left: 12px;
  height: 56px;
  float: right;
  padding: 10px 30px;
  box-sizing: border-box;
  cursor: pointer;
}
.header {
  background: #0074ff;
}
</style>
