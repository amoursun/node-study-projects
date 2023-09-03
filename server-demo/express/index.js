const express = require('express');
const fs = require('fs');
const CircularJSON = require('circular-json');
const app = express();

//  主页输出 "Hello World"
app.get('/', function (req, res) {
   console.log("主页 GET 请求");
   fs.writeFile('req.json', CircularJSON.stringify(req),  function(err) {
      if (err) {
          return console.error(err);
      }
      console.log("req数据写入成功！");
      // console.log("--------我是分割线-------------")
      // console.log("读取写入的数据！");
      // fs.readFile('input.txt', function (err, data) {
      //    if (err) {
      //       return console.error(err);
      //    }
      //    console.log("异步读取文件数据: " + data.toString());
      // });
   });
   fs.writeFile('res.json', CircularJSON.stringify(res),  function(err) {
      if (err) {
          return console.error(err);
      }
      console.log("res数据写入成功！");
   });
   res.send('Hello GET');
 })
  
  
 //  POST 请求
 app.post('/', function (req, res) {
    console.log("主页 POST 请求");
    res.send('Hello POST');
 })
  
 //  /del_user 页面响应
 app.get('/del_user', function (req, res) {
    console.log("/del_user 响应 DELETE 请求");
    res.send('删除页面');
 })
  
 //  /list_user 页面 GET 请求
 app.get('/list_user', function (req, res) {
    console.log("/list_user GET 请求");
    res.send('用户列表页面');
 })
  
 // 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
 app.get('/ab*cd', function(req, res) {   
    console.log("/ab*cd GET 请求");
    res.send('正则匹配');
 })
  
const server = app.listen(8081, function () {
   console.log("应用实例，访问地址为 http://localhost:8081", server.address())
})