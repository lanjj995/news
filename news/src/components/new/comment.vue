<template>
  <!-- 通过判断level是否等于commentIds的长度来判断是否为楼层的顶部，如果是则实行else，不是的就接着递归 -->

  <div class="comment-box" v-if="level !== commentIds1.split(',').length || flag">
    <img src="@/assets/logo.png" alt>
    <div class="inner-box">
      <span class="user">{{commentList[commentId].user.nickname}}</span>
      <span class="time">{{commentList[commentId].create_time | getTime}}</span>
      <span class="floor-count" v-show="!flag">{{commentList[commentId].buildLevel+"楼"}}</span>
      <p class="content">
        <span>{{commentList[commentId].content}}</span>
        <span @click="commentRateShow = !commentRateShow">
          <img src="@/assets/icon_comment.png">
        </span>
        <span @click="addcommentRate(''+commentId+'','vote')">
          <img :src="isup">
          {{commentList[commentId].vote}}
        </span>
        <span @click="addcommentRate(''+commentId+'','against')">
          <img :src="isdown">
          {{commentList[commentId].against}}
        </span>
      </p>
      <div class="comment-rate" v-show="commentRateShow">
        <textarea cols="30" rows="10" placeholder="请输入评论" v-model="commentRateContent"></textarea>
        <p>
          <buttonCom
            style="height:36px;padding:0 10px;background: #FF8000;color:#fff;float:right;margin-right:20px;"
            :value="this.$store.state.token?'发表':'登陆发表'"
            @click.native="addcommentMethod"
          ></buttonCom>
        </p>
      </div>
    </div>
    <commentBox
      v-if="level !== 1"
      v-bind:commentList="commentList"
      v-bind:commentIds="commentIds1"
      :level="level - 1"
      :flag="flag"
    />
  </div>

  <div v-else class="comment-item">
    <!-- <img :src="commentList[commentId].user.avatar ? `http://192.168.1.99:8765/PBumsXFDc/static/${commentList[commentId].user.avatar}` : avatar" alt=""> -->
    <img src="@/assets/logo.png" alt>
    <div class="inner-box">
      <span class="user">{{commentList[commentId].user.nickname}}</span>
      <span class="time">{{commentList[commentId].create_time | getTime}}</span>

      <p class="content">
        <span class="content-content">{{commentList[commentId].content}}</span>
        <span @click="commentRateShow = !commentRateShow">
          <img src="@/assets/icon_comment.png">
        </span>
        <span @click="addcommentRate(''+commentId+'','vote')">
          <img :src="isup">
          {{commentList[commentId].vote}}
        </span>
        <span @click="addcommentRate(''+commentId+'','against')">
          <img :src="isdown">
          {{commentList[commentId].against}}
        </span>
      </p>
      <div class="comment-rate" v-show="commentRateShow">
        <textarea cols="30" rows="10" placeholder="请输入评论" v-model="commentRateContent"></textarea>
        <p>
          <buttonCom
            style="height:36px;padding:0 10px;background: #FF8000;color:#fff;float:right;margin-right:20px;"
            :value="this.$store.state.token?'发表':'登陆发表'"
            @click.native="addcommentMethod"
          ></buttonCom>
        </p>
      </div>

      <commentBox
        v-if="level !== 1"
        v-bind:commentList="commentList"
        v-bind:commentIds="commentIds1"
        :level="level - 1"
      />
    </div>
  </div>
</template>

<script>
// 引入默认头像
import avatar from "../../assets/logo.png";
import up from "../../assets/icon_thumb_up.png";
import upActive from "../../assets/icon_thumb_up_active.png";
import down from "../../assets/icon_thumb_down.png";
import downActive from "../../assets/icon_thumb_down_active.png";
import buttonCom from "../input/input-button";
import { addComment, commentRate } from "../../api/new.js";
import { filterTime,tokenMethod } from "../../utils/utils";
export default {
  name: "commentBox",
  props: ["commentList", "commentIds", "level", "flag"],
  components: {
    buttonCom
  },
  data() {
    return {
      commentRateShow: false,
      commentRateContent: "",
      isup: up,
      isdown: down,
      commentIds1: ""
    };
  },
  methods: {
    addcommentMethod() {
      let self = this;
      if (self.$store.state.user) {
        if (!self.commentRateContent) {
          self.$message({
            message: "请输入评论内容",
            type: "warning"
          });
        } else {
          addcomment({
            articleId: null,
            commentId: self.commentId,
            content: self.commentRateContent,
            token: self.$store.state.user.token
          })
            .then(res => {
              if (res.data.code === "success") {
                self.$emit("load");
                self.$message({
                  message: "评论成功",
                  type: "success"
                });
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
              self.$router.push("/404");
            });
        }
      } else {
        self.$router.push({ path: "/user/login" });
      }
    },
    addcommentRate(commentId, rate) {
      let self = this;
      if (self.isup === upActive) {
        self.$message({
          type: "warning",
          message: "已顶过"
        });
        return;
      }
      if (self.isdown === downActive) {
        self.$message({
          type: "warning",
          message: "已踩过"
        });
        return;
      }
      if (!self.$store.state.user.token) {
        self
          .$confirm("登陆后才能评论", "提示", {
            confirmButtonText: "去登陆",
            cancelButtonText: "返回",
            type: "warning"
          })
          .then(() => {
            self.$router.push({ name: "login" });
          })
          .catch(() => {});
        return;
      }
      commentRate({ commentId, token: this.$store.state.user.token, rate })
        .then(res => {
          if (res.data.code === "success") {
            if (rate === "against") {
              self.isdown = downActive;
              self.commentList[commentId]["against"] += 1;
            } else {
              self.isup = upActive;
              self.commentList[commentId]["vote"] += 1;
            }
          } else {
            tokenMethod({
              code: res.data.code,
              message: res.data.message,
              self
            });
          }
        })
        .catch(err => {
          self.$router.push("/404");
        });
    }
  },
  computed: {
    commentId() {
      return this.commentIds1.split(",")[this.level - 1];
    },
    avatar: function() {
      return avatar;
    }
  },
  filters: {
    getTime(value) {
      return filterTime(value);
    }
  },

  watch: {
    commentIds(value) {
      this.commentIds1 = value;
    }
  },
  created() {
    this.commentIds1 = this.commentIds;
  },
};
</script>

<style scoped>
.comment-rate > textarea {
  width: 100%;
  height: 114px;
  background: #fcfcfc;
  border: 1px solid #979797;
  padding: 10px;
  box-sizing: border-box;
  resize: none;
}
p {
  padding: 0;
  overflow: auto;
}
.comment-box {
  padding: 5px;
  border: 1px solid #adadad;
  background: #f3f3f3;
}
.comment-box > img {
  float: left;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  vertical-align: middle;
}
.comment-item > img {
  float: left;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  vertical-align: middle;
}
.comment-info span,
.inner-box span {
  font-size: 12px;
}
.user,
.time {
  color: #6f6f6f;
}
.comment-item .inner-box {
  margin-left: 50px;
}
.floor-count {
  float: right;
  color: #333;
}
.content {
  margin: 10px 0;
}
.content > span > img {
  vertical-align: middle;
  margin-right: 5px;
}
.content > span:not(:first-child) {
  font-size: 14px;
  color: #6f6f6f;
  float: right;
  margin-left: 20px;
}
span {
  cursor: pointer;
}
.user {
  margin-left: 5px;
  margin-right: 20px;
}
</style>