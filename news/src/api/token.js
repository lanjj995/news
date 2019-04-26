function tokenMethod({code,message,self}){
  console.log("111111");
    if (code === "account_token_invalid") {
      self.$confirm(message, '提示', {
        confirmButtonText: '去登陆',
        cancelButtonText: '返回',
        type: 'warning'
      }).then(() => {
        self.$router.push({name:'login'});
      
      }).catch(() => {
        self.$router.go(-1);

      });
      self.$store.commit('setUser','');
      self.$store.commit('setToken','');
      self.$store.commit('setAvatar','');
      
    } else {
      self.$message.error(message);
    }
}

export{
    tokenMethod
}