<template>
  <div>
    <div class="comment-item" v-for="comment in comments" :key="comment.commentId">
      <div class="time">{{comment.create_time | getTime}}</div>
      <div class="content">
        <p>
          <span class="comment-content">{{comment.content}}</span>
          <span>
            <img src="@/assets/icon_comment.png">
          </span>
          <span>
            <img :src="isup">
            {{comment.vote}}
          </span>
          <span>
            <img :src="isdown">
            {{comment.against}}
          </span>
        </p>
        <p class="gailou" v-if="comment.data">
          <span>盖楼被隐藏</span>
          <span>
            {{!(isShow.indexOf(comment.commentId)===-1)?'折叠':'展开'}}
            <img :src="!(isShow.indexOf(comment.commentId)===-1)===-1?arrowUp:arrowDown" alt @click="getcomments_level(comment.commentId)">
          </span>
        </p>
        <div class="body" v-if="!(isShow.indexOf(comment.commentId)===-1)">
          <comment
            :flag="'sss'"
            :commentList="comment.data.comments"
            :commentIds="comment.data.commentIds"
            :level="comment.data.commentIds.split(',').length"
          ></comment>
        </div>
      </div>
      <router-link :to="{name:'details',params:{id:comment.articleId._id}}"></router-link>
      <p class="commentform">{{comment.articleId.title}}</p>
    </div>
  </div>
</template>
<script>
import up from "../../assets/icon_thumb_up.png";
import upActive from "../../assets/icon_thumb_up_active.png";
import down from "../../assets/icon_thumb_down.png";
import downActive from "../../assets/icon_thumb_down_active.png";
import comment from "../new/comment.vue";
import arrowDown from "../../assets/icon_arrow_down_color.png";
import arrowUp from "../../assets/icon_arrow_up_color.png";
import { comments_level } from "../../api/account.js";
export default {
  props: ["comments"],
  data() {
    return {
      isShow: [],
      arrowDown,
      arrowUp,
      isup: up,
      isdown: up,
      commentList: {},
      commentIds: ""
    };
  },
  components: {
    comment
  },
  methods: {
    getcomments_level(commentId) {
      let self = this;
      comments_level({commentId})
        .then(res => {
          if (res.data.code === "success") {
            self.commentList = res.data.data.comments;
            self.commentIds = res.data.data.commentIds;
            let index = self.isShow.indexOf(commentId);
            index === -1 ? self.isShow.push(commentId):self.isShow.splice(index,1);
          
          } else {
            self.$message.error(res.data.message);
          }
        })
        .catch(err => {
          // 错误处理
        });
    },

  },
  filters: {
    getTime(value) {
      return moment(new Date(value)).format("MM-DD HH-mm");
    }
  },
  watch:{
    comments(){
      for (index in comments){
        getcomments_level(comments[index].commentId);
      }
    }
  },
};
</script>
<style scoped>
.comment-item {
  border-bottom: 1px solid #dcdcdc;
  margin-bottom: 20px;
}
.comment-item > .content > p > span:not(:first-child) {
  float: right;
  margin-left: 20px;
}
.comment-item > .content > p > span:not(:first-child) > img {
  vertical-align: middle;
  margin-right: 5px;
}
.commentform {
  cursor: pointer;
}
.gailou > span:nth-child(2) {
  color: #ff8000;
}
.gailou > span:nth-child(2) > img {
  margin-left: 10px;
  cursor: pointer;
}
.comment-item > div,
.commentform {
  font-size: 14px;
  color: #6f6f6f;
}
.comment-content {
  color: #333;
}
</style>
