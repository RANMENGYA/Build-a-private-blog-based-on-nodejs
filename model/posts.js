// 表的处理
// 引入单个连接
// const db = require('./db');
// 引入连接池
const db = require('./dbPool');

// 因为要暴露给路由使用这些方法

// 查询
exports.findAll = (cb)=>{
  let sql = 'SELECT * FROM posts'
  db.query(sql,(err,rows)=>{
    if(!err) return cb(null,rows);
    cb({msg:'数据库操作异常'})
  })
};
// 连表查询 带分页的数据pageNow第几页 pageSize一页有多少条
exports.findAllPage = (pageNow,pageSize,cb)=>{
  // 1.需要关联用户表
  // 2.需要的字段 文章id 文章标题 文章摘要 文章的更新时间 用户id 用户头像 用户名字
  // 3.需要进行排序最新的靠前
  //  ORDER BY p.time DESC 根据时间倒着排序 拼接注意空格
  // 4.分页 limit 4,4 
  let sql = 'SELECT p.id,p.title,p.brief,p.time FROM posts AS p LEFT JOIN'+
  ' users AS u ON p.uid = u.id WHERE p.status = 0 ORDER BY p.time DESC '+
  'LIMIT ?,?';// ？是要传递参

  db.query(sql, [pageSize * (pageNow-1) ,pageSize], (err, rows) => {
    // console.log(err)
    if (!err) return cb(null, rows);
    cb({ msg: "数据库操作异常" });
  });
}

// 总共多少条
exports.findAllCount = (cb) => {
  let sql = "SELECT count(id) as count FROM posts WHERE status =0 ";
  db.query(sql, (err, rows) => {
    // console.log(rows)
    if (!err) return cb(null, rows[0].count);//返回数量
    cb({ msg: "数据库操作异常" });
  });
};

// 博客详情 根据id查数据
exports.find = (id,cb) => {
  // 1.需要关联用户表
  // 2.需要的字段 文章id 文章标题 文章内容 用户id 用户头像 用户名字 介绍 单位 主页
 let sql = 'SELECT p.id, p.title, p.content, p.uid, u.avatar, u.name, u.alt, u.company, u.homepage';
    sql += ' FROM posts AS p LEFT JOIN users AS u ON p.uid = u.id WHERE p.id = ?';
    // 根据 id 点击页面的查看详情 获取到的
    db.query(sql,[id],(err,rows)=>{
      console.log(rows);
      if(!err) return cb(null,rows[0]);
      cb({ msg: "数据库操作异常" });
    })
};

// 查找列表信息 某一个用户的文章分页 根据id
exports.findAllUserPage = (userId,pageNow, pageSize, cb) => {
  // 1.需要关联用户表 根据userId
  // 2.需要的字段 文章id 文章标题 文章摘要 文章的更新时间 用户id 用户头像 用户名字
  // 3.需要进行排序最新的靠前
  //  ORDER BY p.time DESC 根据时间倒着排序 拼接注意空格
  // 4.分页 limit 4,4
  let sql =
    "SELECT p.id,p.title,p.brief,p.time FROM posts AS p LEFT JOIN" +
    " users AS u ON p.uid = u.id WHERE p.status = 0 AND p.uid=? ORDER BY p.time DESC " +
    "LIMIT ?,?"; // ？是要传递参
  // 按？顺序补充
  db.query(sql, [userId,pageSize * (pageNow - 1), pageSize], (err, rows) => {
    // console.log(err)
    if (!err) return cb(null, rows);
    cb({ msg: "数据库操作异常" });
  });
};


// 根据用户id查总共多少条
exports.findAllUserCount = (userId,cb) => {
  let sql =
    "SELECT count(id) as count FROM posts WHERE status =0 AND uid=" + userId;
  db.query(sql, (err, rows) => {
    // console.log(rows)
    if (!err) return cb(null, rows[0].count); //返回数量
    cb({ msg: "数据库操作异常" });
  });
};




