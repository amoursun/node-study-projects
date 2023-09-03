const express = require('express');
const url = require('url');
const Message = require('./models/message');
const User = require('./models/user');
const user = new User();
const messageCache = new Message();

const app = express();
app.use(express.json());
app.use(express.static('..'))

app.set('title', 'My Application');

// 中间件，用于处理 OPTIONS 预检请求
app.use((req, res, next) => {
    // 设置响应头，允许特定的跨域请求
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.sendStatus(200);
    }
    else {
        next();
    }
});



app.listen(8080, () => {
    console.log('server started on port http://localhost:8080');
});


// GET 首页
app.get('/getUser', async (req, res) => {
    const info = await user.getUser();
    // 校验密码
    res.json({
        ...info,
        message: info.err,
    });
});

// 获取信息
app.get('/getMessage', async (req, res) => {
    const {code, data, err} = await messageCache.getMessage();

    // 读取信息
    res.json({
        code: code,
        data: data || [],
        message: err,
    });
});


// 发送消息
app.post('/sendMessage', async (req, res) => {
    const {id, content} = req.body;
    console.log('提交留言信息');
    if(!content) {
        res.json({
            code: 203,
            message: '新增失败, 留言内容为空！'
        });
    }
    else if(content.length > 500) {
        res.json({
            code: 203,
            message: '新增失败, 字数超过限制！'
        });
    }
    else {
        const data = await messageCache.saveMessage({id, content});
        res.json(data);
    }
});

// 登录
app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    console.log('登录', username, password);

    if (!username) { // 用户名为空
        res.json({
            code: 203,
            message: '登录失败，用户名为空'
        });
    }
    else if (!password) { // 密码为空
        res.json({
            code: 203,
            message: '登录失败，密码为空'
        });
    }
    else if(username.length > 20) {
        res.json({
            code: 203,
            message: '登录失败，姓名过长'
        });
    } else if(password.length > 20) {
        res.json({
            code: 203,
            message: '登录失败，密码过长'
        });
    }
    else {
        const info = await user.loginUser({username, password});
        // 校验密码
        res.json({
            code: info.code,
            message: info.err,
        });
    }
});

// 注册
app.post('/register', async (req, res) => {
    console.log('注册');
    const {username, password} = req.body;

    if (!username) { // 用户名为空
        res.json({
            code: 203,
            message: '注册失败, 用户名为空'
        });
    }
    else if (!password) { // 密码为空
        res.json({
            code: 203,
            message: '注册失败，密码为空'
        });
    }
    else if(username.length > 20) {
        res.json({
            code: 203,
            message: '注册失败，姓名过长'
        });
    } else if(password.length > 20) {
        res.json({
            code: 203,
            message: '注册失败，密码过长'
        });
    }
    else {
        // 校验注册: 有提示已存在用户(前置) 直接注册
        const checkRes = await user.checkUser(username);
        if (checkRes.code === 200) {
            console.log('用户名已注册');
            // res.write(JSON.stringify({code: checkRes.code, message: '用户名已注册'}));
            // res.end();
            res.json({code: checkRes.code, message: '用户名已注册'});
        }
        else {
            const addRes = await user.addUser({
                userId: username,
                username,
                password,
                time: Date.now()
            });
            console.log(addRes);
            res.json(addRes);
        }
    }
});
