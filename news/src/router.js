import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // 用户
    {

      path: '/regist',
      name: 'regist',
      component: function () {
        return import('./views/regist.vue');
      }
    },
    {
      path: '/login',
      name: 'login',
      component: function () {
        return import('./views/login.vue');
      }
    },
    {
      path: '/findpassword',
      name: 'findpassword',
      component: function () {
        return import('./views/findpsw.vue');
      }
    },
   
    // 新闻
    {
      path: "/",
      name:'new',
      component: function () {
        return import("./views/new.vue");
      },
      
    },
    // 详情
    {
      path: "/details/:id",
      name:'details',
      component: function () {
        return import("./views/details.vue");
      },
      
    },
    // 个人
    {
      path: '/message',
      beforeEnter: function (to, from, next) {
        if (!localStorage.token) {
          next("/user/login");
        } else {
          next();
        }
      },
      component: function () {
        return import('./views/message.vue');
      },
      children: [
        {
          path: '/',
          name: 'mycomment',
          component: function () {
            return import('./components/message/my-comment.vue');
          }
        },
        {
          path: 'mymessage',
          name: 'mymessage',
          component: function () {
            return import('./components/message/my-message.vue');
          }
        }
      ]
    },
    {
      path: '/accountmessage',
      name: 'accountmessage',
      beforeEnter: function (to, from, next) {
        if (!localStorage.token) {
          next("/user/login");
        } else {
          next();
        }
      },
      component: function () {
        return import('./views/accountmessage.vue');
      },
    },
    {
      path: '/accountupdate',
      name:'accountupdate',
      component:function(){
        return import ('./views/accountupdate.vue');
      }
    },
    {
      path: "/404",
      name: "404",
      component: function () {
        return import("./views/404.vue");
      }
    }
  ]
})
