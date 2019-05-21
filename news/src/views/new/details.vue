<template>
  <div class="main">
    <headerCom class="header" :color="'#fff'"></headerCom>
    <div class="content">
      <div class="details">
        <div class="comment-msg">
          <ul>
            <li>
              <img src="../../assets/icon_comment_color.png" alt>
              {{news.comment_sum}}
            </li>
            <li>
              <img src="../../assets/icon_saw_color.png" alt>
              {{news.comment_sum}}
            </li>
            <li class="fenxiangLi">
              <img src="../../assets/icon_share.png" @click="isImg = !isImg">
              <img src="../../assets/fenxiang.png" class="fenxiang" v-show="isImg">
            </li>
          </ul>
        </div>
        <div class="news-details">
          <div class="title">{{news.title}}</div>
          <div class="message">
            <span>{{news.source}}</span>
            <span>{{news.create_time | getTime}}</span>
          </div>
          <div class="detials-img">
            <img src="../../assets/new.png" alt="图片" class="details-image">
          </div>
          <div class="content" v-html="news.details">
            <!-- <p>介夫子消息，12月25日滴滴介夫子消息，12月25日滴滴介夫子消息，12月25日滴滴介夫子消息，12月25日滴滴介夫子消息，12月25日滴滴介夫子消息，12月25日滴滴介夫子消息，12月25日滴滴介夫子消息，12月25日滴滴介夫子消息，12月25日滴滴介夫子消息，12月25日滴滴介夫子消息，12月25日滴滴</p> -->
          </div>
          <div class="publish-comment">
            <h2>新闻点评</h2>
            <textarea
              rows="1"
              class="comment-texerea"
              placeholder="我有话要说...."
              v-model="commentcontent"
            ></textarea>
            <inputButton
              class="comment_btn"
              :value="this.$store.state.token?'评论':'登陆评论'"
              @click.native="comment"
            ></inputButton>
          </div>
          <div class="new-comment">
            <h2>最近评论</h2>
            <div class="body" v-for="(commentIds,index) in commentIdsList" :key="index">
              <comment
                :commentList="commentList"
                :commentIds="commentIds"
                :level="commentIds.split(',').length"
                @load="load"
              ></comment>
            </div>
            <div class="loading" v-if="isloading">
              <el-button :loading="true">加载中</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footerCom :style="{}"></footerCom>
  </div>
</template>
<script>
import headerCom from "../../components/common/header";
import footerCom from "../../components/common/footer";
import inputButton from "../../components/input/input-button";
import comment from "../../components/new/comment";
import { getDetails, getCommentList, addComment } from "../../api/new.js";
import { filterTime,tokenMethod } from "../../utils/utils";
export default {
  components: {
    headerCom,
    footerCom,
    inputButton,
    comment
  },
  data() {
    return {
      news: {},
      imgUrl: "",
      id: "",
      page: 1,
      limit: 10,
      commentList: {},
      commentIdsList: [],
      commentcontent: "",
      isImg: false,
      count: 0,
      isloading: true
    };
  },
  filters: {
    getTime(value) {
      return filterTime(value);
    }
  },
  methods: {
    // 获取评论列表
    getcomment_list() {
      let self = this;
      getCommentList({ id: self.id, page: self.page, limit: self.limit })
        .then(res => {
          if (res.data.code === "success") {
            self.commentList = Object.assign(
              {},
              self.commentList,
              res.data.data.comments
            );

            self.commentIdsList = self.commentIdsList.concat(
              res.data.data.commentIds
            );
            self.count = res.data.data.counts;
            self.page += 1;
          } else {
            self.$message.error(res.data.message);
          }
        })
        .catch(err => {
          // 错误处理
          console.log(err);
        });
    },
    // 获取文章详情
    getdetails() {
      let self = this;
      getDetails({ id: self.id })
        .then(res => {
          if (res.data.code === "success") {
            self.news = res.data.data.news;
            self.imgUrl = require("@/assets/new.png");
          } else {
            self.$message.error(res.data.message);
          }
        })
        .catch(err => {
          // 错误处理
          self.$router.push("/404");
        });
    },
    // 评论
    comment() {
      let self = this;
      if (!self.$store.state.token) {
        self.$router.push({ name: "login" });
      } else {
        if (!self.commentcontent) {
          self.$message({
            type: "warning",
            message: "请输入评论内容"
          });
        } else {
          addComment({
            articleId: self.id,
            commentId: null,
            content: self.commentcontent,
            token: self.$store.state.user.token
          })
            .then(res => {
              if (res.data.code === "success") {
                self.load();
                self.$message({
                  message: "评论成功",
                  type: "success"
                });
                self.commentcontent = "";
              } else {
                tokenMethod({
                  code: res.data.code,
                  message: res.data.message,
                  self
                });
              }
            })
            .catch(err => {
              // 处理错误
              self.$router.push("/404");
            });
        }
      }
    },
    load() {
      let self = this;
      self.page = 1;
      self.page2 = 1;
      self.commentIdsList = [];
      self.commentList = {};
      self.getcomment_list(self.id);
    },
    commentScroll() {
      let self = this;
      let loading = document.querySelector(".loading");
      let arr = document.querySelectorAll(".body");
      if (!loading) return;
      if (
        loading.offsetTop -
          document.documentElement.scrollTop +
          loading.clientHeight <
        document.documentElement.clientHeight
      ) {
        arr.length < self.count
          ? self.getcomment_list(self.id)
          : (self.isloading = false);
      }
    }
  },

  created() {
    let self = this;
    self.id = self.$route.params.id;
    self.getdetails();
    self.getcomment_list();
  },
  mounted() {
    window.addEventListener("scroll", _.throttle(this.commentScroll, 2000));
  },
  beforeDestroy() {
    window.removeEventListener("scroll", _.throttle(this.commentScroll, 2000));
  }
};
</script>
<style scoped>
.main .content > p {
  font-size: 16px;
  color: #333333;
}
.main .content .details {
  width: 100%;
  position: relative;
}
.main .content .details .comment-msg {
  position: absolute;
  top: 66px;
  left: 80px;
  font-size: 14px;
  color: #9b9b9b;
}
.main .content .details .comment-msg > ul > li {
  height: 30px;
  width: 134px;
  padding: 10px 0 10px 0;
}
.main .content .details .comment-msg > ul > li:nth-child(2) {
  border-bottom: 1px solid #dcdcdc;
}
.main .content .details .comment-msg > ul > li > img {
  margin-right: 10px;
  vertical-align: middle;
}
.main .content .details .comment-msg > ul .fenxiangLi {
  position: relative;
}
.main .content .details .comment-msg > ul .fenxiangLi > .fenxiang {
  position: absolute;
  top: 12px;
  right: -25px;
  border: 1px solid #ddd;
}
.main .content .details .comment-msg > ul .fenxiangLi > img {
  cursor: pointer;
}
.main .content .details .news-details {
  width: 858px;
  margin: auto;
}
.main .content .details .news-details .title {
  font-size: 26px;
  color: #333333;
  padding: 20px 0 20px 0;
}
.main .content .details .news-details .message {
  padding-bottom: 20px;
  font-size: 14px;
}
.main .content .details .news-details .message > span:first-child {
  color: #333333;
  margin-right: 20px;
}
.main .content .details .news-details .content {
  padding: 10px 20px 30px;
}
.main .content .details .news-details .message > span:last-child {
  color: #9b9b9b;
}
.main .content .details .news-details .detials-img {
  width: 655px;
  height: 337px;
  margin: auto;
}
.main .content .details .news-details .detials-img .details-image {
  width: 100%;
  height: 100%;
}
.main .content .details .news-details .publish-comment {
  border-top: 1px solid #dcdcdc;
  padding: 20px 0 20px 0;
}
.main .content .details .news-details .publish-comment::after {
  content: "";
  display: block;
  clear: both;
}
.main .content .details .news-details .publish-comment > h2,
.main .content .details .news-details .new-comment > h2 {
  font-size: 16px;
  color: #6f6f6f;
  font-weight: 0;
  font-family: MicrosoftYaHei;
}
.main .content .details .news-details .new-comment > h2 {
  margin: 0;
}
.main .content .details .news-details .new-comment > h2 {
  border-bottom: 1px solid #dcdcdc;
  padding-bottom: 20px;
}
.main .content .details .news-details .publish-comment .comment-texerea {
  width: 100%;
  border: 1px solid #979797;
  border-radius: 4px;
  resize: none;
  font-size: 16px;
  padding: 10px 20px;
  box-sizing: border-box;
}
.main .content .details .news-details .publish-comment .comment_btn {
  width: 110px;
  height: 36px;
  background: #ff8000;
  color: #ffffff;
  float: right;
  margin-top: 10px;
}
.main .content .details .news-details .new-comment .body {
  padding: 30px 10px 30px 10px;
  border-bottom: 1px solid #dcdcdc;
  overflow: auto;
}
::-webkit-input-placeholder {
  color: #9b9b9b;
  font-size: 16px;
  font-family: "MicrosoftYaHei";
}
::-moz-placeholder {
  color: #9b9b9b;
  font-size: 16px;
  font-family: "MicrosoftYaHei";
}
::-ms-input-placeholder {
  color: #9b9b9b;
  font-size: 16px;
  font-family: "MicrosoftYaHei";
}
.loading {
  text-align: center;
}
.el-button {
  border: none;
}
.header {
  background: #0074ff;
}
</style>
