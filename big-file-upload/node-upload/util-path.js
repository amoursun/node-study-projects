const path = require('path');

// 大文件存储目录
const expressUploadDist = path.resolve(__dirname, 'dist/express');
const httpUploadDist = path.resolve(__dirname, 'dist/http');

const config = {
    port: 3001,
}

module.exports = {
    PATH_EXPRESS_UPLOADDIST: expressUploadDist,
    PATH_HTTP_UPLOADDIST: httpUploadDist,
    CONFIG: config
}