# node-blog
> 基于Node.js的博客系统



## 起步
```shell
# 下载静态页面
git clone git@github.com:zhousg/node-blog.git

# 进入项目目录
cd node-blog

# 安装了依赖
npm i

# 创建一个分支 heima44 
git checkout -b heima44
```



## 整理需求

### 前台展示
- 首页所有博客的分页渲染  
- 博客的详情页面
- 个人的博客中心 (个人信息&所写博客的分页展示)
- 注册
- 登录
- 招聘
- 关于我们

### 后台管理
- 首页
- 文章的添加
- 文章的管理（编辑 删除 查询）
- 个人信息设置
- 个人密码修改



## 数据库设计

> 数据库 blog

1. users

| 字段       | 类型      | 备注     |
| -------- | ------- | ------ |
| id       | int     | 用户的主键  |
| name     | varchar | 用户名    |
| pass     | varchar | 密码     |
| email    | varchar | 邮箱     |
| avatar   | varchar | 头像的地址  |
| gender   | int     | 0 男 1女 |
| company  | varchar | 所属单位   |
| homepage | varchar | 个人主页   |
| alt      | varchar | 对自己的评价 |

2. posts

| 字段      | 类型      | 备注             |
| ------- | ------- | -------------- |
| id      | int     | 文章的主键          |
| uid     | int     | 关联用户的ID        |
| title   | varchar | 文章标题           |
| brief   | varchar | 文章摘要           |
| content | text    | 文章内容           |
| status  | int     | 文章的状态 0 正常 1删除 |
| time    | date    | 更新时间           |

大家可以执行：blog.sql 的脚本初始化数据库,之前创建数据库 blog。



## 技术分析

- 使用express框架web应用
- body-parser post数据
- art-template express-art-template 模板引擎
- mysql 数据库操作
- multer 上传文件
- moment 时间格式化
- md5 加密



##项目架构

> 打算构建一个MVC模式的项目架构
>
> m - model  v - views  c - controller

app.js

```js
const express = require('express');
const bodyParser = require('body-parser');
const artTemplate = require('express-art-template');
const favicon = require('express-favicon');
const path = require('path');

const homeRouter = require('./controller/homeRouter');
const adminRouter = require('./controller/adminRouter');

const config = require('./config');

/*创建服务*/
const app = express();
app.listen(config.app.port, () => console.log('server blog port:' + config.app.port));

/*1.静态资源处理*/
app.use('/public', express.static(path.join(__dirname, './public')));
app.use('/node_modules', express.static(path.join(__dirname, './node_modules')));
/*2.模板的处理*/
app.engine('html', artTemplate);
/*3.post数据处理*/
app.use(bodyParser.urlencoded({extended: false}));
/*4.网站小图标*/
app.use(favicon(path.join(__dirname, './favicon.ico')));

/*处理业务*/
/*1.前台展示  homeRouter*/
app.use(homeRouter);
/*2.后台管理  adminRouter 给路由加一个路径 */
app.use('/admin', adminRouter);
```



## 前台路由设计

| 路由的路径     | 请求方式 | 备注解释               |
| --------- | ---- | ------------------ |
| /?page=1  | get  | 首页分页展示博客           |
| /article  | get  | 博客详情展示             |
| /center   | get  | 展示博客中心  用户信息  博客列表 |
| /login    | get  | 登录页面               |
| /register | get  | 注册页面               |
| /join     | get  | 加入                 |
| /about    | get  | 关于我们               |
| /login    | post | 提交登录信息             |
| /register | post | 提交注册信息             |



## moment时间模块

```js
// console.log(moment(new Date()).format('YYYY-MM-DD hh:mm:ss')); hh 12小时制 HH 24小时制
// 在模板内使用这个 moment 函数
// 但是模板内不能使用 外部的函数或者变量
// template('html',{moment:moment}) 每一个模板都需要传递这个方法
// 能不能配置一个公用的模板内部的方法
app.set('view options', {
    imports: {moment}
});
//在模板内使用
//<span>{{$imports.moment($value.time).format('YYYY-MM-DD hh:mm:ss')}}</span>
```

