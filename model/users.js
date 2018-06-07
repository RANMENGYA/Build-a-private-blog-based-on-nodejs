// 用户表的处理
// 引入连接池
const db = require('./dbPool');

// 查用户信息 根据id
exports.find = (id,cb)=>{
  let sql = 'SELECT * FROM users WHERE id='+id;

  db.query(sql,(err,rows)=>{
    if(!err) return cb(null,rows[0]);
    cb({ msg: "数据库操作异常" });
  })
}


