<template>
  <div class="article" @click="goDetails(''+ item._id +'')" :title="item.title">
    <div class="msg">
      <div class="title" :title="item.title">{{item.title | titleFilter}}</div>
      <div class="message">
        <div class="message-left">
          <span v-for="i in item.keywords" :key="i">{{i}}</span>
        </div>
        <div class="message-right">
          <span>
            <img :src="commentUrl" style="vertical-align:middle;"> {{item.comment_sum}}
          </span>
          <span>
            <img :src="sawUrl" style="vertical-align:middle;"> {{item.comment_sum}}
          </span>
        </div>
      </div>
      <!-- <img :src="item.cover?'https://dev.apis.ittim.ltd/nWGq7NqEf/static/'+item.cover:newImg" class="articleImg"> -->
      <div class="time">
        <p>{{item.create_time | getTime}}</p>
        <p :title="item.source">{{item.source | sourcefilter}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import newImg from "@/assets/new.png";

export default {
  props:{
    item:Object
  },
  data(){
    return {
      commentUrl:"",
      sawUrl:"",
      newImg
    }
  },
  methods:{
    goDetails(id){
      this.$router.push({name:'details',params:{id}});
    },
    isless10(value) {
      return value > 10 ? value : '0' + vaue;
    }
  },
  filters:{
    titleFilter(value) {
        return value.length>23?value.substring(0,23)+"...":value;
    },
    getTime(value){
      let create_time = new Date(value);
      let now = new Date();
      let cha = now.getTime() - create_time;
      // 小于一天
      return (cha < 24*60*60*1000) 
      ? (cha < 60*60*1000 ? Math.floor(cha/(60*1000)) + '分钟前' : Math.floor(cha/(60*60*100)) + '小时前') 
      :  this.isless10(create_time.getMonth()+1) + "月" + this.isless10(create_time.getDate()) + "日";
    },
    sourcefilter(value){
      return value.length > 5 ? value.substring(0,5)+"..." : value;
    }
  },
  created(){
    let self = this;
    self.commentUrl = require("@/assets/icon_comment.png");
    self.sawUrl = require("@/assets/icon_saw.png");
    }
};
</script>
<style scoped>
.article {
  background: #fff;
  width: 726px;
  height: 300px;
  margin-top: 50px;
  position: relative;
  cursor: pointer;
}
.article> .msg {
  width: 80%;
  float: right;
}
.msg > .title {
  font-size: 24px;
  color: #333333;
  padding: 20px 0 10px 0;
}
.message {
  width: 80%;
  font-size: 14px;
  color: #9b9b9b;
  padding-bottom: 10px;
}
.message-left {
  display: inline-block;
  float: left;
}
.message-left > span {
  margin-right: 20px;
}
.message-right {
  float: right;
}
.message-right > span {
  margin-left: 20px;
}
.message::after {
  content: "";
  display: block;
  clear: both;
}
.articleImg {
  width: 418.6px;
  height: 184.6px;
}
.time {
  width: 140px;
  height: 78px;
  background: #ffffff;
  border: 1px solid #dcdcdc;
  font-size: 24px;
  color: #9b9b9b;
  padding: 10px;
  box-sizing: border-box;
  position: absolute;
  top: -24px;
  left: -30px;
}
.time > p {
  margin: 0;
  padding: 0;
  text-align: center;
}
.time > p:last-child {
  text-align: left;
  padding-top: 4px;
  box-sizing: border-box;
  font-size: 14px;
}
</style>
