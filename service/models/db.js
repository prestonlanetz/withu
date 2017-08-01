//connect database and outPut the connection...
var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/withu')
db.once('open',(err) => {
        console.log('数据库连接成功');
});

module.exports = db;