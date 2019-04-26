<template>
  <div class="main">
    <headerCom style="background:#0074ff;color:#fff;" :color="'#ffffff'"></headerCom>
    <div class="content">
      <div class="details">
        <div class="comment-msg">
          <ul>
            <li>
              <img src="@/assets/icon_comment_color.png" alt>
              {{news.comment_sum}}
            </li>
            <li>
              <img src="@/assets/icon_saw_color.png" alt>
              {{news.comment_sum}}
            </li>
            <li class="fenxiangLi">
              <img src="@/assets/icon_share.png" @click="isImg = !isImg">
              <img src="@/assets/fenxiang.png" class="fenxiang" v-show="isImg">
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
            <img src="@/assets/new.png" alt="图片" class="details-image">
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
              style="width:110px;height:36px;background:#FF8000;color:#FFFFFF;float:right;margin-top:10px;"
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
import headerCom from "../components/common/header";
import footerCom from "../components/common/footer";
import inputButton from "../components/input/input-button";
import comment from "../components/new/comment";
import { details, comment_list, addcomment } from "../api/new.js";
import { tokenMethod } from "../api/token.js";
import { create } from "domain";
export default {
  data() {
    return {
      news: {},
      imgUrl: "",
      id: "",
      page: 1,
      page2: 1,
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
      let create_time = new Date(value);
      let now = new Date();
      let cha = now.getTime - create_time;
      if (cha < 43200000) {
        if (cha < 3600000) {
          return cha / 60000 + "分钟前";
        } else {
          return cha / 3600000 + "小时前";
        }
      } else {
        function isless10(value) {
          if (value > 10) {
            return value;
          } else {
            return "0" + value;
          }
        }
        let month = create_time.getMonth() + 1;
        let day = create_time.getDate();
        return isless10(month) + "月" + isless10(day) + "日";
      }
    }
  },
  methods: {
    // 获取评论列表

    getcomment_list(id) {
      let self = this;
      if (self.page === self.page2) {
        self.page2 += 1;
        comment_list({id, page:self.page, limit:self.limit})
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
      } else {
      }
    },
    // 获取文章详情
    getdetails(id) {
      let self = this;
      details({id})
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
          addcomment({
            articleId:self.id,
            commentId:null,
            content:self.commentcontent,
            token:self.$store.state.user.token
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
                tokenMethod({code:res.data.code,message:res.data.message,self});
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
    }
  },
  components: {
      headerCom,
      footerCom,
    inputButton,
    comment
  },
  created() {
    let self = this;
    self.id = self.$route.params.id;
    self.getdetails(self.id);
    self.getcomment_list(self.id);
    document.documentElement.scrollTop = 0;
   
  },
  mounted() {
    window.onscroll = () => {
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
        arr.length < this.count ? self.getcomment_list(self.id):self.isloading = false;
      }
    };
  }
};
</script>
<style scoped>
.fenxiangLi >img{
  cursor: pointer;
}

.loading {
  text-align: center;
}
.el-button {
  border: none;
}
.details {
  width: 100%;
  position: relative;
}
.comment-msg {
  position: absolute;
  top: 66px;
  left: 80px;
  font-size: 14px;
  color: #9b9b9b;
}
.comment-msg > ul > li {
  height: 30px;
  width: 134px;
  padding: 10px 0 10px 0;
}
.comment-msg > ul > li:nth-child(2) {
  border-bottom: 1px solid #dcdcdc;
}
.comment-msg > ul > li > img {
  margin-right: 10px;
  vertical-align: middle;
}
.news-details {
  width: 858px;
  margin: auto;
}
.title {
  font-size: 26px;
  color: #333333;
  padding: 20px 0 20px 0;
}
.message {
  padding-bottom: 20px;
  font-size: 14px;
}
.message > span:first-child {
  color: #333333;
  margin-right: 20px;
}
.message > span:last-child {
  color: #9b9b9b;
}
.detials-img {
  width: 655px;
  height: 337px;
  margin: auto;
}
.details-image {
  width: 100%;
  height: 100%;
}
.content {
  padding: 10px 0 30px 0;
}
.content > p {
  font-size: 16px;
  color: #333333;
}
.publish-comment {
  border-top: 1px solid #dcdcdc;
  padding: 20px 0 20px 0;
}
.publish-comment::after {
  content: "";
  display: block;
  clear: both;
}
.publish-comment > h2,
.new-comment > h2 {
  font-size: 16px;
  color: #6f6f6f;
  font-weight: 0;
  font-family: MicrosoftYaHei;
}
.new-comment > h2 {
  margin: 0;
}
.new-comment > h2 {
  border-bottom: 1px solid #dcdcdc;
  padding-bottom: 20px;
}
.comment-texerea {
  width: 100%;
  border: 1px solid #979797;
  border-radius: 4px;
  resize: none;
  font-size: 16px;
  padding: 10px 20px;
  box-sizing: border-box;
}
.commentTocomment {
  width: 85%;
  background: #f3f3f3;
  padding: 20px;
  box-sizing: border-box;
}
.body {
  padding: 30px 10px 30px 10px;
  border-bottom: 1px solid #dcdcdc;
  overflow: auto;
}
::-webkit-input-placeholder {
  color: #9b9b9b;
  font-size: 16px;
  font-family: MicrosoftYaHei;
}
::-moz-placeholder {
  color: #9b9b9b;
  font-size: 16px;
  font-family: MicrosoftYaHei;
}
:-ms-input-placeholder {
  color: #9b9b9b;
  font-size: 16px;
  font-family: MicrosoftYaHei;
}
.fenxiangLi {
  position: relative;
}
.fenxiang {
  position: absolute;
  top: 12px;
  right: -25px;
  border: 1px solid #ddd;
}
</style>
