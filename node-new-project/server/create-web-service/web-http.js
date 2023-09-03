const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
// const router = express.Router();

 // 获取后缀名
const getExt = (extName) => {
    // switch(extName) {
    //     case '.html':
    //         return 'text/html';
    //     case '.css':
    //         return 'text/css';
    //     case '.js':
    //         return 'text/js';
    //     default:
    //         return 'text/html';
    // }
    // readFile 是异步操作，所以需要使用 readFileSync
    let data = fs.readFileSync('./public/ext.json');
    let ext = JSON.parse(data.toString());
    return ext[extName];
}
http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.status = 200;
        res.end();
        return;
    }

    // 获取响应路径
    let pathName = url.parse(req.url).pathname;
    // 默认加载路径
    if (pathName == "/") {
        // 默认加载的首页
        pathName = "index.html";
    }
    // 获取文件的后缀名
    let extName = path.extname(pathName);

    // 过滤 /favicon.ico 的请求
    if (pathName !== "/favicon.ico") {
        // 获取 public 下的 index.html
        fs.readFile("./public/" + pathName, (err, data) => {
            if (err) {
                // 如果不存在这个文件
                console.log("404 Not Found!");
                fs.readFile('./public/404.html', (errorNotFound, dataNotFound) => {
                    if(errorNotFound) {
                        console.log(errorNotFound);
                    } else {
                        res.writeHead(200, {
                            "Content-Type": "text/html; charset='utf-8'"
                        });
                        // 读取写入文件
                        res.write(dataNotFound);
                        // 结束响应
                        res.end();
                    }
                })
                return;
            }
            else {
                // 返回这个文件
                // 获取文件类型
                const ext = getExt(extName);
                console.log('ext', ext);
                // 设置请求头
                res.writeHead(200, {
                    "Content-Type": ext + "; charset='utf-8'"
                });
                // 读取写入文件
                res.write(data);
                // 结束响应
                res.end();
            }
        }); // 读取文件
    }

    

}).listen(3002, function() {
    console.log("Server started on port http://localhost:3002");
}); // 监听的端口

