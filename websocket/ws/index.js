const http = require('http');
const WebSocket = require('./websocket');;

const app = http.createServer(handleServer);
app.listen(3000, function() {
    console.log('Server listening on port http://localhost:3000');
});

function handleServer(req, res) {
    res.end('websocket test\r\n');
}

// Upgrade请求处理
app.on('upgrade', callback);
function callback(req, socket, upgradeHead) {
  const ws = new WebSocket(req, socket, upgradeHead);
  // ws.keepLive(); // 保持心跳连接，否则一般经过一定的时间没有数据交互，浏览器端会主动关闭 ws 链接
  ws.on('data', function(opcode, payload) {
    console.log('receive data:', opcode, payload.length);
    ws.send('good job');
  });


  ws.on('close', function(code, reason) {
    console.log('close:', code, reason);
  });

}
