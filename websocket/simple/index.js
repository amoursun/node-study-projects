const http = require('http');
const fs = require('fs');
const socketIO = require('socket.io');

const app = http.createServer(handleServer);
app.listen(4000, function() {
    console.log('Server listening on port http://localhost:4000');
});

function handleServer(req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
    });
}
const io = socketIO(app);
io.on('connection', function (socket) {
    // 处理客户端发送的消息
    socket.on('message', (data) => {
        console.log('接收到客户端消息:', data);

        // 发送消息给所有连接的客户端
        io.emit('message', data);
    });

    // 监听客户端断开连接事件
    socket.on('disconnect', () => {
        console.log('客户端断开连接');
    });
});