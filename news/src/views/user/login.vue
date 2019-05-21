<template>
  <div class="main">
    <headerCom :color="'#0074FF'"></headerCom>
    <div class="content">
      <div class="form">
        <div class="title">登录</div>
        <inputComponent type="tel" placeholder="手机 / 用户名" v-model="phone" @pblur="checkPhone">
          <span class="checkSpa">{{checkObject.checkPhoneValue}}</span>
        </inputComponent>
        <inputComponent type="password" placeholder="密码" v-model="password" @pblur="checkPassword">
          <span class="checkSpa">{{checkObject.checkPasswordValue}}</span>
        </inputComponent>
        <div class="finishDiv">
          <buttonComponent class="finishButton" @click.native="loginmethod" value="登录"></buttonComponent>
          <router-link :to="{name:'findpassword'}">忘记密码?</router-link>
        </div>
        <div class="form-bottom">
          <span>还没有APIS账号？</span>
          <router-link :to="{name:'regist'}">
          <buttonComponent value="注册" class="loginButton"></buttonComponent>
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
import { login } from "../../api/user.js";
import {check,checkConfirmPsw} from "../../utils/utils"
export default {
  components: {
    inputComponent,
    buttonComponent,
    headerCom,
    footerCom
  },
  data() {
    return {
      phone: "",
      password: "",
      checkObject:{
          checkPhoneValue: "",
      checkPasswordValue: ""
      }
    };
  },
  methods: {
    checkPhone() {
      let self = this;
      return self.checkObject.checkPhoneValue = check(self.phone,"请输入手机号",/^1[34578]\d{9}$/,"手机号有误，请重新输入");
    },
    checkPassword() {
      let self = this;
      return self.checkObject.checkPasswordValue = check(self.password,"请输入密码",/^[\w]{6,12}$/,"必须是6-24位");
    },
    loginmethod() {
      let self = this;
      if (self.checkPhone()) return;
      if (self.checkPassword()) return;
      // 登录
      login({ phone: self.phone, password: self.password })
        .then(res => {
          if (res.data.code === "success") {
            self.$store.commit("setUser", res.data.data.account);
            self.$store.commit("setToken", res.data.data.account.token);
            self.$message({
              type: "success",
              message: "登陆成功"
            });
            self.$router.push({ name: "new" });
          } else {
            self.$message.error(res.data.message);
          }
        })
        .catch(err => {
          // 错误处理
        });
    },
  },
  created(){
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
.buttonStyle {
  width: 139.8px;
  color: #ffffff;
  background: #ff8000;
  margin-left: 12px;
}
.content .form .finishDiv {
  width: 380px;
  margin: 40px auto 40px;
}
.content .form .finishDiv > a {
  float: right;
  font-size: 14px;
  color: #fff;
  margin-top: 12px;
  cursor: pointer;
}
.checkSpa {
  color: #f00;
  font-size: 14px;
}
.content .form .finishDiv .finishButton {
  width: 100%;
  height: 53px;
  color: #ffffff;
  background: #ff8000;
}
.content .form .form-bottom {
  height: 108px;
  border-top: 1px solid #fff;
  color: #ffffff;
  font-size: 14px;
  padding: 0 20px;
  line-height: 108px;
  box-sizing: border-box;
  vertical-align: middle;
  margin-top: 122px;
}
.content .form .form-bottom .loginButton {
  width: 66px;
  height: 41px;
  font-size: 20px;
  background: #ffffff;
  color: #0d407e;
  float: right;
  margin-top: 33.5px;
}

.el-input {
  width: 380px;
  height: 56px;
  font-size: 16px;
  padding: 0 20px;
  border-radius: 3px;
  box-sizing: border-box;
  outline: none;
  border: 0;
  margin: auto;
}
.input::-webkit-input-placeholder {
  color: #9b9b9b;
}
.input::-moz-placeholder {
  color: #9b9b9b;
}
.input:-ms-input-placeholder {
  color: #9b9b9b;
}
</style>

