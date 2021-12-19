var express = require('express')
var path = require('path')
var router = require('./data_mining/id3');
const bodyParser = require('body-parser');

var app = express()

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

app.get('/', function(req, res) {
    res.send('hello')
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(router);

app.listen(8080, function() {
    console.log('running...')
})