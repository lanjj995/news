import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

Router.beforeEnter

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  // 滚动最顶端
  scrollBehavior (to,form,savedPosition) {
    // savedPosition （前进、后退是原来的位置）
    if (savedPosition) {
      return savedPosition;
    } else {
      return {x:0,y:0};
    }
  },
  routes: [
    // 用户
    {

      path: '/regist',
      name: 'regist',
      component: function () {
        return import('./views/user/regist.vue');
      }
    },
    {
      path: '/login',
      name: 'login',
      component: function () {
        return import('./views/user/login.vue');
      }
    },
    {
      path: '/findpassword',
      name: 'findpassword',
      component: function () {
        return import('./views/user/findpsw.vue');
      }
    },
   
    // 新闻
    {
      path: "/",
      name:'new',
      component: function () {
        return import("./views/new/new.vue");
      },
      
    },
    // 详情
    {
      path: "/details/:id",
      name:'details',
      component: function () {
        return import("./views/new/details.vue");
      },
      
    },
    // 个人
    {
      path: '/message',
      beforeEnter: function (to, from, next) {
        if (!localStorage.token) {
          next("/login");
        } else {
          next();
        }
      },
      component: function () {
        return import('./views/message/message.vue');
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
          next("/login");
        } else {
          next();
        }
      },
      component: function () {
        return import('./views/account/accountmessage.vue');
      },
    },
    {
      path: '/accountupdate',
      name:'accountupdate',
      component:function(){
        return import ('./views/account/accountupdate.vue');
      }
    },
    {
      path: "/404",
      name: "404",
      component: function () {
        return import("./views/commons/404.vue");
      }
    }
  ]
});

router.beforeEach((to,form,next) => {
  if (to.matched.length === 0) {
    console.log(1111);
    next('/404');
  } else {
    next();
  }
});

export default router;