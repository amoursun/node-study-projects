/**
 * 静态文件
 */
const express = require('express');
const bodyParser = require('body-parser');
const multer  = require('multer');
const fs = require('fs');
const iconv = require('iconv-lite');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));
app.use(cookieParser())
 
app.get('/get', function (req, res) {
    res.sendFile( __dirname + '/public/' + 'get.html' );
    console.log("Cookies: ", req.cookies)
});
app.get('/post', function (req, res) {
    res.sendFile( __dirname + '/public/' + 'post.html' );
    console.log("Cookies: ", req.cookies)
});
app.get('/file', function (req, res) {
    res.sendFile( __dirname + '/public/' + 'file.html' );
    console.log("Cookies: ", req.cookies)
});

app.get('/process_get', function (req, res) {
    const {url, first_name, last_name} = req.query;
    // 输出 JSON 格式
    response = {
        first_name,
        last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
});

// 创建 application/x-www-form-urlencoded 编码解析
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.post('/process_post', urlencodedParser, function (req, res) {
    const {url, first_name, last_name} = req.body;
    // 输出 JSON 格式
    response = {
        first_name,
        last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

app.post('/process_file_upload', function (req, res) {
    console.log(req.files[0]);  // 上传的文件信息
    const {originalname, path} = req.files[0];
    const utf8Filename = iconv.decode(Buffer.from(originalname, 'binary'), 'UTF-8').toString();
    const des_file = __dirname + '/dist/' + utf8Filename;
    // 将文件名称从原始编码转换为 UTF-8
    console.log(utf8Filename, 'utf8Filename');
    fs.readFile(path, 'utf8', function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if (err){
                console.log(err);
            }
            else{
                response = {
                    message: '上传成功', 
                    filename: utf8Filename
                };
            }
            const json = JSON.stringify(response, null, 2);
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            console.log(json);
            res.end(json);
        });
    });
 })

const server = app.listen(8081, function () {
    console.log('应用实例，访问地址为 http://localhost:8081', server.address())
});

/**
 * http://localhost:8081 => 访问 public/index.html
 * http://localhost:8081/index-2.html => 访问 public/index-2.html
 */