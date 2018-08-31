var mongoose = require('mongoose');
var Schema = mongoose.Schema; //定义数据模型
var recommendlistSchema = new Schema(
    {
        "singer_mid":String,
        "fans": String,
        "listDesc":String,
        "listOwner":String,
        "list": [
            {
                "musicData": {
                    "albumdesc": String,
                    "albummid": String,
                    "songmid": String,
                    "songname": String,
                    "singer": [
                        {
                            "name": String
                        }
                    ]
                }
            }
            ]
    }
);
//暴露user.js mongoose模块封装了数据增删改查的方法  第三个参数是选择数据库中的集合
//第一个参数是模型所包含的集合的单数名称会自动匹配数据库中的集合
module.exports = mongoose.model('recommendlist',recommendlistSchema,"recommendlists");