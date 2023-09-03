const path       = require('path');
const express    = require('express');
// superagent是node里一个非常方便的、轻量的、渐进式的第三方客户端请求代理模块，用他来请求目标页面
const superagent = require('superagent');
// const Nightmare = require('nightmare');          // 自动化测试包，处理动态页面
// const nightmare = Nightmare({show: true});     // show:true  显示内置模拟浏览器
const puppeteer  = require('puppeteer');
const Utils      = require('./utils');

const utils = new Utils();

const hotNews = [];                                // 热点新闻
const localNews = [];                              // 本地新闻
const pointUrl = 'http://news.baidu.com/';
let pageHtml = '';

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next(); // 继续传递到下一个中间件或路由处理函数
});

app.get('/data', async function (req, res) {
    res.send({
        hotNews,
        localNews,
    });
});
app.get('/', async function (req, res) {
    // 设置响应头
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-store');
    res.send(pageHtml.text + '');
});

superagent.get(pointUrl).end((err, res) => {
    if (err) {
        // 如果访问失败或者出错，会这行这里
        console.log(`热点新闻抓取失败 - ${err}`)
    }
    else {
        // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res
        // 抓取热点新闻数据
        hotNews.push(utils.getHotNews(res.text));
        pageHtml = res;
    }
});


// /**
//  * 异步等待热点新闻数据, 上面抓取失败
//  * [description] - 抓取本地新闻页面
//  * [nremark] - 百度本地新闻在访问页面后加载js定位IP位置后获取对应新闻，
//  * 所以抓取本地新闻需要使用 nightmare 一类的自动化测试工具，
//  * 模拟浏览器环境访问页面，使js运行，生成动态页面再抓取
//  */
// nightmare
//     .goto(pointUrl)
//     .wait('div#local_news')
//     .evaluate(() => document.querySelector('div#local_news').innerHTML)
//     .then(htmlStr => {
//         // 获取本地新闻数据
//         localNews.push(utils.getLocalNews(htmlStr));
//     })
//     .catch(error => {
//         console.log(`本地新闻抓取失败 - ${error}`);
//     })
(async () => {
    // 启动浏览器实例
    const browser = await puppeteer.launch();
    
    // 创建新页面
    const page = await browser.newPage();

    // 设置视口大小（可选）
    await page.setViewport({ width: 1280, height: 800 });
    
    // 模拟浏览器访问页面
    await page.goto(pointUrl);
    
    // 获取页面的HTML内容
    const htmlContent = await page.content();
    
    // 获取本地新闻数据
    localNews.push(utils.getLocalNews(htmlContent));
    
    // 关闭浏览器
    await browser.close();
})();

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
