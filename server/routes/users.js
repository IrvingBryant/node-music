var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = require('../models/user');

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/db_music');

//on方法是监听
mongoose.connection.on("connected",function(){
    console.log("MongoDB connected success.");
});
mongoose.connection.on("error",function(){
    console.log("MongoDB connected fail");
});

mongoose.connection.on("disconnected",function(){
    console.log("MongoDB connected disconnected");
});

//get('/login') 截取Get请求方式的url中含有/login的请求

router.get("/", function (req,res,next){
    //查找数据库
    user.find({},function(err,doc){
        if(err){
            //json()以json格式输出
            res.json({
                status:'1',  //设置状态码为1时 查找出错
                msg:err.message
            });
        }else{
            res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }
            });
        }
    });
});
//登录接口
router.post("/login",function(req,res,next){
  var param ={
    userName:req.body.userName,
    userPwd:req.body.userPwd
    }
    user.findOne(param,function(err,doc){
      if(err){
        res.json({
            status:'1',
            msg:err.message
        });
      }else{
        if(doc){
          //设置cookie
          res.cookie("userName",doc.userName,{
              path:'/',
              maxAge:1000*60*60
          });
          //设置session
            req.session.user = doc
            console.log('session:'+ req.session.user)
          res.json({
             status:'0',
             msg:'',
             result:doc
          });
        }else{
            res.json({
                status:'1',
                msg:"帐号密码不正确"
            });
        }
      }
    });
});
//注册接口
router.post("/reg",function(req,res,next){
    //下面来的mvsoclaiList数据为基础推送
    var param ={
        userName:req.body.userName,
        userPwd:req.body.userPwd,
        mvsoclaiList: [
            {
                "icon":"mvDiscuss1",
                "url": "http://hc.yinyuetai.com/uploads/videos/common/E8A90160C0B108730F020F7BA435EA56.mp4?sc=8df6909fff82f666",
                "userName": "长大云音乐",
                "mvTit": "体面 电影《前任3:再见前任》插曲",
                "clickTime":0,
                "like": 0,
                "discuss": 0,
                "whoPublish": "长大云之音",
                "showLike":true
            },
            {
                "icon":"mvDiscuss2",
                "url": "http://hc.yinyuetai.com/uploads/videos/common/905801607C12BA6CEB7DB4D6F3FE7DD1.mp4?sc=507c4446215aa941",
                "userName": "长大云音乐",
                "mvTit": "Suger Maroon 5 ",
                "clickTime":0,
                "like": 0,
                "discuss": 0,
                "whoPublish": "长大云之音",
                "showLike":true
            },
            {
                "icon":"mvDiscuss3",
                "url": "http://hc.yinyuetai.com/uploads/videos/common/2267015CD3CFCF4DA2CBEC6A7B53E7FA.mp4?sc=c4874bab34d47fc6",
                "userName": "长大云音乐",
                "mvTit": " Something Just Like This (Tokyo Remix) Coldplay&The Chainsmokers",
                "clickTime":0,
                "like": 0,
                "discuss": 0,
                "whoPublish": "长大云之音",
                "showLike":true
            },
            {
                "icon":"mvDiscuss4",
                "url": "http://hc.yinyuetai.com/uploads/videos/common/CD82015BB41549381C0CF751ED149089.mp4?sc=575b6650c1d4991d",
                "userName": "长大云音乐",
                "mvTit": "I’m the One-Lil Wayne&Justin Bieber&DJ Khaled&Chance The Rapper&Quavo",
                "clickTime":0,
                "like": 0,
                "discuss": 0,
                "whoPublish": "长大云之音",
                "showLike":true
            },
            {
                "icon":"mvDiscuss5",
                "url": "http://hc.yinyuetai.com/uploads/videos/common/0B2A0161040360AF59CFA9BA1BB14148.mp4?sc=ce7c1006d8e7a594",
                "userName": "长大云音乐",
                "mvTit": "王者归来 只问盛放 - 王力宏专访",
                "clickTime":0,
                "like": 0,
                "discuss": 0,
                "whoPublish": "长大云之音",
                "showLike":true
            },
            {
                "icon":"mvDiscuss6",
                "url": "http://hc.yinyuetai.com/uploads/videos/common/A14101611244F8737853EDFA073060FC.mp4?sc=d9bc90e521b6cdc5",
                "userName": "长大云音乐",
                "mvTit": "演员 无伴奏版",
                "clickTime":0,
                "like": 0,
                "discuss": 0,
                "whoPublish": "长大云之音",
                "showLike":true
            }
        ]
    }
    var paramuserName={
        userName:req.body.userName
    }
    user.findOne(paramuserName,function(err,doc){
       if(err){
           res.json({
               status:'1',
               msg:err.message
           });
       }else{
          if(doc){
              res.json({
                  status:'1',
                  msg:'用户名已存在'
              });
          }else{
            //向数据库插入数据
              user.create(param,function(err,doc){
                 if(err){
                     console.log("数据插入失败");
                 }else{
                   //注册成功直接登录且设置cookie
                     res.cookie("userName",doc.userName,{
                         path:'/',
                         maxAge:1000*60*60
                     });
                     res.json({
                         status:'0',
                         msg:'注册成功',
                         result:{
                             userName:doc.userName
                         }
                     });
                     console.log("数据插入成功");
                 }
              });
          }
       }
    });
    // //MD5 密码加密
    //   param.userPwd = getMD5Password(param.userPwd);


});

//登出接口
router.post("/logout",function(req,res,next){
  //清空cookie中的userId
  res.cookie("userName","",{
     path:'/',
     maxAge:-1
  });
  res.json({
      status:'0',
      msg:'',
      result:''
  })
});

//社交接口的实现
router.post("/soclai",function(req,res,next){
    var param ={
        userName:req.body.userName
    }
    //查找数据库
    user.findOne(param,function(err,doc){
        if(err){
            //json()以json格式输出
            res.json({
                status:'1',  //设置状态码为1时 查找出错
                msg:err.message
            });
        }else{
            res.json({
                status:'0',
                msg:'',
                result:doc
            });
        }
    });

});

//社交接口中的点赞接口
router.post("/clickLike",function(req,res,next){

    user.update({userName:req.body.userName,"mvsoclaiList.icon":req.body.discussId},{$set:{"mvsoclaiList.$.like":req.body.like}},function(err,doc){
            if(err){
                res.json({
                    status: '1',  //设置状态码为1时 查找出错
                    msg: err.message
                });
            }else{
                res.json({
                    status:'0',
                    msg:'点赞成功',
                    result:doc
                });
            }
        }
    )
});

module.exports = router;