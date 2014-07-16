var express = require('express');
var config = require('../config');
var package = require('../package');
var logger = require('./utils/logger');

var app = express(), server;

var cors = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-Access-Token, X-Revision, Content-Type');

	next();
};

app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(cors);
	app.use(express.methodOverride());
	app.use(app.router);
});

function checkAccessToken(req, res, next) {
	var accessToken = req.query.access_token;

	if (!accessToken) {
		return res.send(401, {message: 'access_token is missing'});
	}

	if (accessToken !== config.accessToken) {
		return res.send(401, {message: 'access_token is wrong'});
	}

	next();
}

function validateEvent(req, res, next) {
	// TODO: Add validation code
	next();
}

app.get('/', function (req, res) {
	res.json({app: 'notifier', env: process.env.NODE_ENV, version: package.version, apiUrl: '/api'});
});

app.post('/api/events', checkAccessToken, validateEvent, function (req, res) {
	//var e = req.body;

	res.send(201);
});

function listen(port, callback) {
	server = app.listen(port, function () {
		logger.info('notifier server started, env: ' + process.env.NODE_ENV + ' port: ' + port);

		callback && callback(arguments);
	});
}

function close(callback) {
	if (!server) {
		throw new Error('server not started, forgot to call .listen()?');
	}

	server.close(function () {
		callback && callback(arguments);
	});
}

module.exports = {
	listen: listen,
	close: close
};