import Axios from "./index";

// 获取图片验证码
function getImgCaptcha() {
    return Axios.get('/img/captcha');
}
// 获取短信验证码
function getSmsCaptcha({phone, type, imgCaptcha}) {
    Axios.withCredentials = true;
    return Axios.post('/sms/captcha', {
        phone,
        type,
            imgCaptcha
    });
}
// 获取短信验证码
function getSmsCaptchaReceive({phone, type}) {
    return Axios.get('/sms/captcha/receive', {
        params: {
            phone,
            type
        }
    });
}
// 注册
function regist({phone, password, smsCaptcha}) {
    return Axios.post('/account/register', {

        phone,
        password,
        smsCaptcha
    })
}
// 登陆
function login({phone, password}) {
    return Axios.post('/account/login', {
        phone,
        password
    });
}
// 找回密码
function findPassword({phone, smsCaptcha, password}) {
    return Axios.post('/account/reset', {
        phone, smsCaptcha, password
    })
}
// 修改密码
function updatepsw({phone,smsCaptcha,password}){
    return Axios.post('/account/reset',{
        phone, smsCaptcha, password
    })
}
export {
    getnewList,
    getImgCaptcha,
    getSmsCaptcha,
    getSmsCaptchaReceive,
    regist,
    login,
    findPassword,
    updatepsw
}