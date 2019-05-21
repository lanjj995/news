<template>
  <div class="mycomment">
    <div class="biaojiyidu">
      <span @click="biaojiAll">
        <img src="../../assets/icon_sign.png">
        全部标记为已读
      </span>
    </div>
    <div class="none">{{none}}</div>
    <div class="comment-item" v-for="(message,index) in messages" :key="index">
      <div class="comment-item-left">
        <div class="yidu" v-show="!message.isRead"></div>
      </div>
      <div class="comment-item-right">
        <div class="comment-item-head">
          <span>{{message.user.nickname}}回复你</span>
          <span>{{message.create_time | getTime}}</span>
        </div>
        <div class="content">
          <p
            class="comment-content"
            :style="{color:!message.isRead?'#333':'#6f6f6f'}"
          >{{message.content}}</p>
        </div>
        <p
          class="commentform"
          title="查看文章"
          @click="goDetails(message.isRead,message.commentId,message.articleId._id)"
        >{{message.articleId.title}}</p>
      </div>
    </div>
    <div class="loading" v-if="isloading && messages.length!=0">
      <el-button :loading="true" class="loading_btn">加载中</el-button>
    </div>
  </div>
</template>
<script>
import { messageList, messageCheck } from "../../api/account.js";
import { tokenMethod } from "../../utils/utils";
export default {
  data() {
    return {
      page: 1,
      limit: 10,
      messages: [],
      none: "",
      count: 0,
      isloading: true
    };
  },
  methods: {
    getMyMessageList() {
      let self = this;
      messageList({
        token: self.$store.state.token,
        page: self.page,
        limit: self.limit
      })
        .then(res => {
          if (res.data.code === "success") {
            self.messages = self.messages.concat(res.data.data.comments);
            if (self.messages.length === 0) {
              self.none = "您还没有消息";
            } else {
              self.messages.sort(function(a, b) {
                if (a.isRead == b.isRead) return 0;
                if (a.isRead < b.isRead) return -1;
                if (a.isRead > b.isRead) return 1;
              });
            }
            self.page += 1;
            self.count = res.data.data.counts;
          } else {
            tokenMethod({
              code: res.data.code,
              message: res.data.message,
              self
            });
          }
        })
        .catch(err => {});
    },
    // 全部标记
    biaojiAll() {
      let self = this;
      messageCheck({ commnetId: null, token: self.$store.state.user.token })
        .then(res => {
          if (res.data.code === "success") {
            self.$message({
              type: "success",
              message: "消息已读"
            });
            for (let index in self.messages) {
              let s = self.messages[index];
              s.isRead = true;
              self.$set(self.messages, index, s);
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
          // 错误处理
        });
    },
    goDetails(isRead, commentId, id) {
      let self = this;
      if (!isRead) {
        messageCheck({ commentId, token: self.$store.state.user.token })
          .then(res => {
            if (res.data.code === "success") {
              self.$message({
                code: "success",
                message: "消息已读"
              });
              self.$router.push({ name: "details", params: { id } });
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
          });
      } else {
        self.$router.push({ name: "details", params: { id } });
      }
    },
    scrollMessage() {
      let self = this;
      let loading = document.querySelector(".loading");
      if (!loading) return;
      if (
        loading.getBoundingClientRect().top + loading.offsetHeight <
        document.documentElement.clientHeight
      ) {
        if (self.messages.length < self.count) {
          self.getMyMessageList();
        } else {
          self.isloading = false;
        }
      }
    }
  },
  filters: {
    getTime(value) {
      return moment(new Date(value)).format("YYYY-MM-DD HH:MM");
    }
  },
  created() {
    let self = this;
    self.getMyMessageList();
  },
  mounted() {
    window.addEventListener("scroll", _.throttle(this.scrollMessage, 2000));
  },
  beforeDestroy() {
    window.removeEventListener("scroll", _.throttle(this.scrollMessage, 2000));
  }
};
</script>
<style scoped>
.none {
  text-align: center;
  font-size: 30px;
}
.mycomment {
  min-height: 480px;
  position: relative;
}
.comment-item {
  border-bottom: 1px solid #dcdcdc;
  position: relative;
  margin-bottom: 20px;
}

.comment-item-left {
  width: 30px;
  height: 100%;
  display: inline-block;
  vertical-align: middle;
  position: absolute;
  top: -8px;
}
.comment-item-left::after {
  content: "";
  width: 0;
  height: 100%;
  display: inline-block;
  vertical-align: middle;
}
.comment-item-right {
  margin-left: 30px;
}
.comment-item-head > span:last-child {
  float: right;
  margin-left: 20px;
}
.comment-item > div,
.commentform {
  font-size: 14px;
  color: #6f6f6f;
}

.commentform {
  cursor: pointer;
}
.comment-content {
  color: #333;
}
.yidu {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff8000;
  vertical-align: middle;
}
.biaojiyidu {
  width: 100%;
  margin: auto;
  overflow: auto;
  margin-bottom: 10px;
  position: absolute;
  top: -50px;
}
.biaojiyidu > span {
  cursor: pointer;
  float: right;
}
.biaojiyidu > span > img {
  vertical-align: middle;
}
.loading_btn {
  width: 100%;
  border: none;
  background: transparent;
}
</style>
