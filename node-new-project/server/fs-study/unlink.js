const fs = require('fs');

/**
 * 删除文件
 * 接收参数
 * path - 将创建的目录路径
 * mode - 目录权限（读写权限），默认 0777
 * callback - 回调，传递异常参数 err
 */
fs.rmdir('deme/text.js', (err) => {
  if(err) {
    console.log(err);
    return false;
  } else {
    console.log("删除文件成功！");
    // Console：创建目录成功！
  }
})