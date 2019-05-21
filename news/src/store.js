import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    avatar:"",
    token:"",
    isActive:"yaowen",
    isMessageActive:'mycomment',
    baseImgUrl:'https://dev.apis.ittim.ltd/nWGq7NqEf/static/'
  },
  mutations: {
    initUser(state){
      state.user = JSON.parse(localStorage.getItem('user'));
    },
    initAvatar(state) {
      state.avatar = localStorage.getItem('avatar');
    },
    initToken(state) {
      state.token = localStorage.getItem('token');
    },
    setUser(state,user){
      localStorage.setItem('user',JSON.stringify(user));
      state.user = user;
    },
    setAvatar(state,avatar){
      state.avatar = avatar;
      localStorage.avatar = avatar;
    },
    setToken(state,token) {
      localStorage.setItem('token',token);
      state.token = token;
    },
    setActive(state,active) {
      state.isActive = active;
    },
    setMessageActive(state,name){
      state.isMessageActive = name;
    }
  },
  actions: {

  }
})
