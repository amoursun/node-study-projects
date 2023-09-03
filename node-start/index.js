const express = require('express');
const compression = require('compression');
const userAgent = require('express-ua-middleware');

const app = express();

const bindPath = (router, path) => {
    router.use(
        '/' + path,
        express.static(__dirname + '/' + path, {
            setHeaders: (res, path, stat) => {
                if (express.static.mime.lookup(path) === 'text/html') {
                    // Custom Cache-Control for HTML files
                    noCache(res);
                }
            }
        })
    );
};

const fileRouter = new express.Router();
bindPath(fileRouter, 'pages')
bindPath(fileRouter, 'dll')
bindPath(fileRouter, 'extra')
bindPath(fileRouter, 'dist')

const noCache = res => {
    res.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate, proxy-revalidate');
};

app.use(compression())
    .use(userAgent)
    .use((req, res, next) => {
        const isAndroid = req.userAgent && req.userAgent.os && req.userAgent.os.name === 'Android';
        if (isAndroid) {
            noCache(res);
            return next();
        }
        return next();
    })
    .use(
        fileRouter
    )
    .listen(8080, () => {
        console.log('running');
    });
