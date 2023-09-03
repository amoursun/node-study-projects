const mysql = require('mysql');
const connection =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'node',
});

connection.connect();

connection.query('SELECT * FROM user', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
});

connection.end();
