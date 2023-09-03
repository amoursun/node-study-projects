const fs = require('fs');

// fs.rename 重命名
fs.rename('index.js', 'jsliang.js', (err) => {
  if(err) {
    console.log(err);
    return false;
  } else {
    console.log("重命名成功！");
  }
})


// fs.rename 剪切
fs.rename('jsliang.js', 'node_modules/jsliang.js', (err) => {
  if(err) {
    console.log(err);
    return false;
  } else {
    console.log("剪切成功！");
  }
})

