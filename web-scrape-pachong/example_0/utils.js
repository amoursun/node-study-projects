// cheerio相当于node版的jQuery
const cheerio = require('cheerio');


module.exports = class Utils {
    getHotNews = (htmlStr) => {
        let hotNews = [];
        // 访问成功，请求http://news.bai.com/页面所返回的数据会包含在res.text中。
        
        /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
           以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
         */
        let $ = cheerio.load(htmlStr);
      
        // 找到目标数据所在的页面元素，获取数据
        $('div#pane-news ul li a').each((idx, ele) => {
          // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
          // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
          let news = {
            title: $(ele).text(),        // 获取新闻标题
            href: $(ele).attr('href')    // 获取新闻网页链接
          };
          hotNews.push(news)              // 存入最终结果数组
        });
        return hotNews
    };

    getLocalNews = (htmlStr) => {
        let localNews = [];
        let $ = cheerio.load(htmlStr);
        // 本地新闻
        $('ul#localnews-focus li a').each((idx, ele) => {
          let news = {
            title: $(ele).text(),
            href: $(ele).attr('href'),
          };
          localNews.push(news)
        });
          
        // 本地资讯
        $('div#localnews-zixun ul li a').each((index, item) => {
          let news = {
            title: $(item).text(),
            href: $(item).attr('href')
          };
          localNews.push(news);
        });
      
        return localNews
    };
}