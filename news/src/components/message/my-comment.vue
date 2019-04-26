<template>
  <div class="mycomment">
    <div class="none">
      {{none}}
    </div>
    <div v-if="comments.length!=0">
      <commentItem :comments="comments"></commentItem>
    </div>
  </div>
</template>
<script>
import commentItem from "./comment-item.vue";
import { userComments, userCommentslevel } from "../../api/account.js";
import { tokenMethod } from "../../api/token.js";
export default {
  components: {
    commentItem
  },
  data() {
    return {
      comments: [],
      page: 1,
      page2:2,
      limit: 10,
      none:""
    };
  },
  methods: {
    // 获取我的评论列表
    getMyCommentList() {
      let self = this;
      userComments({token:self.$store.state.token,page: self.page,limit: self.limit})
        .then(res => {
          if (res.data.code === "success") {
            let comments = res.data.data.comments;
            if (comments.length === 0) {
              self.none = "您还没有评论";
            }
            let arr = [];
            for (let index in comments) {
              let p1 = new Promise(function(resolve, reject) {
                userCommentslevel({commentId:comments[index].commentId})
                  .then(res => {
                    resolve(res.data.data);
                  })
                  .catch(err => {
                    // 错误处理
                    reject(err);

                    console.log(err);
                  });

              });
              arr.push(p1);
            }
            
            Promise.all(arr).then(res => {
              for (let index in res) {
                res[index].commentIds.split(",").length === 1 ? comments[index]['data'] = '' : comments[index]['data'] = res[index];
              }
              self.comments = comments;
            }).catch(err => {
              console.log(err);
            })
            self.page += 1;
          } else {
             tokenMethod({code:res.data.code,message:res.data.message,self});
          }
        })
        .catch(err => {
          // 错误处理
          console.log(err);
        });
    }
  },
  created() {
    // 获取评论列表
    this.getMyCommentList();
    document.documentElement.scrollTop = 0;
  },
  mouted(){
     document.querySelector(".nav1").style.top = 0;
    let self = this;
    window.onscroll = function() {
      // 导航
      if (document.documentElement.scrollTop - 145> 0){
        document.querySelector(".nav1").style.top = (document.documentElement.scrollTop - 145) + 'px';
      }else {
        document.querySelector(".nav1").style.top = 0;
      }
     let arr = document.querySelectorAll(".comment-item");
      let last = arr[arr.length - 1];
      if (!last) return;
      if (
        last.offsetTop -
          document.documentElement.scrollTop +
          last.clientHeight <
        document.documentElement.clientHeight
      ) {
        if (arr.length < self.count) {
          if (self.page === self.page2){
            self.page2 += 1;
           self.getMyCommentList();
          }
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
.mycomment {
  min-height: 480px;
}
</style>
