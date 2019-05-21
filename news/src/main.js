import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {Message,MessageBox,Button} from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
import VueLazyLoad from "vue-lazyload";

// Vue.config.productionTip = false
Vue.component('el-button',Button);

Vue.prototype.$message = Message;
Vue.prototype.$alert = MessageBox.alert;

Vue.use(VueLazyLoad,{
  preLoad:1.3,
  loading:'http://localhost:8080/loading.gif',
  error:'http://localhost:8080/error.png',
  attempt:1
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
