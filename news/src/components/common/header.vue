<template>
  <header>
    <router-link :to="{name:'new'}">
      <div :class="logoClass"></div>
      <a class="name" :style="{color:color}">新闻项目</a>
    </router-link>
    <div class="user_onlogin" title="新闻" v-if="this.$store.state.token">
       <router-link :to="{name:'mymessage'}">
        <img v-lazy="myheader" alt="头像" class="header" title="我的消息"/>
        <span class="username"  title="我的消息" >{{this.$store.state.user.nickname}}</span>
       </router-link>

      <div class="arrow">
        <img src="../../assets/icon_arrow_down.png" class="arrow_down">
        <nav>
          <router-link :to="{name:'accountmessage'}">
            <li>
              <img src="../../assets/icon_my.png">
              我的账户
            </li>
          </router-link>
          <li @click="loginOut">
            <img src="../../assets/icon_out.png">
            退出登录
          </li>
        </nav>
      </div>
    </div>
    <div class="user_nologin" v-else>
      <router-link to="/login" :style="{color:color}">登录</router-link>
      <router-link to="/regist" :style="{color:color}">注册</router-link>
    </div>
  </header>
</template>
<script>
import defaultAvator from "../../assets/header.png";
export default {
  props: {
    color: String
  },
  data() {
    return {
      user: {},
      avatar: "",
      defaultAvator
    };
  },
  methods: {
    loginOut() {
      let self = this;
      self.$store.commit('setUser','');
      self.$store.commit('setToken','');
      self.$store.commit('setAvatar','');
      self.$router.push({ name: "login" });
    }
  },
  computed: {
    logoClass(){
      return this.color === "#fff" ? 'logo_white' : 'logo_color';
    },
    myheader(){
      let self = this;
      return self.$store.state.avatar?self.$store.state.avatar:self.$store.state.user.avatar?'https://dev.apis.ittim.ltd/nWGq7NqEf/static/'+self.$store.state.user.avatar:defaultAvator;
    }
  },
  created() {
    let self = this;
    self.user = self.$store.state.user;
    self.avatar = self.$store.state.avatar;
  }
};
</script>

<style scoped>

header {
  width: 100%;
  height: 80px;
  line-height: 80px;
}

header .logo_white, header .logo_color{
  display: inline-block;
  width: 120px;
  height: 80px;
  margin-left: 130px;
  vertical-align: middle;
}

header .logo_white {
  background: url("../../assets/logo_white.png") no-repeat 0 40%;
}

header .logo_color {
  background: url("../../assets/logo_color.png") no-repeat 0 40%;
}

header .name {
  font-size: 24px;
  color:#fff;
  margin-left: 20px;
}

header .user_nologin {
  display: block;
  height: 80px;
  float: right;
}

header .user_nologin > a:last-child {
  margin: 0 130px 0 30px;
}
.user_onlogin {
  height: 100%;
  display: block;
  float: right;
  color: #fff;
  font-size: 18px;
  margin-right: 130px;
}

header .user_onlogin .header {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 20px;
}

header .user_onlogin .username {
  color: #fff;
}

header .user_onlogin .arrow_down {
  margin-left: 20px;
  vertical-align: middle;
  cursor: pointer;
  transition: transform 1s;
}

header .user_onlogin .arrow {
  display: inline-block;
  padding-left:30px;
  position: relative;
  cursor: pointer;
}

header .user_onlogin .arrow:hover nav{
  height: 120px;
  box-shadow: -2px -2px 3px 1px rgba(39, 52, 101, 0.08),
    2px 2px 3px 1px rgba(39, 52, 101, 0.08);
}

header .user_onlogin .arrow:hover .arrow_down {
  transform: rotate(180deg);
}

header .user_onlogin nav {
  width: 140px;
  height: 0;
  list-style: none;
  font-size: 14px;
  color: #333;
  position: absolute;
  right:0;
  z-index: 999;
  background: #fff;
  transition: 0.8s;
  overflow: hidden;
}
header .user_onlogin nav li {
  height: 60px;
  line-height: 60px;
  padding: 0 15px;
  color: #333;
  cursor: pointer;
}
header .user_onlogin nav li:hover {
  background: #0074FF;
  color: #fff;
}
header .user_onlogin nav li img {
  vertical-align: middle;
  margin-right: 9px;
}
</style>