<template>
  <div class="main">
    <headerComponent class="header" :color="'#fff'"></headerComponent>
    <div class="content">
      <div class="form">
        <div class="title">
          <span></span>账户设置
        </div>
        <div class="content">
          <div class="avator">
            <label for="avator" class="avatorLable">
              <span class="avatar_span">上传头像</span>
              <img :src="headerImg">
              <input
                type="file"
                id="avator"
                @change="sheckFileSize"
                accept="image/x-png, image/gif, image/jpeg, image/bmp"
              >
            </label>
          </div>
          <p>{{this.$store.state.user.nickname}}</p>

          <table>
            <tr>
              <td>昵称</td>
              <td>
                <inputCom
                  style="height:51px;"
                  :width="380"
                  :height="38"
                  :border="'1px solid #6f6f6f'"
                  v-model="username"
                ></inputCom>
              </td>
            </tr>
            <tr>
              <td>手机号</td>
              <td>182*****440</td>
            </tr>
            <tr>
              <td>密码</td>
              <td>
                ******
                <router-link :to="{name:'accountupdate'}">
                  <inputButtonCom class="input_button" value="修改"></inputButtonCom>
                </router-link>
              </td>
            </tr>
          </table>
        </div>
        <div class="submit">
          <inputButtonCom class="submit_button" @click.native="updateUserMessageMethod" value="保存"></inputButtonCom>
        </div>
      </div>
    </div>
    <footerComponent class="footer"></footerComponent>
  </div>
</template>
<script>
import headerComponent from "../../components/common/header";
import footerComponent from "../../components/common/footer";
import inputCom from "../../components/input/input-text";
import inputButtonCom from "../../components/input/input-button";
import { updateUserMessage } from "../../api/account.js";
import { tokenMethod } from "../../utils/utils";
import header from "../../assets/header.png";
export default {
  components: {
    headerComponent,
    footerComponent,
    inputCom,
    inputButtonCom
  },
  data() {
    return {
      username: "",
      isshow: false,
      checkUsername: "",
      src: "",
      header
    };
  },
  methods: {
    // 检查文件大小
    sheckFileSize() {
      let self = this;
      let avator = document.getElementById("avator");
      let file = avator.files[0];
      if (file) {
        let size = file.size / 1024;
        if (size > 300) return self.$message.error("上传文件不能大于300K");
        // 获取文件读取对象
        var reader = new FileReader();
        // 文件读取完后的展示图片
        reader.addEventListener("load",function(){
            self.src = reader.result;
        },false);
        reader.readAsDataURL(file);
      }
    },
    updateUserMessageMethod() {
      let self = this;
      if(self.checkUsername) return self.$alert(self.checkUsername, "提示信息", {confirmButtonText: "确定"});
      if (!self.src && self.username === self.$store.state.user.nickname) return self.$alert("请修改您需要修改的信息", "提示信息", {confirmButtonText: "确定"});
      let avatar = document.getElementById("avator").files[0];
      let params = { token: self.$store.state.user.token };
      if (self.src) params['avatar'] = avatar;
      if (self.username) params['nickname'] = self.username;
      updateUserMessage(params)
        .then(res => {
          if (res.data.code === "success") {
            if (self.nickname) {
              let user = self.$store.state.user;
              user.nick = self.nickname;
              self.$store.commit("setUser", user);
            }
            if (avatar) self.$store.commit("setAvatar", self.src);
            self.$message({ type: "success", message: res.data.message });
          } else {
            tokenMethod({
              code: res.data.code,
              message: res.data.message,
              self
            });
          }
        })
        .catch(err => {
          // 错误处理
        });
    }
  },
  computed: {
    headerImg() {
      let self = this;
      console.log(self.src);
      return self.src
        ? self.src
        : self.$store.state.avatar
        ? self.$store.state.avatar
        : self.$store.state.user.avatar
        ? "https://dev.apis.ittim.ltd/nWGq7NqEf/static/" +
          self.$store.state.user.avatar
        : self.header;
    }
  },
  watch: {
    username(value) {
      let self = this;
      if (!value) {
        self.checkUsername = "昵称不能为空";
        self.$message.error("昵称不能为空");
        return;
      }
      if (value.length > 32) {
        self.checkUsername = "昵称长度不能大于32个字符";
        self.$message.error("昵称长度不能大于32个字符");
        return;
      }
      self.checkUsername = "";
    }
  },
  created() {
    let self = this;
    self.username = self.$store.state.user.nickname;
  }
};
</script>
<style scoped>
.main {
  width: 100%;
  height: 100%;
  background: #f9f9f9;
  position: relative;
}
.main .content {
  padding: 50px 0 50px 0;
}
.main .content .form {
  width: 1032px;
  height: 566px;
  background: #ffffff;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.11);
  margin: auto;
}
.footer {
  margin-top: 30px;
}
.main .content .form .title {
  height: 30px;
  padding: 30px 0 30px 0;
}
.main .content .form .title > span {
  display: inline-block;
  width: 0;
  height: 100%;
  border-left: 2px solid #0074ff;
  border-right: 2px solid #0074ff;
  margin-right: 50px;
  vertical-align: middle;
}
.main .content .form .avator {
  width: 82.6px;
  margin: auto;
  position: relative;
}
.main .content .form  > .content {
  text-align: center;
}
.main .content .form .avator .avatorLable {
  display: block;
  width: 82.6px;
  height: 82.6px;
  margin: auto;
  position: relative;
}
.main .content .form .avator .avatorLable:hover .avatar_span {
  display: block;
}
.main .content .form .avator .avatorLable img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.main .content .form .avator .avatorLable .avatar_span {
  display: inline-block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.1);
  color: #fff;
  border-radius: 50%;
  line-height: 82.6px;
  display: none;
}
.main .content .form  > .content table {
  margin: auto;
}
.main .content .form  > .content table > tr > td {
  width: 100px;
  height: 50px;
}
.main .content .form  > .content table > tr > td:nth-child(2) {
  text-align: left;
  line-height: 50px;
}

.header {
  background: #0074ff;
}

.input_button {
  width: 110px;
  height: 38px;
  float: right;
  background: #ff8000;
  color: #fff;
  vertical-align: middle;
}
.submit_button {
  width: 110px;
  color: #fff;
  height: 38px;
  background: rgb(255, 128, 0);
}
input[type="file"] {
  display: none;
  background: transparent;
}
.submit {
  text-align: center;
}
</style>
