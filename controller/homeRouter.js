const express = require("express");
// 引入posts文件
const postdb = require("../model/posts");
const usersdb = require("../model/users");
// 创建路由
const router = express.Router();

const pageSize = 4;
//首页
router.get("/", (req, res) => {
  // 数据 哪页到多少条  用户的请求会传递页码 page页码get方式
  let pageNow = req.query.page || 1; //默认第一页

  // 处理页面的  查完列表数据在查询页码数据
  postdb.findAllPage(pageNow, pageSize, (err, rows) => {
    if (err) res.send(err); // 有错误给前台的错误

    // 处理页码
    postdb.findAllCount((err, count) => {
      //模板内不能使用外部变量
      if (!err)
        return res.render("home/index.html", {
          // 数据
          rows,
          // 总页数
          count,
          // 总条数
          pageCount: Math.ceil(count / pageSize),
          // 当前页码
          pageNow
        }); //返回页面 传给模板数据
      res.send(err); // 有错误给前台的错误
    });
  });
});
//博客详情
router.get("/article", (req, res) => {
  // 根据 id 点击页面的查看详情 获取到的
  let id = req.query.id;
  // console.log(id)
  postdb.find(id, (err, posts) => {
    // console.log(posts);
    res.render("home/article.html", { posts });
  });
});
//个人博客中心
router.get("/center", (req, res) => {
  // 1.个人信息
  // 2.列表分页信息
  // 3.縂頁數--总条数
  let userId = req.query.id;
  let pageNow = req.query.page || 1;//页码
  usersdb.find(userId, (err, users) => {
    if (err) return res.send(err);
    postdb.findAllUserPage(userId,pageNow,pageSize,(err,rows)=>{
      if (err) return res.send(err);
      // 用户总条数方法
      postdb.findAllUserCount(userId,(err,count)=>{
        if (err) return res.send(err);       
        res.render("home/center.html",{
        // 用户个人信息数据
        users,
        // 分页列表数据
        rows,
        // 总条数
        count,
        pageNow,//当前页码
        // 总页码
        pageCount:Math.ceil(count/pageSize)
      });
      })

    });
  });
});
//登录页面
router.get("/login", (req, res) => {
  res.render("home/login.html");
});
//登录处理
router.post("/login", (req, res) => {
  res.render("home/login.html");
});
//注册页面
router.get("/register", (req, res) => {
  res.render("home/register.html");
});
//注册信息提交
router.post("/register", (req, res) => {
  res.render("home/register.html");
});
//加入我们
router.get("/join", (req, res) => {
  res.render("home/join.html");
});
//关于我们
router.get("/about", (req, res) => {
  res.render("home/about.html");
});

module.exports = router;
