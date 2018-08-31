var mongoose = require('mongoose');
var Schema = mongoose.Schema; //定义数据模型
var userSchema = new Schema(
    {
        "userId": Number,
        "userName": String,
        "userPwd":String,
        "mvsoclaiList":[{
            "icon":String,
            "url": String,
            "Name": String,
            "mvTit": String,
            "clickTime":Number,
            "like": Number,
            "discuss": Number,
            "whoPublish": String,
            "showLike":Boolean
        }]

    }
);
//暴露user.js mongoose模块封装了数据增删改查的方法  第三个参数是选择数据库中的集合
module.exports = mongoose.model('user',userSchema,"users");