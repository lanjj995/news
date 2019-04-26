<template>
  <div class="main">
    <headerCom style="background:#0074ff;color:#fff;" :color="'#ffffff'"></headerCom>
    <div class="content">
      <div class="news">
           
        <div class="input-search"   >
          <input
            type="text"
            placeholder="大家都在搜索：张继科"
            @focus="datalist = true"
            v-model="search"
            @blur="setSeacher1"
          >
          <div id="searchs" v-show="datalist" @mouseover="onSearch = true" @mouseout="onSearch = false"> 
            <div v-for="(hotnew,index) in hotkeys" :key="index" @click="setSeacher(hotnew)" >
              <span @click="setSeacher" :style="{color:colorArr[index]}">{{index+1}}.</span>
              {{hotnew.title}}
            </div>
          </div>
          <div @click="getSearchList">
            <canvas id="myCanvas" width="100" height="48"></canvas>
          </div>
        </div>
        <div class="nav" :style="{top:top+'px'}">
          <ul>
            <li
              @click="getnewlist('yaowen',page,limit)"
              :class="{active:isActive=='yaowen'?true:false}"
            >要闻</li>
            <li
              @click="getnewlist('shehui',page,limit)"
              :class="{active:isActive=='shehui'?true:false}"
            >社会</li>
            <li
              @click="getnewlist('ent',page,limit)"
              :class="{active:isActive=='ent'?true:false}"
            >军事</li>
            <li
              @click="getnewlist('tech',page,limit)"
              :class="{active:isActive=='tech'?true:false}"
            >科技</li>
            <li
              @click="getnewlist('war',page,limit)"
              :class="{active:isActive=='war'?true:false}"
            >娱乐</li>
          </ul>
        </div>

        <div class="new_articles">
          <div class="none">{{none}}</div>
          <div v-for="(item,index) in news" :key="index">
            <newComponent :item="item"></newComponent>
          </div>
          <div class="loading" v-if="isloading && news.length!=0">
            <el-button :loading="true" style="width:100%;border:none;background: transparent;">加载中</el-button>
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
import newComponent from "../components/new/article";
import { new_getnewList, hotNews_list, searchList } from "@/api/new.js";
import { setTimeout } from 'timers';
import { win32 } from 'path';
export default {
  data() {
    return {
      keyList: ["yaowen", "shehui", "ent", "tech", "war"],
      isActive: "yaowen",
      count: 0,
      news: [],
      hotnews: [],
      hotkeys: [],
      page: 1,
      page2: 1,
      limit: 10,
      top: 186,
      search: "",
      isloading: true,
      none: "",
      datalist: false,
      onSearch:false,
      colorArr: ["#f00", "#f60", "#f80", "#9B9B9B", "#9B9B9B"],
    };
  },
  methods: {
    setSeacher(new1) {
      let self = this;

      self.search = new1.title;
      self.datalist = false;
    },
    setSeacher1(){
      let self = this;
      if (!self.onSearch) {
      self.datalist = false;
      }
    },
    getSearchList() {
      // 搜索热词
      let self = this;
      if (!self.search) {
        self.$message.error("请输入您想要搜索的关键词");
        return;
      } else {
        self.isActive = self.search;
        self.search = "";
        self.page = 1;
        self.page2 = 1;
        self.news = [];
        self.getnewlist(self.isActive, self.page, self.limit);
      }
    },
    getnewlist(channelname) {
      let self = this;
      if (self.isActive != channelname) {
        self.isActive = channelname;
        self.page = 1;
        self.page2 = 1;
        self.news = [];
      }
      if (self.page === self.page2) {
        self.page2 += 1;
        if (self.keyList.indexOf(channelname) === -1) {
          searchList({ channelname, page: self.page, limit: self.limit })
            .then(res => {
              if (res.data.code === "success") {
                self.news = self.news.concat(res.data.data.news);
                if (self.news.length === 0) self.none = "没有相关文章";
                self.count = res.data.data.counts;
                self.page += 1;
              } else {
                self.$message.error(res.data.message);
                self.none = "没有相关文章";
              }
            })
            .catch(err => {
              // 错误处理

              console.log(err);
            });
        } else {
          new_getnewList({ channelname, page: self.page, limit: self.limit })
            .then(res => {
              if (res.data.code === "success") {
                self.news = self.news.concat(res.data.data.news);
                self.count = res.data.data.counts;
                self.page += 1;
                if (self.news.length === 0) self.none = "没有相关文章";
              } else {
                self.$message.error(res.data.message);
              }
            })
            .catch(err => {
              // 错误处理
              console.log(err);
            });
        }
      }
    },
    gethotNews_list() {
      let self = this;
      hotNews_list()
        .then(res => {
          if (res.data.code === "success") {
            self.hotnews  = res.data.data.news;
            self.hotkeys  = [...self.hotnews];
          } else {
            self.$message.error(res.data.message);
          }
          
        })
        .catch(err => {
          // 错误处理
        });
    },
    newScroll(){
      // 导航
      let self = this;
      if (document.documentElement.scrollTop > 187) {
        self.top = document.documentElement.scrollTop + 100 ;
      } else {
        self.top = 187;
      }
      
      let loading = document.querySelector('.loading');
      if (!loading) return;

      if (loading.getBoundingClientRect().top + loading.offsetHeight < document.documentElement.clientHeight) {
        if (self.news.length < self.count) {

            self.getnewlist(self.isActive, self.page, self.limit);
        } else {
          self.isloading = false;
        }
      }
    }
  },
  components: {
    headerCom,
    footerCom,
    newComponent
  },
  watch: {
    isActive(val) {
      let self =this;
      document.documentElement.scrollTop = 0;
      self.$store.commit("setActive", val);
      self.none  = "";
    },
    search(val) {
      console.log("sssss");
      let self = this;
      if (val) {
        for (let index in self.hotkeys) {
          if (self.hotkeys[index].title.indexOf(val) === -1) {
            self.hotkeys.splice(index, 1);
          }
        }
      } else {
        self.hotkeys = [...self.hotnews];
      }
    }
  },
  created() {
  
    let self = this;
    self.isActive = self.$store.state.isActive;
    self.getnewlist(self.isActive, self.page, self.limit);
    self.gethotNews_list();
    window.removeEventListener('scroll',self.newScroll);
    setTimeout(function(){
      window.scrollTo(0,0);
    },0);
  },

  mounted() {
   
    let self = this;
    let myCanvas = document.getElementById("myCanvas");
    let context = myCanvas.getContext("2d");
    context.arc(65, 0, 60, 0, Math.PI * 2, true);
    context.fillStyle = "#FF8000";
    context.fill();
    let img = new Image();
    img.onload = function() {
      context.drawImage(img, 45, 10, 28, 28);
    };
    img.src = require("@/assets/icon_ search.png");


    window.addEventListener('scroll',self.newScroll);
    

  }
};
</script>

<style scoped>
 .loading{
   margin-top: 20px;
 }
.content {
  position: relative;
}
.none {
  text-align: center;
  font-size: 30px;
}
.news {
  background: #f9f9f9;
  padding: 50px 0 30px 0;
}

.active {
  border-left: 4px solid #ff8000;
  color: #ff8000;
}
.new_articles {
  width: 726px;
  margin: 70px auto 20px;
  min-height: 600px;
}
.nav {
  background: #ffffff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.12);
  display: inline-block;
  position: absolute;
  left: 130px;
  top: 186px;
}

.nav ul li {
  width: 134px;
  height: 30px;
  font-size: 16px;
  line-height: 30px;
  text-align: center;
  margin: 20px 0 20px 0;
  cursor: pointer;
  box-sizing: border-box;
}

.input-search {
  width: 520px;
  height: 48px;
  position: relative;
  margin: auto;
}
input[type="text"] {
  position: absolute;
  width: 520px;
  height: 48px;
  padding-left: 20px;
  box-sizing: border-box;
  border: 1px solid #ff8000;
  font-size: 14px;
  color: #333;
}
#searchs {
  width: 520px;
  font-size: 14px;
  background: #ffffff;
  position: absolute;
  top: 58px;
  box-shadow: -2px 0 3px 1px rgba(39, 52, 101, 0.08),
    2px 2px 3px 1px rgba(39, 52, 101, 0.08);
  z-index: 9999;
}
#searchs > div {
  height: 40px;
  padding-left: 20px;
  line-height: 40px;
}
#searchs > div:hover {
  background: #eeeeee;
  cursor: pointer;
}
#searchs > div > span {
  display: inline-block;
  margin-right: 5px;
}
.input::-webkit-input-placeholder {
  color: #9b9b9b;
}
.input::-moz-placeholder {
  color: #9b9b9b;
}
.input:-ms-input-placeholder {
  color: #9b9b9b;
}
#myCanvas {
  position: absolute;
  right: 0;
}
.hotnews0 {
  color: #ff0000;
  margin-right: 5px;
}
.hotnews1 {
  color: #ff6300;
  margin-right: 5px;
}
.hotnews2 {
  color: #ff8200;
  margin-right: 5px;
}
.hotnews3 {
  margin-right: 5px;
  color: #9b9b9b;
}
.hotnews4 {
  margin-right: 5px;
  color: #9b9b9b;
}
</style>