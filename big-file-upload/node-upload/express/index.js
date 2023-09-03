const express    = require('express');
const FileUpload = require('./util-express');
const pathUtil   = require('../util-path');

const {CONFIG} = pathUtil;
const ServerUtil = new FileUpload();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next(); // 继续传递到下一个中间件或路由处理函数
});

// 上传
app.post('/big-upload', async (req, res) => {
    await ServerUtil.handleFormData(req, res);
});

// 合并
app.post('/merge', async (req, res) => {
    await ServerUtil.handleMerge(req, res);
});

// 检验
app.post('/verify', async (req, res) => {
    await ServerUtil.handleVerifyUpload(req, res);
});

app.listen(CONFIG.port, () => {
    console.log(`Server is running on port http://localhost:${CONFIG.port}`);
});
