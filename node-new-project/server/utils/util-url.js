const url = require('url');

/**
 * http 启动才有效
 */

module.exports = {
    parseUrl: function parseUrl(req, res) {
        return url.parse(req.url, true);
    }
};