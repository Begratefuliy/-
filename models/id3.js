var mongoose = require('mongoose');

//配置连接
// var options = {
//     db_user: 'myAdminUser', //添加的普通账户名
//     dp_pwd: 'myAdminpass',
//     db_host: '127.0.0.1',
//     db_port: 27017,
//     db_name: 'Data_Mining', //数据库名称
//     useNewUrlParser: true
// }
// var dbURL = 'mongodb://' + options.db_user + ':' + options.dp_pwd + '@' + options.db_host + ':' + options.db_port + '/' + options.db_name;

//连接数据库
mongoose.connect('mongodb://localhost/test');

//得到数据库连接句柄
let dbHandle = mongoose.connection;

//通过数据库连接句柄，监听mongoose数据库成功的事件

dbHandle.on('open', function(err) {
    if(err) {
        console.log('数据库连接失败');
        //throw err;
    }
    console.log('数据库连接成功');
}) 

let Schema = mongoose.Schema;

let Data_Mining = new Schema({
     countUniqueValues: {
         type: Object,
         required: true
     },
     entropy: {
         type: Object,
         required: true
     },
     mostFrequentValue: {
         type: Object,
         required: true
     },
     split: {
         type: Object,
        required: true     
    }
})

module.exports = mongoose.model('DataMining', Data_Mining)