# file-upload-react
【前端】大文件上传解决方案，切片，断点续传，秒传，失败自动重试。

### 特性
1. 大文件切片上传。
2. 重复文件秒传。
3. 断点续传。
4. 控制请求并发数。
5. 显示每个切片的上传进度。
6. 切片上传失败自动重试。

### 启动
```
npm install
npm start
```

该项目还需要 file-upload-server 项目的配合。请启动 server 后再进行后续操作。

### 切片上传

我们创建一个 500M 的文件，切片大小为 10M。由于 chrome 浏览器并发数量有限，我们限制最大并发为 6，进行切片文件的上传。演示如下。

![preview](https://github.com/shenmaxg/file-upload-react/blob/main/public/iamge/preview.gif)

### 秒传

还是之前的文件，由于已经上传成功，第二次上传的时候触发秒传。

![second](https://github.com/shenmaxg/file-upload-react/blob/main/public/iamge/second.gif)

### 断点续传

上传停止后，可以从断点处重新开始上传。

![point](https://github.com/shenmaxg/file-upload-react/blob/main/public/iamge/point.gif)

### 失败自动重试

后台设置首次上传失效，可以看到，切片上传失败后自动重试。

![retry](https://github.com/shenmaxg/file-upload-react/blob/main/public/iamge/retry.gif)

### 注意事项
由于是前后端分离的应用，是存在跨域问题的，前端的端口修改后，记得将后端的 cors 设置改掉，否则后报跨域错误。

### 相关阅读

[如何做大文件上传](https://zhuanlan.zhihu.com/p/386493135)
