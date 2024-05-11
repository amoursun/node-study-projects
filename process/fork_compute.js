const http = require('http')
const longComputation = () => {
    let sum = 0
    for (let i = 0; i < 1e10; i++) {
        sum += i
    }
    return sum
}
const server = http.createServer()
server.on('request', (req, res) => {
    if (req.url === '/compute') {
        console.info('计算开始', new Date())
        const sum = longComputation()
        console.info('计算结束', new Date())
        return res.end(`Sum is ${sum}`)
    } else {
        res.end('Ok')
    }
});

server.listen(3000)
// 访问: http://localhost:3000/compute 打印结果
// 计算开始 2024-03-08T08:05:19.720Z
// 计算结束 2024-03-08T08:05:33.598Z