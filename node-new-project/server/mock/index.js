const express = require("express");
const util = require('util');
const path = require("path");
const fsUtil = require("../utils/util-fs");
const {getUserInfo} = require("./export");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

app.get('/user/info', async function (req, res) {
    // const {id} = urlUtil.parseUrl(req, res).query;
    const {id} = req.query;
    res.end(getUserInfo(id));
});

app.get('/fs/stat', async function (req, res) {
    const data = await fsUtil.stat(req, res);
    res.end(data);
});

app.listen(3000, function() {
    console.log("Server started on port http://localhost:3000");
}); // 监听的端口
