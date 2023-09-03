- Node 的非阻塞 I/O 是什么？
- Node events 模块是什么？

### 首先，在我们正常编程中，我们是希望程序能够一行一行按照我们的意愿编写的：
```js
    console.log("1");

    console.log("2");

    console.log("3");

    /**
     * Console：
     * 1
     * 2
     * 3
     */
```
但是有时候，会执行一些异步方法（函数）：
```js
    console.log("1");

    // console.log("2");
    let fs = require('fs');
    getExt = () => {
    fs.readFile('08_ext.json', (err, data) => {
        console.log("2");
    })
    }
    getExt();

    console.log("3");

    /**
     * Console：
     * 1
     * 3
     * 2
     */
```
- 由于 fs.readFile 是 Node 的异步函数
- 程序先执行了 1 和 3，最后才执行 fs.readFile 的 2 部分
- Node 不会因为一段代码的逻辑错误，从而导致其他代码无法运行
- **问题: 步骤 3 可能拿不到步骤 2 的执行结果了, 这就是 Node 的非租塞性 I/O 驱动**

### 解决这个问题
#### 通过回调函数
通过 Node 的 events 模块

通过回调函数来解决这个异步问题：
```js
    let fs = require("fs");

    getExt = (callback) => {
    fs.readFile('08_ext.json', (err, data) => {
        callback(data);
    })  
    }

    getExt( (result) => {
    console.log(result.toString());
    })
```
- 通过回调，我们可以将 getExt 的数据提取出来。

#### 通过 Node 的 events 模块来解决这个异步问题
```js
    // 引入 fs 模块
    const fs = require("fs");

    /**
     * Node 事件循环：
     * 1. Node 是单进程单线程应用程序，但是通过事件和回调支持并发，所以性能非常高。
     * 2. Node 的每一个 API 都是异步的，并作为一个独立线程运行，使用异步函数调用，并处理并发。
     * 3. Node 有多个内置的事件，我们可以通过引入 events 模块，并通过实例化 EventEmitter 类来绑定和监听事件。
     */

    // 引入 events 模块
    let events = require("events");
    // 实例化事件对象
    let EventEmitter = new events.EventEmitter();

    getExt = () => {
    fs.readFile('08_ext.json', (err, data) => {
        // 将 data 广播出去
        EventEmitter.emit('data', data.toString());
    })  
    };

    getExt();

    // 监听 data
    EventEmitter.on('data', (ext) => {
        console.log(ext);
    });
```
- EventEmitter.on 通过监听 data 的形式，获取了 getExt 内部的执行结果

了解了 Node 的 I/O 事件及 events 模块
