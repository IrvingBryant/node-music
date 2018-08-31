// var express = require('express');
// var router = express.Router();
// var mongoose = require('mongoose');
// var user = require('../models/user');
//
// //连接MongoDB数据库
// mongoose.connect('mongodb://127.0.0.1:27017/db_music');
//
// //on方法是监听
// mongoose.connection.on("connected",function(){
//     console.log("MongoDB connected success.");
// });
// mongoose.connection.on("error",function(){
//    console.log("MongoDB connected fail");
// });
//
// mongoose.connection.on("disconnected",function(){
//     console.log("MongoDB connected disconnected");
// });
//
// //get('/login') 截取Get请求方式的url中含有/login的请求
//
// router.get("/", function (req,res,next){
//     //查找数据库
//     user.find({},function(err,doc){
//         if(err){
//             //json()以json格式输出
//             res.json({
//              status:'1',  //设置状态码为1时 查找出错
//              msg:err.message
//             });
//         }else{
//             res.json({
//                status:'0',
//                 msg:'',
//                 result:{
//                     count:doc.length,
//                     list:doc
//                 }
//             });
//         }
//     });
// });
// module.exports = router;