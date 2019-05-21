<template>
  <router-link :to="{name:'details',params:{id:item._id}}">
    <div class="article" :title="item.title">
      <div class="msg">
        <div class="title overflow" :title="item.title">{{item.title}}</div>
        <div class="message">
          <div class="message-left">
            <span v-for="i in item.keywords" :key="i">{{i}}</span>
          </div>
          <div class="message-right">
            <span>
              <img src="../../assets/icon_comment.png" style="vertical-align:middle;">
              {{item.comment_sum}}
            </span>
            <span>
              <img src="../../assets/icon_saw.png" style="vertical-align:middle;">
              {{item.comment_sum}}
            </span>
          </div>
        </div>
        <img v-lazy="this.$store.state.baseImgUrl+item.cover" class="article_img">
        <!-- <img :src="item.cover?'https://dev.apis.ittim.ltd/nWGq7NqEf/static/'+item.cover:newImg" class="articleImg"> -->
        <div class="time">
          <p>{{item.create_time | getTime}}</p>
          <p :title="item.source" class="overflow">{{item.source}}</p>
        </div>
      </div>
    </div>
  </router-link>
</template>
<script>
import {filterTime} from '../../utils/utils';
export default {
  props: {
    item: Object
  },
  filters: {
    getTime(value) {
      return filterTime(value);
    }
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
.article > .msg {
  width: 80%;
  float: right;
}
.article .article_img{
  width: 418.6px;
  height: 184.6px;
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
.overflow {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
