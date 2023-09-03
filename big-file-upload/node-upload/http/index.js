const http       = require('http');
const FileUpload = require('./util-server');
const pathUtil   = require('../util-path');

const {CONFIG} = pathUtil;
const ServerUtil = new FileUpload();
const app = http.createServer();

app.on('request', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.status = 200;
        res.end();
        return;
    }

    if (req.url === '/big-upload') {
        await ServerUtil.handleFormData(req, res);
        return;
    }

    if (req.url === '/merge') {
        await ServerUtil.handleMerge(req, res);
        return;
    }
    if (req.url === '/verify') {
        await ServerUtil.handleVerifyUpload(req, res);
        return;
    }
    if (req.url === '/delete') {
        await controller.deleteFiles(req, res);
        return;
    }
});

app.listen(CONFIG.port, () => {
    console.log(`Server is running on port http://localhost:${CONFIG.port}`);
});
