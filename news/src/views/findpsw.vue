<template>
  <div class="main">
    <headerCom></headerCom>
    <div class="content">
       <div class="form">
    <div class="title">找回密码</div>
    <inputComponent type="tel" placeholder="输入手机号" v-model="phone">
      <span class="check">{{checkObject.checkPhoneValue}}</span>
    </inputComponent>
    <inputComponent type="text" :width="228" placeholder="图形验证码" v-model="imgCaptcha">
      <span v-html="captcha" class="captcha" @click="getImgCapta"></span>
      <span class="check">{{checkObject.checkImgCaptchaVlaue}}</span>
    </inputComponent>
    <inputComponent :width="228" placeholder="短信验证码" v-model="smsCaptcha">
      <buttonComponent
        @click.native="getCaptcha"
        :disabled="isdisabled"
        value="获取验证码"
        class="buttonStyle"
      ></buttonComponent>
      <span class="check">{{checkObject.checkSMSCaptchaValue}}</span>
    </inputComponent>
    <inputComponent
      type="password"
      placeholder="输入新密码"
      minlength="6"
      maxlength="20"
      v-model="password"
    >
      <span class="check">{{checkObject.checkPasswordValue}}</span>
    </inputComponent>
    <inputComponent
      type="password"
      placeholder="确认密码"
      minlength="6"
      maxlength="20"
      v-model="comfirPasssword"
    >
      <span class="check">{{checkObject.checkComfirmPasswordValue}}</span>
    </inputComponent>
    <div class="finishDiv">
      <buttonComponent type="button" class="finishButton" value="完成" @click.native="findpswMethod"></buttonComponent>
    </div>
  </div>
    </div>
    <footerCom></footerCom>
  </div>
</template>

<script>
import headerCom from "../components/common/header";
import footerCom from "../components/common/footer";
import inputComponent from "../components/input/input-text";
import buttonComponent from "../components/input/input-button";
import { findPassword } from "@/api/user.js";
import {
  getImgCaptcha,
  getSmsCaptcha,
  getSmsCaptchaReceive,
  regist
} from "@/api/user.js";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      isRegist: true,
      captcha: "",
      isdisabled: false,
      phone: "",
      imgCaptcha: "",
      smsCaptcha: "",
      password: "",
      comfirPasssword: "",
      captchasuccess:false,
      checkObject: {
        checkPhoneValue: "",
        checkImgCaptchaVlaue: "",
        checkSMSCaptchaValue: "",
        checkPasswordValue: "",
        checkComfirmPasswordValue: ""
      }
    };
  },
  components: {
      headerCom,footerCom,
    inputComponent,
    buttonComponent
  },
  methods: {
    checkPhone() {
      let self = this;
      if (self.phone) {
        if (!/^1[34578]\d{9}$/.test(self.phone)) {
          self.checkObject.checkPhoneValue = "手机号码有误，请重填";
          return false;
        } else {
          self.checkObject.checkPhoneValue = "";
          return true;
        }
      } else {
        self.checkObject.checkPhoneValue = "请输入手机号";
        return false;
      }
    },
    checkImgCaptcha() {
      let self =  this;
      if (self.imgCaptcha) {
        self.checkObject.checkImgCaptchaVlaue = "";
        return true;
      } else {
        self.checkObject.checkImgCaptchaVlaue = "请输入图形验证码";
        return false;
      }
    },
    checkSMSCaptcha() {
      let self = this;
      if (self.smsCaptcha) {
        self.checkObject.checkSMSCaptchaValue = "";
        return true;
      } else {
        self.checkObject.checkSMSCaptchaValue = "请输入手机验证码";
        return false;
      }
    },
    checkPassword() {
      let self = this;
      if (self.password) {
        if (!/^[\w]{6,12}$/.test(self.password)) {
          self.checkObject.checkPasswordValue = "必须是6-24位";
          return false;
        } else {
          self.checkObject.checkPasswordValue = "";
          return true;
        }
      } else {

        self.checkObject.checkPasswordValue = "请输入密码";
        return false;
      }
    },
    checkComfirmPassword() {
      let self = this;
      if (self.comfirPasssword) {
        if (!/^[\w]{6,12}$/.test(self.comfirPasssword)) {
          self.checkObject.checkComfirmPasswordValue = "必须是6-24位";
          return false;
        } else {
          if (self.comfirPasssword == self.password) {
            self.checkObject.checkComfirmPasswordValue = "";
            return true;
          } else {
            self.checkObject.checkComfirmPasswordValue = "两次密码不一致";
            return false;
          }
        }
      } else {
        self.checkObject.checkComfirmPasswordValue = "请确认密码";
        return false;
      }
    },
    goLogin() {
      this.$router.push({ path: "login" });
    },
   // 获取短信验证码
    getCaptcha() {
      let self = this;
      var isPhone = self.checkPhone();
      if (!isPhone) return;
      if (self.captchasuccess) {
        self.getCaptchaRecevie();
      } else {
         getSmsCaptcha({phone:self.phone, type:"reset", imgCaptcha:self.imgCaptcha})
         .then(res => {
          if (
            res.data.code === "success" ||
            res.data.code === "sms_captcha_has_sent"
          ) {
            self.captchasuccess = true;
          } else {
            self.$message.error(res.data.message);
          }
        })
        .catch(err => {});
      }
    
    },
    // 获取短信验证码
    getCaptchaRecevie() {
      let self = this;
      getSmsCaptchaReceive({phone:self.phone, type:"reset"})
        .then(res => {
          res.data.code === "success" ? self.$message({type: "success",message: "您的短信验证码是" + res.data.data.smsCaptcha}):self.$message.error(res.data.message);; 
        })
        .catch(err => {
          // 错误处理
        });
    },
    // 获取图片验证码
    getImgCapta() {
      getImgCaptcha()
      .then(res => {
        this.captcha = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    },
    findpswMethod() {
      let self = this;
      let isPhone = self.checkPhone();
      if (!isPhone) return;
      let isImgCaptcha = self.checkImgCaptcha();
      if (!isImgCaptcha) return;
      let isSMSCaptcha = self.checkSMSCaptcha();
      if (!isSMSCaptcha) return;
      let isPassword = self.checkPassword();
      if (!isPassword) return;
      let isComfirmPassword = self.checkComfirmPassword();
      if (!isComfirmPassword) return;
      findPassword({phone:self.phone, smsCaptcha:self.smsCaptcha, password:self.password})
        .then(res => {
         if (res.data.code === "success")  {
          self.$message({type:'success',message:'修改成功'});
          self.$router.push({name:'login'});
         } else {
           self.$message.error(res.data.message);
           } 
        })
        .catch(err => {});
    }
  },
  created() {
    this.getImgCapta();
    document.documentElement.scrollTop = 0;

  },
 
};
</script>

<style scoped>
.captcha {
  cursor: pointer;
}
.content {
  width: 100%;
  height: 860px;
  background: url("../assets/bg_sign.png");
  position: relative;
}
.form {
  width: 568px;
  position: absolute;
  left: 674px;
  top: 107px;
  background: #466d9c;
  box-shadow: 6px 6px 14px 5px rgba(39, 52, 101, 0.08);
}
.title {
  font-size: 36px;
  color: #ffffff;
  text-align: center;
  margin: 40px 0 30px 0;
}
.buttonStyle {
  width: 139.8px;
  color: #ffffff;
  background: #ff8000;
  margin-left: 12px;
}
.finishDiv {
  width: 380px;
  margin: 40px auto 50px;
}
.finishButton {
  width: 100%;
  height: 53px;
  color: #ffffff;
  background: #ff8000;
}
.form-bottom1 {
  height: 108px;
  border-top: 1px solid #fff;
  color: #ffffff;
  font-size: 14px;
  padding: 0 20px;
  line-height: 108px;
  box-sizing: border-box;
  vertical-align: middle;
}
.loginButton {
  width: 66px;
  height: 41px;
  font-size: 20px;
  background: #ffffff;
  color: #0d407e;
  float: right;
  margin-top: 33.5px;
}
.captcha {
  display: inline-block;
  width: 140px;
  margin-left: 12px;
  height: 56px;
  float: right;
  padding: 10px 30px;
  box-sizing: border-box;
}

.check {
  color: #f00;
  font-size: 12px !important;
}
</style>

