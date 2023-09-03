/**
 * 静态文件
 */

const express = require('express');
const app = express();

app.use(express.static('public'));
 
const server = app.listen(8081, function () {
    console.log("应用实例，访问地址为 http://localhost:8081", server.address())
});

/**
 * http://localhost:8081 => 访问 public/index.html
 * http://localhost:8081/index-2.html => 访问 public/index-2.html
 */