import Axios from "./index";

function getNewListByChannelname({channelname, page, limit}) {
    return Axios.get('http://localhost:8080/json/new_yaowen_1.json',{
    // return Axios.get('/news/list', {
        // get方法传递params参数对象
        params: {
          channelname: channelname,
          page: page,
          limit: limit
        }
      })
   
}

function getHotKeys() {
    return Axios.get('http://localhost:8080/json/hotnews_list.json');
    // return Axios.get('/hotNews/list');
}

function getDetails({id}) {
    return Axios.get('http://localhost:8080/json/new_details.json');
//    return Axios.get('/news/details', {
//         params: {
//             id
//         }
//     });
}
// 评论列表
function getCommentList({id, page, limit}) {
    return Axios.get('http://localhost:8080/json/comment_list.json')
    // return Axios.get('/comment/list', {
    //     params: {
    //         id,
    //         page,
    //         limit
    //     }
    // })
}

// 评论文章 | 评论评论
function addComment({articleId, commentId, content, token}) {
    return Axios.post('/comment/add', {
        articleId,
        commentId,
        content,
        token
    });
}

// 评论评论
function commentRate({commentId, token, rate}) {
    return Axios.post("/comment/rate", {
        commentId,
        token,
        rate
    })
}

// 获取搜索热词
function getNewListByHotKey({keyword, page, limit}) {
    //return Axios.post('/news/search', {
    return Axios.get('/news/search', {
        params:{
            keyword, 
            page, 
            limit

        }
    })
}

export {
    // 根据channelname获取new
    getNewListByChannelname,
    // 获取热词
    getHotKeys,
    getDetails,
    // 获取评论列表
    getCommentList,
    // 添加评论
    addComment,
    // 评论评论
    commentRate,
    // 根据hotkey获取new
    getNewListByHotKey
}