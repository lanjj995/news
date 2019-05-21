

// 时间过滤
function filterTime(value){
    let create_time = new Date(value);
    let now = new Date();
    let cha = now.getTime() - create_time;

    return cha < 24 * 60 * 60 * 1000
      ? cha < 60 * 60 * 1000
        ? Math.floor(cha / (60 * 1000)) + "分钟前"
        : Math.floor(cha / (60 * 60 * 1000)) + "小时前"
      : isless10(create_time.getMonth() + 1) +
          "月" +
          isless10(create_time.getDate()) +
          "日";
}

function isless10(value) {
  return value > 10 ? value : "0" + value;
}

// 验证token
function tokenMethod({code,message,self}){
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
// 验证
function check(key,requireMsg,reg,regMsg){
    if (reg)
        return key ? reg.test(key) ? '' : regMsg : requireMsg;  
    else
        return key ? '' : requireMsg; 
}
// 验证确认密码
function checkConfirmPsw(key,requireMsg,reg,regMsg,key2,confirmMsg) {
    return key ? reg.test(key) ? key === key2 ? '' : confirmMsg : regMsg : requireMsg;
}

export{
    filterTime,
    tokenMethod,
    check,
    checkConfirmPsw
}