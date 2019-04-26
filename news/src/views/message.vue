<template>
  <div class="main">
    <headerCom class="accountHeader" :color="'#ffffff'"></headerCom>
    <div class="content">
      <div class="header">
        <img :src="this.$store.state.avatar?this.$store.state.avatar:defaultHeader">
      </div>
      
      <div class="account-content">
        <div class="nav1" @top="topMethod" style="top:0">
          <ul>
            
            <li :class="{active:this.$route.path.indexOf('mymessage')===-1?true:false}" @click="goComment">我的评论</li>
            <li :class="{active:this.$route.path.indexOf('mymessage')===-1?false:true}" @click="goMessage">我的消息({{count}})</li>
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
import headerCom from "../components/common/header";
import footerCom from "../components/common/footer";
import defaultHeader from "../assets/header.png";
import {messageCount} from "@/api/account.js";
import {tokenMethod} from "@/api/token.js";
export default {
  data() {
    return {
      count:0,
      defaultHeader,
      top:0
    };
  },
  components: {
    headerCom,
    footerCom
  },
  methods:{
    getMessageCount(token){
      let self = this;
      messageCount({token}).then(res => {
        res.data.code === "success" ? self.count = res.data.count :　tokenMethod({code:res.data.code,message:res.data.message,self});
      }).catch(err => {
        // 错误处理
      })
    },
    goComment(){
      let self = this;
      self.$router.push({name:'mycomment'});
      self.$store.commit('setMessageActive','mycomment');
    },
    goMessage(){
  let self = this;
      self.$router.push({name:'mymessage'});
      self.$store.commit('setMessageActive','mymessage');
    
    },
    topMethod(){
      console.log("top");
    }
  },
  created(){
    let self = this;
    self.getMessageCount(self.$store.state.token);
    document.documentElement.scrollTop = 0;
document.documentElement.scrollTop = 0;
      setTimeout(function(){
      window.scrollTo(0,0);
    },0);
    self.$router.push({name:self.$store.state.isMessageActive});
  },

};
</script>

<style scoped>
.accountHeader {
  height: 334px;
  color: #fff;
  background: url("../assets/bg_my.png");
}
.content {
  background: #f9f9f9;
  position: relative;
  padding-bottom: 30px;
}
.content > .header {
  width: 127px;
  height: 127px;
  border-radius: 50%;
  position: relative;
  margin: auto;
}
.content > .header > img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: absolute;
  top: -64px;
}

.account-content {
  width: 1046px;
  margin: auto;
  position: relative;
}
.nav1 {
  background: #ffffff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.12);
  display: inline-block;
  position: absolute;
  top: 0px;
  color: #333333;

}
a{
  color: #333;
}

.nav1 ul li {
  width: 134px;
  height: 30px;
  font-size: 16px;
  line-height: 30px;
  text-align: center;
  margin: 20px 0 20px 0;
  cursor: pointer;
}
.account-content-right{
  width: 896px;
  display: inline-block;
  margin-left: 150px;
  background: #fff;
  font-size: 14px;
  padding: 20px;
  box-sizing: border-box;
}

.active {
  border-left: 4px solid #ff8000;
  color: #ff8000;
}

</style>

