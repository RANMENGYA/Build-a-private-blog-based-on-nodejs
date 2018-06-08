// 用户表的处理
// 引入连接池
const db = require('./dbPool');
// 加密
const md5 = require('md5');

// 查用户信息 根据id
exports.find = (id,cb)=>{
  let sql = 'SELECT * FROM users WHERE id='+id;

  db.query(sql,(err,rows)=>{
    if(!err) return cb(null,rows[0]);
    cb({ msg: "数据库操作异常" });
  })
}

// 注册的操作 插入
// users{name}用户名
// users{email}邮箱
// users{pass}密码
exports.save = (users,cb) =>{
  /* let sql = 'INSERT INTO users(name,email,pass) VALUES(?,?,?)';
  db.query(sql,[users.name,users.email,users.pass],(err,data)=>{

  }) */
  delete users.repass;// 删除脏数据
  // 加密
  users.pass = md5(users.pass);

  // 根据键值对自动插入字段 如果对象内有一个数据是表没有的字段报错 对象内不要有脏数据
  let sql = "INSERT INTO users SET ?";
  db.query(sql,users,(err,data)=>{
    // console.log(users)
    // console.log(err)
    if(!err) return cb(null);
    cb({ msg: "保存用户信息失败" });    
  })

}

// 修改用户
exports.update = (users,cb)=>{
  let sql = 'UPDATE users SET ? WHERE id=' +users.id;
  db.query(sql, users, (err) => {
    // console.log(users)
    // console.log(err);
    if (!err) return cb(null);
    cb({ msg: "设置个人信息失败" });
  });
}



// 登录
exports.auth = (users,cb)=>{
  // 1.先通过email查出用户信息
  // 2.获取用户的密码和输入的密码进行比较
  let sql = 'SELECT * FROM users WHERE email=?';
  db.query(sql,[users.email],(err,rows)=>{
    if(!err && rows.length && rows[0].pass === md5(users.pass)) {
      cb(null,rows[0]);

    }else{
      cb({msg:'用户名或密码错误'});
    }
  })
}