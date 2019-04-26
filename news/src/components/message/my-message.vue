<template>
  <div class="mycomment"> 
    <div class="biaojiyidu" v-show="this.$route.path.indexOf('/mymessage')!=-1">
        <span @click="biaojiAll">

        <img src="@/assets/icon_sign.png"  >
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
          <p class="comment-content" :style="{color:!message.isRead?'#333':'#6f6f6f'}">{{message.content}}</p>
        </div>
        <p class="commentform" title="查看文章" @click="goDetails(message.isRead,message.commentId,message.articleId._id)">{{message.articleId.title}}</p>
      </div>
      
  </div>
  <div class="loading" v-if="isloading && messages.length!=0">
            <el-button :loading="true" style="width:100%;border:none;background: transparent;">加载中</el-button>
      </div>
  </div>
</template>
<script>
import { messageList,messageCheck } from "../../api/account.js";
import { tokenMethod } from "../../api/token.js";
export default {
  data() {
    return {
      page: 1,
      page2:2,
      limit: 10,
      messages: [],
      none:"",
      count:0,
      isloading:true
    };
  },
  methods: {
    getMyMessageList({token, page, limit}) {
      let self = this;
      messageList({token, page, limit})
        .then(res => {
          if (res.data.code === "success") {
            self.messages = self.messages.concat(res.data.data.commnets);
             if ( self.messages.length === 0) {
              self.none = "您还没有消息";
            } else {
              self.messages.sort(function(a,b) {
                if (a.isRead==b.isRead) return 0;
                if (a.isRead<b.isRead) return -1;
                if (a.isRead>b.isRead) return 1;
              })
            }
            self.page +=1;
            self.count = res.data.data.counts;
          } else {
             tokenMethod({code:res.data.code,message:res.data.message,self});
          }
        })
        .catch(err => {});
    },
    // 全部标记
    biaojiAll(){
      let self = this;
      messageCheck({commnetId:null,token:self.$store.state.user.token}).then(res=> {
        if (res.data.code === "success") {
          self.$message({
            type:'success',
            message:'消息已读'
          });
          for (let index in self.messages) {
            let s = self.messages[index];
            s.isRead = true;
            self.$set(self.messages,index,s);
          }
        } else {
             tokenMethod({code:res.data.code,message:res.data.message,self});
        }
      }).catch(err => {
        // 错误处理
      });
    },
    goDetails(isRead,commentId,id) {
      let self = this;
      if (!isRead) {
 messageCheck({commentId,token:self.$store.state.user.token}).then(res => {
         if (res.data.code === "success") {
           self.$message({
             code:'success',
             message:'消息已读'
           });
       self.$router.push({name:'details',params:{id}});

         } else {
             tokenMethod({code:res.data.code,message:res.data.message,self});
         }
       }).catch(err => {
         // 错误处理
       });
      } else {
       self.$router.push({name:'details',params:{id}});

      }
      
    }
  },
  filters: {
    getTime(value) {
      let create_time = new Date(value);
      let now = new Date();
      let cha = now.getTime - create_time;

      function isless10(value) {
        if (value >= 10) {
          return value;
        } else {
          return "0" + value;
        }
      }
      let year = create_time.getFullYear();
      let month = create_time.getMonth() + 1;
      let day = create_time.getDate();
      let hour = create_time.getHours();
      let minute = create_time.getMinutes();
      return (
        year +
        "-" +
        isless10(month) +
        "-" +
        isless10(day) +
        " " +
        isless10(hour) +
        ":" +
        isless10(minute)
      );
    }
  },
  created() {
    this.getMyMessageList({token:this.$store.state.user.token, page:this.page, limit:this.limit});
    document.documentElement.scrollTop = 0;
  },
  mounted(){
      let self = this;

  window.onscroll = function(){
    // 导航
    
      if (document.documentElement.scrollTop - 145> 0){
       document.querySelector(".nav1").style.top = (document.documentElement.scrollTop - 145) + 'px';
      } else {
       document.querySelector(".nav1").style.top = 0;
      }
      
      let loading = document.querySelector(".loading");
      if (!loading) return;
      console.log(self.page2,self.page,loading.getBoundingClientRect().top + loading.offsetHeight < document.documentElement.clientHeight);
      if (loading.getBoundingClientRect().top + loading.offsetHeight < document.documentElement.clientHeight) {
        if (self.messages.length < self.count) {
          if (self.page === self.page2){
            self.page2 += 1;

            setTimeout(function(){

              self.getMyMessageList({token:self.$store.state.user.token, page:self.page, limit:self.limit});
            },1000);
            
          }
        }else {
          self.isloading = false;
        }
      }
  }
   
  }

};
</script>
<style scoped>
.none{
  text-align: center;
  font-size: 30px;
}
.mycomment{
  min-height: 480px;
  position: relative;
}
.comment-item {
  border-bottom: 1px solid #dcdcdc;
  position: relative;
  margin-bottom: 20px;
}

.comment-item-left{
  width:30px;
  height: 100%;
  display: inline-block;
  vertical-align: middle;
  position: absolute;
  top: -8px;
}
.comment-item-left::after{
  content: "";
  width: 0;
  height: 100%;
  display: inline-block;
  vertical-align: middle;
}
.comment-item-right{
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
.yidu{
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background:#FF8000;
  vertical-align: middle;
}
.biaojiyidu{
  width: 100%;
  margin:auto;
  overflow: auto;
  margin-bottom :10px;
  position: absolute;
  top: -50px;
}
.biaojiyidu > span{
  cursor: pointer;
  float: right;
}
</style>
