<template>
  <div class="main">
    <headerComponent style="background:#0074ff;color:#fff;" :color="'#ffffff'"></headerComponent>
    <div class="content">
       <div class="form">
    <div class="title">
      <span></span>账户设置
    </div>
    <div class="content">
      <div class="avator">
        <img
        :src="this.src?src:this.$store.state.avatar?this.$store.state.avatar:this.$store.state.user.avatar?'https://dev.apis.ittim.ltd/nWGq7NqEf/static/'+this.$store.state.user.avatar:header"

          @mouseover="isshow=true"
        >
        <label for="avator" class="avatorLable" v-show="isshow" @mouseout="isshow=false">上传头像</label>
        <input
          type="file"
          id="avator"
          @change="sheckFileSize"
          accept="image/x-png, image/gif, image/jpeg, image/bmp"
        >
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
            <inputButtonCom
              style="width:110px;height:38px;float:right;background: #FF8000;color:#fff;vertical-align: middle;"
              value="修改"
              @click.native="toUpdatePsw"
            ></inputButtonCom>
          </td>
        </tr>
      </table>
    </div>
    <div class="submit">
      <inputButtonCom
        style="width:110px;color:#fff;height:38px;background: rgb(255, 128, 0);"
        @click.native="updateUserMessageMethod"
        value="保存"
      ></inputButtonCom>
    </div>
  </div>
    </div>
    <footerComponent class="footer"></footerComponent>
  </div>
</template>
<script>
import headerComponent from "../components/common/header";
import footerComponent from "../components/common/footer";
import inputCom from "../components/input/input-text";
import inputButtonCom from "../components/input/input-button";
import { updateUserMessage } from "../api/account.js";
import { tokenMethod } from "../api/token.js";
import header from "../assets/header.png";
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
      checkFile: false,
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
      console.log(file.size);
      if (file) {
        let size = file.size / 1024;
        if (size > 300) {
          self.$message.error("上传文件不能大于300K");
        } else {
          self.checkFile = true;
          // 获取文件读取对象
          var reader = new FileReader();
          // 文件读取完后的展示图片
          reader.addEventListener(
            "load",
            () => {
              self.src = reader.result;
            },
            false
          );
          reader.readAsDataURL(file);
        }
      }
    },
    toUpdatePsw() {
      this.$router.push("/accountupdate");
    },
    updateUserMessageMethod() {
      let self = this;
      if (self.checkFile) {
        // 有头像
        if (self.checkUsername === "err_long") {
          self.$message.error("昵称长度不能大于32个字符");
          return;
        }
        let avator = document.getElementById("avator");
        let file = avator.files[0];
        updateUserMessage({token:self.$store.state.user.token,avatar:file, nickname:self.username})
          .then(res => {
            if (res.data.code === "success") {
              let user = JSON.parse(localStorage.getItem('user'));
              user.nick = self.nickname;
              self.$store.commit('setUser',user);
              self.$store.commit('setAvatar',self.src);
              self.$message({ type: "success", message: res.data.message });
            } else {
             tokenMethod({code:res.data.code,message:res.data.message,self});
            }
          })
          .catch(err => {
            // 错误处理
          });
      } else {
        if (self.checkUsername === "success") {
          updateUserMessage({token:self.$store.state.user.token, avatar:null, nickname:self.username})
            .then(res => {
              if (res.data.code === "success") {
                let user = JSON.parse(localStorage.getItem('user'));
              user.nick = self.nickname;
              self.$store.commit('setUser',user);
              self.$message({ type: "success", message: res.data.message });
              } else {
                tokenMethod({code:res.data.code,message:res.data.message,self});
              }
            })
            .catch(err => {
              // 错误处理
            });
        } else {
          self.$alert(this.checkUsername, "提示信息", {
            confirmButtonText: "确定"
          });
        }
      }
    }
  },
  watch: {
    username(value) {
      let self = this;
      if (!value) {

        self.checkUsername = "err_null";
        self.checkUsername = "昵称不能为空";
        return;
      }
      if (value.length > 32) {
        self.$message.error("昵称长度不能大于32个字符");
        self.checkUsername = "昵称长度不能大于32个字符";
        return;
      }
      if (value === self.$store.state.user.nickname) {
        self.checkUsername = "您的昵称没有改变";
        return;
      }
      self.checkUsername = "success";
    }
  },
  created() {
    let self = this;
    self.username = self.$store.state.user.nickname;
    document.documentElement.scrollTop = 0;
    window.onscroll = function(){}
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
.content {
  padding: 50px 0 50px 0;
}
.form {
  width: 1032px;
  height: 566px;
  background: #ffffff;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.11);
  margin: auto;
}
.footer {
  position: absolute;
  bottom: 0;
}

.title {
  height: 30px;
  padding: 30px 0 30px 0;
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
.avator {
  width: 82.6px;
  margin: auto;
  position: relative;
}
.submit {
  text-align: center;
}
.form > .content {
  text-align: center;
}
.avator > img {
  width: 82.6px;
  height: 82.6px;
  border-radius: 50%;
}
.avatorLable {
  display: block;
  width: 82.6px;
  height: 82.6px;
  border-radius: 50%;
  line-height: 82.6px;
  background: rgba(0, 0, 0, 0.1);
  color: #fff;
  margin: auto;
  position: absolute;
  top: 0;
}

table {
  margin: auto;
}
table > tr > td {
  width: 100px;
  height: 50px;
}
table > tr > td:nth-child(2) {
  text-align: left;
  line-height: 50px;
}

input[type="file"] {
  display: none;
  background: transparent;
}
</style>
