// 框架
const express = require('express');
const session = require('express-session');
// post数据处理
const bodyPaeser = require('body-parser');
// 处理时间格式化的包
const moment = require('moment');
// 模板引擎
const artTemplat = require('express-art-template');
// 处理网站小图标
const favicon = require('express-favicon');
// 核心模块 智能拼接地址
const path = require('path');
// 引入配置文件
const config = require('./config');
// 引入自己设计好的路由路由
const homeRoutter = require('./controller/homeRouter')
const adminRoutter = require('./controller/adminRouter')


// 创建服务
const app = express();
// 3000
app.listen(config.app.port,()=>console.log('3000'));

// 1.静态资源处理
app.use('/public',express.static(path.join(__dirname,'./public')));// 设置虚拟路径 引入静态资源
app.use("/node_modules",express.static( path.join(__dirname, "./node_modules")));

// 2.模板处理
app.engine('html',artTemplat);
// 配置公用模板的内置方法 此处处理时间格式化
// {{$imports.moment($value.time).format('YYYY-MM-DD HH:mm:ss')}}
app.set('view options',{
  // 导入外部变量
  imports : {
    moment:{
      moment,
      getUsers:function(){//因为app.js是在服务启动的时候执行一次 不能改变值 
         return global.users;//为了每次拿的时候都是新的用户登录信息
      }
    }
  }
})
// 3.post数据处理
app.use(bodyPaeser.urlencoded({extended:false}));//url 方式
// app.use(bodyPaeser.json());

// 4.网站小图标
app.use(favicon(path.join(__dirname,'./favicon.ico')));

// 5.配置session
app.use(
  session({
    // 秘钥 加密字符
    secret: "node-blog",
    // 是否重新保存session
    resave: false,
    // 和服务器建立会话的时候是否一会话就有session
    // 是否在和服务器建立连接的时候初始化session
    saveUninitialized: true
  })
);


// 5.处理业务
// 1.前台展示  homeRoutter
// 基于/下边的 ---因为路由文件里面都是/
app.use(homeRoutter);//使用路由

// 2.后台管理  adminRoutter
// 基于/admin下边的(假装有个路径) 给后台展示的路由加一个前缀路径 ---因为路由文件里面都是/
// admin路径下的路由都需要登录
// 访问这些路由之前就可以校验登录状态
// 在后台路由之前 加一个流程 (加一个中间件||加一个校验登录的函数)
const checkedLoginMiddlewareFuc = (req,res,next)=>{
  // 未登录
  if(!req.session.users){
   return res.redirect('/login')
  }
  next();//方行
}
app.use("/admin", checkedLoginMiddlewareFuc, adminRoutter);//使用路由







