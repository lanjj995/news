<template>
  <div class="main">
    <headerCom :color="'#fff'" class="accountHeader"></headerCom>
    <div class="content">
      <div class="header">
        <img v-lazy="this.$store.state.avatar" title="头像">
      </div>

      <div class="account-content">
        <div class="nav" :style="{top:top}">
          <ul>
            <li
              :class="{active:this.$store.state.isMessageActive =='mycomment'}"
              @click="goComment"
            >我的评论</li>
            <li
              :class="{active:this.$store.state.isMessageActive =='mymessage'}"
              @click="goMessage"
            >我的消息({{count}})</li>
          </ul>
        </div>
        <div class="account-content-right">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <footerCom></footerCom>
  </div>
</template>

<script>
import headerCom from "../../components/common/header";
import footerCom from "../../components/common/footer";
import { messageCount } from "../../api/account.js";
import { tokenMethod } from "../../utils/utils";
export default {
  components: {
    headerCom,
    footerCom
  },
  data() {
    return {
      count: 0,
      top: 0
    };
  },
  methods: {
    getMessageCount(token) {
      let self = this;
      messageCount({ token })
        .then(res => {
          res.data.code === "success"
            ? (self.count = res.data.count)
            : tokenMethod({
                code: res.data.code,
                message: res.data.message,
                self
              });
        })
        .catch(err => {
          // 错误处理
        });
    },
    goComment() {
      let self = this;
      self.$router.push({ name: "mycomment" });
      self.$store.commit("setMessageActive", "mycomment");
    },
    goMessage() {
      let self = this;
      self.$router.push({ name: "mymessage" });
      self.$store.commit("setMessageActive", "mymessage");
    },
    scrollTop(){
      let self = this;
      if (document.documentElement.scrollTop - 145> 0){
        self.top = (document.documentElement.scrollTop - 145) + 'px';
      }else {
        self.top = 0;
      }
    }
  },
  created() {
    let self = this;
    self.$router.push({ name: self.$store.state.isMessageActive });
  },
  mounted() {
    window.addEventListener("scroll",this.scrollTop);
  },
  beforeDestroy(){
    window.removeEventListener("scroll",this.scrollTop);    
  }
};
</script>

<style scoped>
.content {
  background: #f9f9f9;
  position: relative;
  padding-bottom: 30px;
}
.content .header {
  width: 127px;
  height: 127px;
  border-radius: 50%;
  position: relative;
  margin: auto;
}
.content .header > img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: absolute;
  top: -64px;
}
.content .account-content {
  width: 1046px;
  margin: auto;
  position: relative;
}
.content .account-content .nav {
  background: #ffffff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.12);
  display: inline-block;
  position: absolute;
  top: 0px;
  color: #333333;
}
.content .account-content .nav ul li {
  width: 134px;
  height: 30px;
  font-size: 16px;
  line-height: 30px;
  text-align: center;
  margin: 20px 0 20px 0;
  cursor: pointer;
}
.content .account-content .account-content-right {
  width: 896px;
  display: inline-block;
  margin-left: 150px;
  background: #fff;
  font-size: 14px;
  padding: 20px;
  box-sizing: border-box;
}
.accountHeader {
  height: 334px;
  color: #fff;
  background: url("../../assets/bg_my.png");
}
a {
  color: #333;
}
.active {
  border-left: 4px solid #ff8000;
  color: #ff8000;
}
</style>

