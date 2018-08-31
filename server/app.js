var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var musicListDiscussRouter = require('./routes/discussList');
var recommendListRouter = require('./routes/recommendList');
var session = require('express-session');
var app = express();

// view engine setup  设置视图引擎
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
 secret:'userInfo',
 cookie:{maxAge:60000},
 resave:false,
 saveUninitialized:true
}));
// 登录拦截
app.use(function(req,res,next){
  //查询是否存在cookies信息
   if(req.cookies.userName){
      next();
   }else{
       console.log("path:"+req.path);
       // req.originalUrl.indexOf('/recommendPlaylist')>-1  originalUrl 是整条url indexOf()是否存在recommendPlaylist 存在就是就有索引大于-1就为true
      if(req.originalUrl =='/users/login' || req.originalUrl=='/users/logout' || req.originalUrl=='/users/reg' || req.path=='/musicDiscuss/discusslist'  || req.path=='/recomendmusiclist/musiclistId'){
          next();
      }else{
          res.json({
             status:'10001',
             msg:'未登录',
              result:''
          });
      }
   }
})
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter)
//配置歌单的评论点赞接口
app.use('/musicDiscuss', musicListDiscussRouter);
//配置推荐歌单音乐信息接口
app.use('/recomendmusiclist', recommendListRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
 
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
