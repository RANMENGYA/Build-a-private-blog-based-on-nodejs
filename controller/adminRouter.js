const express = require("express");
//创建路由对象
const router = express.Router();

router.get("/", (req, res) => {
  res.send("/admin");
});

// 导出路由
module.exports = router;
