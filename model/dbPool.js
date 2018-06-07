// mysql连接池---多线连接

const mysql = require('mysql');
// 配置文件的引用
const config  = require('../config')
// 创建连接池
var pool = mysql.createPool(config.db);
// 去连接池获取一个有用的连接
/* pool.getConnection((err,connection)=>{
  // 使用连接去查询数据库
  connection.query('',(err,results,fields)=>{
    // 查询结束释放连接
    connection.release();
  })
  }) 
*/

// 封装一个query方法  帮助获取有用的连接 且提供查询数据库功能 且自动释放连接
module.exports.query = (...args)=>{
  pool.getConnection((err,connection)=>{
    // 使用连接去查询数据库;
    connection.query(...args);
    // 查询结束释放连接
    connection.release();
  })
}

