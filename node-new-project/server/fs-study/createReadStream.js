const fs = require('fs');
// 流的方式读取文件
const fileReadStream = fs.createReadStream('./readme.md');
// 读取次数
let count = 0;
// 保存数据
let str = '';
// 开始读取
fileReadStream.on('data', (chunk) => {
  console.log(`${++count} 接收到：${chunk.length}`);
  // Console：1 接收到：30
  str += chunk;
})
// 读取完成
fileReadStream.on('end', () => {
  console.log("——结束——");
  console.log(count);
  console.log(str);
})
// 读取失败
fileReadStream.on('error', (error) => {
  console.log(error);
});

// 1 接收到：445
// ——结束——
// 1
// - fs
//     - fs.stat 检测是文件还是目录
//     - fs.mkdir 创建目录
//     - fs.writeFile 创建写入文件
//     - fs.appendFile 追加文件
//     - fs.readFile 读取文件
//     - fs.readdir 读取目录
//     - fs.rename 重命名
//     - fs.rmdir 删除目录
//     - fs.unlink 删除文件
//     - 对应 fs.xxxSync 同步不赘述了

// - fs 流
//     - fs.createReadStream 流的方式读取文件
//     - fs.createWriteStream 流的方式写入文件

// fs 模块的 createReadStream 创建了读取流, 然后读取文件 readme.md
