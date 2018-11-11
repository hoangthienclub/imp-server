import polyfill from 'babel-polyfill';
import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';
import socket from './socket/socket';
import 'babel-polyfill'
require('dotenv').config()
var session = require('express-session');
var redisStore = require('connect-redis')(session);

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));
app.use(bodyParser.json({
	limit : config.bodyLimit
}));

app.use(session({
    secret: '$2a$06$JzlsL5Ld2P8rzxhYn.aDnuXVqqzAz9.P/H.KMDKIAD7rw0ePtvpAS',
    resave: false,
    saveUninitialized: true,
    store: new redisStore({ 
        host: 'redis-19868.c61.us-east-1-3.ec2.cloud.redislabs.com', 
        port: 19868,
        pass: "nsc2XGA7mWzJePBgjZ0BDX2gqYDUthCh",
        ttl :  260
    }) 
}));

// connect to db
initializeDb( db => {
	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});

	socket(app.server);
});

export default app;
