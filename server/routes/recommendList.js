var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var recommendList = require('../models/recommendList');

router.post("/musiclistId", function (req,res,next){
    console.log("recommendPlaylistId:"+req.body.musiclistId)
    var param ={
        musiclistId:req.body.musiclistId
    }
    //查找数据库 通过音乐歌单ID来查询数据
    recommendList.findOne(param,function(err,doc){
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
module.exports = router;