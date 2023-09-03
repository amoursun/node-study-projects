/**
 * 插入数据
 */
const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://localhost:27017/runoob'; // # 数据库为 runoob
 
const insertData = function(db, callback) {  
    //连接到表 site
    const collection = db.collection('site');
    //插入数据
    const data = [
        {"name":"阿里云","url":"edu.aliyun.com"},
        {"name":"阿里云大学","url":"edu.aliyun.com"}
    ];
    collection.insert(data, function(err, result) { 
        if (err) {
            console.log('Error:'+ err);
            return;
        }     
        callback(result);
    });
}
 
MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("连接成功！");
    insertData(db, function(result) {
        console.log(result);
        db.close();
    });
});