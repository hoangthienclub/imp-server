// thiết lập 1 server
var path = require('path');
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('./config.json');
var redisStore = require('connect-redis')(session);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    next();
});

app.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }));
app.use(bodyParser.json({limit: '1mb'}));
app.use(
    session({
        secret: config.secret,
        key: "be-smartdir",
        proxy: "true",
        resave: false,
        saveUninitialized: false,
        store: new redisStore({ 
            host: 'redis-19868.c61.us-east-1-3.ec2.cloud.redislabs.com', 
            port: 19868,
            pass: "nsc2XGA7mWzJePBgjZ0BDX2gqYDUthCh",
            ttl :  260
        })
    })
);


// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));
app.use('/api/form', require('./controllers/api/form.controller'))
app.use('/gencode', require('./controllers/api/gencode.controller'));

// link lấy css, js
app.use('/public', express.static(__dirname + '/public/'));
app.use('/node_modules', express.static(__dirname + '/node_modules/'));
app.use('/bower_components', express.static(__dirname + '/bower_components/'));
app.use('/angular', express.static(__dirname + '/angular/'));


// make '/app' default route
app.get('/', function(req, res) {
    return res.redirect('/app');
});

var server = require('http').createServer(app);
// Khởi chạy server trên port được quy định trong config
server.listen(process.env.PORT || config.serverPort);
console.log("Starting server on: " + (process.env.PORT || config.serverPort));
startTime = new Date();
console.log("Initialize completed: " + startTime.toString());