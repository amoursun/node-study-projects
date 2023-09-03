const express = require("express");
const fs = require("fs");
const path = require("path");
// const router = express.Router();

const app = express();
app.use(express.static("public"));

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// app.get('/', async (req, res) => {
//     res.setHeader('Content-Type', 'text/html; charset=utf-8');
// });

app.listen(3001, function() {
    console.log("Server started on port http://localhost:3001");
}); // 监听的端口
