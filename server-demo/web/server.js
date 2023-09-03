const http = require('http');
const fs = require('fs');
const url = require('url');

// 创建服务器
http.createServer((req, res) => {
    // 解析请求，包括文件名
    const pathname = url.parse(req.url).pathname;
    // 输出请求的文件名
    console.log('pathname', pathname);
    // 从文件系统中读取请求的文件内容
    fs.readFile(pathname.substr(1), (err, data) => {
        if (err) {
            console.log(err);
            // HTTP 状态码: 404 : NOT FOUND
            // Content Type: text/plain
            res.writeHead(404, {'Content-Type': 'text/html'});
         }
         else{	         
            // HTTP 状态码: 200 : OK
            // Content Type: text/plain
            res.writeHead(200, {'Content-Type': 'text/html'});	
            
            // 响应文件内容
            res.write(data.toString());		
         }
         //  发送响应数据
         res.end();
    });
}).listen(8881, function () {
    console.log('Server running at http://localhost:8881/index.html');
});
