import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import elementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';

// Vue.config.productionTip = false
Vue.use(elementUI);

router.beforeEach(function(to,from,next) {
  if (to.path.indexOf('/') === -1){
    window.onscroll = function(){}
  } 
  next();
});

router.afterEach(function(to,from,next){
  window.scrollTo(0, 0);
document.documentElement.scrollTop = document.body.scrollTop = 0;
});

new Vue({
  router,
  store,

  render: function (h) { return h(App) },
  created(){
    let self = this;
    self.$store.commit('initUser');
    self.$store.commit('initAvatar');
    self.$store.commit('initToken');

  }
}).$mount('#app')
