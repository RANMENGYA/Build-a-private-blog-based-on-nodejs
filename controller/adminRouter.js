const express = require("express");
const path = require("path");
const postsdb = require("../model/posts");
const usersdb = require("../model/users");

const multer = require('multer');//处理文件上传
//创建路由对象
const router = express.Router();

router.get("/", (req, res) => {
  res.render('admin/index.html')
});
// 添加文章首页
router.get("/blog/push", (req, res,posts) => {
  res.render("admin/blogEdit.html",{posts});
});
// 点击添加文章
router.post("/blog/push", (req, res) => {
  // 效验
   if (!req.body.title) return res.json({ msg: "请输文章标题" });
   if (!req.body.brief) return res.json({ msg: "请输入文章摘要" });
   if (!req.body.content) return res.json({ msg: "请输入文章内容" });
  // 默认数据
  req.body.uid = req.session.users.id;//用户id
  req.body.status = 0;//状态
  req.body.time = new Date();//时间

   postsdb.save(req.body,(err)=>{
    if(!err) return res.json({success:true});
    res.json(err);
  })
});
// 文章管理列表数据处理
router.get("/blog/list", (req, res) => {
  postsdb.findAllForAdmin({
    uid:req.session.users.id, //session里面的用户数据
    title:req.query.title || '' // 默认是空 posts方式提交过来的数据
  },function(err,rows){
    // 传数据
    console.log(err)
    console.log(rows)
    if (!err) return res.render("admin/blogManage.html", {
      // 传数据
      rows,
      //传title 保存他 查询后还加
      title: req.query.title
    });
    res.send(err.msg);
  })
});
// 渲染页面 修改接口
router.get("/blog/edit", (req, res) => {
  postsdb.findPosts(req.query.id,(err,posts)=>{
    
    res.render("admin/blogEdit.html",{posts});
  })
});
// 处理请求、 修改接口
router.post("/blog/edit", (req, res) => {
    //校验
    if (!req.body.title) return res.json({msg: '请输文章标题'});
    if (!req.body.brief) return res.json({msg: '请输文章摘要'});
    if (!req.body.content) return res.json({msg: '请输文章内容'});
    //更新时间
    req.body.time = new Date();
    postsdb.update(req.body, (err) => {
        if (!err) return res.json({success: true});
        res.json(err);
    });
});

// 删除
router.get("/blog/del", (req, res) => {
  postsdb.delete(req.query.id,(err)=>{
    // 重定向
    if(!err) return res.redirect('/admin/blog/list');
    res.send(err.msg)
  })
});
// 设置用户信息  修改个人设置
router.get("/settings", (req, res) => {
  res.render("admin/settings.html",{users:req.session.users});
});
router.post("/settings", (req, res) => {
  req.body.id = req.session.users.id;//给用户添加id
  usersdb.update(req.body,(err)=>{
    if(!err){
      // 重新把添加保存的信息添加进去
      global.users = req.session.users = req.body;
      return res.json({ success: true });//返回成功信息
    }
    res.json(err);
  })
});
router.get("/repass", (req, res) => {
  res.render("admin/repass.html");
});
router.post("/repass", (req, res) => {
  res.send("/admin");
});

// 文件上传 
// 配置上传的第三方包 配置磁盘存储信息
let storage = multer.diskStorage({
  // 目录
  destination:(req,file,cb)=>{
    cb(null, path.join(__dirname, "../public/uploads/avatar"));
  },
  // 文件名称
  filename:(req,file,cb)=>{
    cb(null,Date.now() + '-' + file.originalname)//带后缀名的路径
  },
})
// 返回上传对象
const upload = multer({storage})
router.post('/upload',upload.single('avatar'),(req,res)=>{
  // console.log(req.file)//文件数据
  res.send('/public/uploads/avatar/'+req.file.filename);
})



// 导出路由
module.exports = router;
