const express = require('express');
const bodyParser = require('body-parser');
const {createCanvas, registerFont} = require('canvas');
const fs = require('fs');
const echarts = require('echarts');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.static('images'));

// 注册字体，确保在生成图片时能正确显示中文字符
registerFont('./fonts/simhei.ttf', {family: 'SimHei'});

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next(); // 继续传递到下一个中间件或路由处理函数
});

app.post('/generateImage', (req, res) => {
    const {headers, baseUrl, hostname, protocol} = req;
    console.log({headers, baseUrl, hostname, protocol});
    const {data} = req.body;
    // 创建一个画布
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    // 使用Echarts渲染数据
    const chart = echarts.init(canvas, null, {
        renderer: 'canvas',
        devicePixelRatio: 2 // 可根据需要调整设备像素比
    });

    const option = {
        // Echarts的配置选项
        // Echarts配置项...
        title: {
            text: '柱状图示例'
        },
        xAxis: data.xAxis || {},
        yAxis: data.yAxis || {},
        series: data.series || [],
    };

    chart.setOption(data.option || option);

    const imgName = Math.random().toString(12).slice(2) + '.png';
    // 将渲染好的图表保存为图片文件
    const filePath = __dirname + '/images/' + imgName;
    const stream = canvas.createPNGStream();
    const writeStream = fs.createWriteStream(filePath);
    stream.pipe(writeStream);

    // 将Canvas转换为Base64格式的图片数据
    const base64Image = canvas.toDataURL();
    // 返回生成的图片数据
    res.send({
        base64Image,
        url: '//' + req.headers['host'] + '/' + imgName,
    });
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
