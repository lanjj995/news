<template>
  <div class="main">
    <headerCom class="header" :color="'#fff'"></headerCom>
    <div class="content" @click="!$event.target.dataset.datalist?datalist=false:0">
      <div class="news">
        <div class="input-search">
          <input
            type="text"
            placeholder="大家都在搜索：张继科"
            @focus="datalist = true"
            data-datalist="true"
            v-model="search"
            class="txtsearch"
          >
          <div class="searchs" v-show="datalist" data-datalist="true">
            <div
              data-datalist="true"
              v-for="(hotnew,index) in hotNewsByFilter"
              :key="index"
              @click="search = hotnew.title"
            >
              <span :style="{color:colorArr[index]}">{{index+1}}.</span>
              {{hotnew.title}}
            </div>
          </div>
          <div @click="getNewListByHotKeysHandler">
            <canvas id="myCanvas" width="100" height="48"></canvas>
          </div>
        </div>
        <div class="nav" :style="{top:top+'px'}">
          <ul>
            <li @click="setActive('yaowen')" :class="{active:active=='yaowen'?true:false}">要闻</li>
            <li @click="setActive('shehui')" :class="{active:active=='shehui'?true:false}">社会</li>
            <li @click="setActive('ent')" :class="{active:active=='ent'?true:false}">军事</li>
            <li @click="setActive('tech')" :class="{active:active=='tech'?true:false}">科技</li>
            <li @click="setActive('war')" :class="{active:active=='war'?true:false}">娱乐</li>
          </ul>
        </div>

        <div class="new_articles">
          <div class="none">{{none}}</div>
          <div v-for="(item,index) in news" :key="index">
            <newComponent :item="item"></newComponent>
          </div>
          <div class="loading">
            <el-button :loading="isloading" style="width:100%;border:none;background: transparent;">{{loadfont}}</el-button>
          </div>
        </div>
      </div>
    </div>
    <footerCom></footerCom>
  </div>
</template>

<script>
import headerCom from "../../components/common/header";
import footerCom from "../../components/common/footer";
import newComponent from "../../components/new/article";
import {
  getNewListByChannelname,
  getHotKeys,
  getNewListByHotKey
} from "../../api/new.js";
export default {
  components: {
    headerCom,
    footerCom,
    newComponent
  },
  data() {
    return {
      search: "",
      news: [],
      hotnews: [],
      count: 0,
      top:187,
      page: 1,
      limit: 10,

      none: "",
      isloading: true,
      loadfont:'加载中',
      datalist: false,
      datalist1: false,
      onSearch: false,

      keyList: ["yaowen", "shehui", "ent", "tech", "war"],
      colorArr: ["#f00", "#f60", "#f80", "#9B9B9B", "#9B9B9B"]
    };
  },
  methods: {
    // 文章列表（channelname）
    getNewListByChanneHandler() {
      let self = this;
      getNewListByChannelname({
        channelname:self.$store.state.isActive,
        page: self.page,
        limit: self.limit
      })
        .then(res => {
          if (res.data.code === "success") {
            self.news = self.news.concat(res.data.data.news);
            self.count = res.data.data.counts;
            if (self.news.length === 0) self.none = "没有相关文章";
          } else {
            self.$message.error(res.data.message);
            self.none = "没有相关文章";
          }
        })
        .catch(err => {
          // 错误处理
          console.log(err);
        });
    },
    // 新闻列表（hotkey）
    getNewListByHotKeysHandler() {
      let self = this;
      self.loadfont = "加载中";
      self.isloading = true;
      if (!self.search) return self.$message.error("请输入您想要搜索的关键词");
      getNewListByHotKey({
        channelname: self.search,
        page: self.page,
        limit: self.limit
      })
        .then(res => {
          if (res.data.code === "success") {
            self.news = self.news.concat(res.data.data.news);
            self.count = res.data.data.counts;
            if (self.news.length === 0) self.none = "没有相关文章";
          } else {
            self.$message.error(res.data.message);
          }
        })
        .catch(err => {
          // 错误处理
          console.log(err);
        });
    },
    // 获取热词
    getHotKeysHandler() {
      let self = this;
      getHotKeys()
        .then(res => {
          if (res.data.code === "success") {
            self.hotnews = res.data.data.news;
          } else {
            self.$message.error(res.data.message);
          }
        })
        .catch(err => {
          // 错误处理
        });
    },
    newScroll() {
      let self = this;
      let loading = document.querySelector(".loading");
      if (!loading) return;
      if (
        loading.getBoundingClientRect().top + loading.offsetHeight <
        document.documentElement.clientHeight
      ) {
        if (self.news.length < self.count) {
          self.search
            ? self.getNewListByHotKeysHandler()
            : self.getNewListByChanneHandler();
        } else {
          self.loadfont = "没有更多的新闻了";
          self.isloading = false;
        }
      }
    },
    setActive(channelname) {
      let self = this;
      self.$store.commit("setActive", channelname);
      self.page = 1;
      self.search = "";
      self.news = [];
      self.loadfont = "加载中";
      self.isloading = true;
      self.getNewListByChanneHandler();
      window.scrollTo(0,0);
    },
    getCanvas() {
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
    },
    getTop(){
      let self = this;
      // 导航
      if (document.documentElement.scrollTop > 187) {
        self.top = document.documentElement.scrollTop + 100;
      } else {
        self.top = 187;
      }
    }
  },
  computed: {
    hotNewsByFilter() {
      let self = this;
      if (!self.search) return self.hotnews;
      return self.hotnews.filter(function(item) {
        return item.title.indexOf(self.search) != -1;
      });
    },
    active() {
      return this.$store.state.isActive;
    },
  },
  created() {
    let self = this;
    let channelname = self.$store.state.isActive;
    self.getNewListByChanneHandler(channelname);
    self.getHotKeysHandler();
    document.documentElement.scrollTop = 0;
  },
  mounted() {
    let self = this;
    self.getCanvas();
    window.addEventListener("scroll", _.throttle(self.newScroll, 2000));
    window.addEventListener("scroll", self.getTop);
  },
  beforeDestroy() {
    let self = this;
    window.removeEventListener("scroll", _.throttle(self.newScroll, 21000));
    window.removeEventListener("scroll", self.getTop);
  }
};
</script>

<style scoped>
.main .content {
 position: relative;
}
.main .content .news {
  background: #f9f9f9;
  padding: 50px 0 30px 0;
}
.main .content .news .input-search {
  width: 520px;
  height: 48px;
  position: relative;
  margin: auto;
}
.main .content .news .input-search .txtsearch {
  position: absolute;
  width: 520px;
  height: 48px;
  padding-left: 20px;
  box-sizing: border-box;
  border: 1px solid #ff8000;
  font-size: 14px;
  color: #333;
}
.main .content .news .input-search .searchs {
  width: 520px;
  font-size: 14px;
  background: #ffffff;
  position: absolute;
  top: 58px;
  box-shadow: -2px 0 3px 1px rgba(39, 52, 101, 0.08),
    2px 2px 3px 1px rgba(39, 52, 101, 0.08);
  z-index: 999;
}
.main .content .news .input-search .searchs > div {
  height: 40px;
  padding-left: 20px;
  line-height: 40px;
  cursor: pointer;
}
.main .content .news .input-search .searchs > div:hover {
  background: #eeeeee;
}
.main .content .news .input-search .searchs > div > span {
  display: inline-block;
  margin-right: 5px;
}
.main .content .news .nav {
  background: #ffffff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.12);
  display: inline-block;
  position: absolute;
  left: 130px;
  top: 186px;
}
.main .content .news .nav ul li {
  width: 134px;
  height: 30px;
  font-size: 16px;
  line-height: 30px;
  text-align: center;
  margin: 20px 0 20px 0;
  cursor: pointer;
  box-sizing: border-box;
}
.main .content .news .new_articles {
  width: 726px;
  margin: 70px auto 20px;
  min-height: 600px;
}
.active {
  border-left: 4px solid #ff8000;
  color: #ff8000;
}
.loading {
  margin-top: 20px;
}
.none {
  text-align: center;
  font-size: 30px;
}
#myCanvas {
  position: absolute;
  right: 0;
}
header{
  background: #0074ff;
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
</style>