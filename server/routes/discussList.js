var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var discusslist = require('../models/discussList');
var user = require('../models/user');

router.post("/discusslist", function (req,res,next){
    console.log("discusslistId:"+req.body.discussId)
    var param ={
        discussId:req.body.discussId
    }
    //查找discusslists集合 是否存在评论数据
    discusslist.findOne(param,function(err,doc){
        if(err){
            //json()以json格式输出
            res.json({
                status:'1',  //设置状态码为1时 查找出错
                msg:err.message
            });
        }else{
            //此时discusslists集合中存在数据就加载
            if(doc) {
                res.json({
                    status: '0',
                    msg: '评论list加载成功',
                    result: doc
                });
            }else{
                //如果discusslists集合不存在需要自动添加数据
                //userName 表示当前登录的用户名，通过查找userName以及discussId查到这个mv的基本信息
                user.findOne({userName:req.body.userName,"mvsoclaiList":{ $elemMatch:{icon:req.body.discussId}}},function(err,doc){
                   if(err){
                       res.json({
                           status:'1',  //设置状态码为1时 查找出错
                           msg:err.message
                       });
                   }else{
                       //如果查到
                       if(doc) {
                           var discussInsertparam = {
                               discussId: req.body.discussId,
                               singer_mid: " http://p.qpic.cn/music_cover/1Fr9IFMhWDPeUzWKVEjn3QTL2eX2QziaJmaL0ZAmsvtW71ic9IDUoYzg/300?n=1",
                               discussCountS: "123",
                               listDesc: req.body.listDesc,
                               listOwner: req.body.listOwner,
                               listDiscuss: []
                           }
                           discusslist.create(discussInsertparam,function(err,doc){
                               if(err){
                                  console.log("discusslist集合数据插入失败")
                               }else{
                                   res.json({
                                       status:'0',
                                       msg:'discusslist插入成功',
                                       result:doc
                                   });
                               }
                           })
                       }else{
                           res.json({
                               status:'1',
                               msg:'users集合未查到推荐MV的数据'
                           });
                       }
                   }
                });

            }
        }
    });
});

router.post("/addComment",function(req,res,next){
    var param = {
        username:req.body.username,
        icon:"",
        time:req.body.time,
        discussContent:req.body.discussContent,
        like:0,
        showLike:true,
        clickTime:0
    }
    var discussIdParam={
        discussId:req.body.discussId
    }
    //通过查找discussId的listDiscuss数组的值查找是否评论过
    discusslist.findOne({discussId:req.body.discussId,"listDiscuss":{ $elemMatch:{"username":req.body.username}}},function(err,doc){
        if(err) {
            //json()以json格式输出
            res.json({
                status: '1',  //设置状态码为1时 查找出错
                msg: err.message
            });
        }else{
            if(doc){
                res.json({
                        status:'10002',
                        msg:'您已经评论过啦！！',
                        result:doc
                    });
            }else{
                //向特定的discussId表且属性名为listDiscuss中的添加param
                discusslist.update(discussIdParam,{ $push:{listDiscuss:param}},function(err,doc){
                    if(err){
                        console.log("数据插入失败");
                    }else{
                        //注册成功直接登录且设置cookie
                        res.json({
                            status:'0',
                            msg:'发表评论成功',
                            result:doc
                        });
                        console.log("评论内容插入成功");
                    }
                });
            }
        }

    })

});

router.post("/clickLike",function(req,res,next){
    // 这里的username指的是被点赞评论的用户名
    discusslist.update({discussId:req.body.discussId,"listDiscuss.username":req.body.username},{$set:{"listDiscuss.$.like":req.body.like}},function(err,doc){
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
                    console.log("哪张歌单评论表ID："+req.body.discussId+";  "+"who评论："+req.body.username +";  "+"被点赞次数："+ req.body.like);
                }
        }
    )
});
module.exports = router;