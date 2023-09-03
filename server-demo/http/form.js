const http = require('http');
const util = require('util');
const querystring = require('querystring');

const postHTML = `
<html>
    <head><meta charset="utf-8"><title>阿里云大学 Node.js 实例</title></head>
    <body>
        <form method="post">
            网站名： <input name="name"><br>
            网站 URL： <input name="url"><br>
            <input type="submit">
        </form>
    </body>
</html>
`;
http.createServer(function (req, res) {
	let body = '';
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        // 解析参数
        body = querystring.parse(body);
        // 设置响应头部信息及编码
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
    
        // 输出表单
        res.write(postHTML);
        // 输出提交的数据
        if(body.name && body.url) {
            res.write('网站名：' + body.name);
            res.write('<br>');
            res.write('网站 URL：' + body.url);
        }
        res.end();
    });
}).listen(8888, function () {
    console.log('Server running at http://127.0.0.1:8888/');
});