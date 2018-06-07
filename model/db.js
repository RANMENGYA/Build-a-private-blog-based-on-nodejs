// 赋值连接数据库提供数据库查询需要的连接的文件
const mysql = require('mysql');
// 配置文件的引入
const config = require('../config');

// 1.创建连接
const connection= mysql.createConnection(config.db);
// 2.发起连接
connection.connect();
// 3.进行查询
// 导出query方法      //剩余运算 因为有传两个参数的时候有传递三个的时候 传的参数要求保持一致
module.exports.query=(...args)=>{
                  //展开运算 因为有传两个参数的时候有传递三个的时候 传的参数要求保持一致
  connection.query(...args);// 模块要在别的文件用
};
// 4.关闭连接  启动就不关闭了



