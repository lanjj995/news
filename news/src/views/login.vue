<template>
  <div class="main">
    <headerCom></headerCom>
    <div class="content">
      <div class="form">
        <div class="title">登录</div>
        <inputComponent type="tel" placeholder="手机 / 用户名" v-model="phone">
          <span style="color:#f00;font-size:14px">{{checkPhoneValue}}</span>
        </inputComponent>

        <inputComponent type="password" placeholder="密码" v-model="password">
          <span style="color:#f00;font-size:14px">{{checkPasswordValue}}</span>
        </inputComponent>
        <div class="finishDiv">
          <buttonComponent class="finishButton" @click.native="loginmethod" value="登录"></buttonComponent>
          <a @click="goFindPassword">忘记密码?</a>
        </div>
        <div class="form-bottom">
          <span>还没有APIS账号？</span>
          <buttonComponent value="注册" @click.native="goRegist" class="loginButton"></buttonComponent>
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
import { login } from "@/api/user.js";
export default {
  data() {
    return {
      phone: "",
      password: "",
      checkPhoneValue: "",
      checkPasswordValue: ""
    };
  },
  methods: {
    checkPhone() {
      let self = this;
      if (self.phone) {
        if (!/^1[34578]\d{9}$/.test(self.phone)) {
          self.checkPhoneValue = "手机号码有误，请重填";
          return false;
        } else {
          self.checkPhoneValue = "";
          return self;
        }
      } else {
        self.checkPhoneValue = "请输入手机号";
        return self;
      }
    },
    checkPassword() {
      let self = this;
      if (self.password) {
        if (!/^[\w]{6,12}$/.test(self.password)) {
          self.checkPasswordValue = "必须是6-24位";
          return false;
        } else {
          self.checkPasswordValue = "";
          return true;
        }
      } else {
        self.checkPasswordValue = "请输入密码";
        return false;
      }
    },
    loginmethod() {
      let self = this;
      var isPhone =self.checkPhone();
      if (!isPhone) return;
      var isPassword = self.checkPassword();
      if (!isPassword) return;
      // 登录
      login({phone:self.phone, password:self.password})
        .then(res => {
          if (res.data.code === "success") {
            self.$store.commit('setUser',res.data.data.account);
            self.$store.commit('setToken',res.data.data.account.token);
            self.$message({
              type:'success',
              message:'登陆成功'
            })
            self.$router.push({ name: "new" });
          } else {
            self.$message.error(res.data.message);
          }
        })
        .catch(err => {
          // 错误处理
        });
    },
    goRegist() {
      this.$router.push({ path: "regist" });
    },
    goFindPassword() {
      this.$router.push({ path: "findpassword" });
    }
  },
  components: {
    inputComponent,
    buttonComponent,
    headerCom,
    footerCom
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
  margin: 40px auto 40px;
}
.finishDiv > a {
  float: right;
  font-size: 14px;
  color: #fff;
  margin-top: 12px;
  cursor: pointer;
}
.finishButton {
  width: 100%;
  height: 53px;
  color: #ffffff;
  background: #ff8000;
}
.form-bottom {
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
.loginButton {
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

