<template>
  <div class="main">
    <headerComponent style="background:#0074ff;color:#fff;" :color="'#ffffff'"></headerComponent>
    <div class="content">
         <div class="updatepsw">
    <div class="title">
      <span></span>账户设置-修改密码
    </div>
    <div class="form">
      <inputComponent type="tel" placeholder="请输入手机号" :border="'1px solid #DCDCDC'" v-model="phone">
        <span class="check" >{{checkObject.checkPhoneValue}}</span>
      </inputComponent>
      <inputComponent
        type="text"
        :width="228"
        placeholder="图形验证码"
        :border="'1px solid #DCDCDC'"
        v-model="imgCaptcha"
      >
        <span v-html="captcha" class="captcha" @click="getImgCaptchaMethod"></span>
        <span class="check">{{checkObject.checkImgCaptchaVlaue}}</span>
      </inputComponent>
      <inputComponent
        :width="228"
        placeholder="短信验证码"
        :border="'1px solid #DCDCDC'"
        v-model="smsCaptcha"
      >
        <buttonComponent value="获取验证码" class="buttonStyle" @click.native="getCaptcha"></buttonComponent>
        <span class="check">{{checkObject.checkSMSCaptchaValue}}</span>
      </inputComponent>
      <inputComponent
        type="password"
        placeholder="请输入新密码"
        :border="'1px solid #DCDCDC'"
        v-model="password"
      ></inputComponent>
      <span class="check">{{checkObject.checkPasswordValue}}</span>

      <inputComponent
        type="password"
        placeholder="确认密码"
        :border="'1px solid #DCDCDC'"
        v-model="confirmpassword"
      >
        <span class="check">{{checkObject.checkComfirmPasswordValue}}</span>
      </inputComponent>
      <div class="finishDiv">
        <buttonComponent width class="finishButton" @click.native="updatePswMethod" value="完成"></buttonComponent>
      </div>
    </div>
  </div>
    </div>
    <footerComponent class="footer"></footerComponent>
  </div>
</template>
<script>
import headerComponent from "../components/common/header";
import footerComponent from "../components/common/footer";
import inputComponent from "@/components/input/input-text";
import buttonComponent from "@/components/input/input-button";
import { updateUserMessage } from "@/api/account.js";
import {
  getImgCaptcha,
  updatepsw,
  getSmsCaptchaReceive,
  getSmsCaptcha
} from "@/api/user.js";
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
      let self = this;

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

      if(self.password) {
        if (!/^[\w]{6,12}$/.test(self.password)) {
          self.checkObject.checkPasswordValue = "必须是6-24位";
          return false;
        } else {
          self.checkObject.checkPasswordValue = "";
          return true;
        }
      } else {

        this.checkObject.checkPasswordValue = "请输入密码";
        return false;
      }
    },
    checkComfirmPassword() {
      let self  = this;
      if (self.confirmpassword) {
        if (!/^[\w]{6,12}$/.test(self.confirmpassword)) {
          self.checkObject.checkComfirmPasswordValue = "必须是6-24位";
          return false;
        } else {
          if (self.confirmpassword == self.password) {
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
     getCaptchaRecevie() {
      let self = this;
      getSmsCaptchaReceive({phone:self.phone,type:"reset"})
        .then(res => {
          res.data.code === "success" ? self.$message({type:'success',message:'您的短信验证码是' + res.data.data.smsCaptcha}) : self.$message.error(res.data.message);
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
      updatepsw({phone:self.phone, smsCaptcha:self.smsCaptcha, password:self.password})
        .then(res => {
          if (res.data.code === "success") {
            self.$message({
              type: "success",
              message: "修改成功"
            });
          self.$store.state.user = null;
          localStorage.user = "";
          self.$store.state.token = null;
          localStorage.token = "";            
            self.$router.push({name:'login'});
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
    document.documentElement.scrollTop = 0;
    window.onscroll = function(){}

  }
};
</script>
<style scoped>
.captcha{
  cursor: pointer;
}
.main {
  width: 100%;
  height: 100%;
  background: #f9f9f9;
  position: relative;
}
.content {
  padding: 50px 0 50px 0;
}
.updatepsw {
  width: 1032px;
  background: #fff;
  margin: auto;
  padding-bottom: 30px;
}
.title {
  height: 30px;
  padding: 20px 0 20px 0;
  border-bottom: 1px solid #dcdcdc;
  margin-bottom: 30px;
}
.title > span {
  display: inline-block;
  width: 0;
  height: 100%;
  border-left: 2px solid #0074ff;
  border-right: 2px solid #0074ff;
  margin-right: 50px;
  vertical-align: middle;
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
  width: 380px;
  height: 53px;
  color: #ffffff;
  background: #ff8000;
}
.check {
  color: #f00;
  font-size: 12px !important;
}
.captcha{
   display: inline-block;
  width: 140px;
  margin-left: 12px;
  height: 56px;
  float: right;
  padding: 10px 30px;
  box-sizing: border-box; 
}
</style>
