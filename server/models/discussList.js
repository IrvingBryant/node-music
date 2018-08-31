var mongoose = require('mongoose');
var Schema = mongoose.Schema; //定义数据模型
var musicListSchema = new Schema(
    {
        "discussId":String,
        "singer_mid": String,
        "discussCountS": String,
        "listDesc":String,
        "listOwner":String,
        "listDiscuss":[{
            "username":String,
            "icon": String,
            "time": String,
            "discussContent": String,
            "like":Number,
            "showLike": Boolean,
            "clickTime": Number
        }]
    }
);
//暴露user.js mongoose模块封装了数据增删改查的方法  第三个参数是选择数据库中的集合
//第一个参数是模型所包含的集合的单数名称会自动匹配数据库中的集合
module.exports = mongoose.model('discusslist',musicListSchema,"discusslists");