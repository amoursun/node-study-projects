const http = require('http');
const url = require('url');
const util = require('util');
const querystring = require('querystring');

http.createServer(function (request, response) {

	// 发送 HTTP 头部 
	// HTTP 状态值: 200 : OK
	// 内容类型: text/plain
	response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});

	// response.end(util.inspect(url.parse(request.url, true)));
	// 解析 url 参数
    const params = url.parse(request.url, true).query;
    response.write('网站名：' + params.name + '\n' );
    response.write('网站 URL：' + params.url + '\n');
	response.write(util.inspect(url.parse(request.url, true)));
    response.end();
}).listen(8888, function () {
    console.log('Server running at http://127.0.0.1:8888/');
});