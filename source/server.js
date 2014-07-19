var express = require('express');
var postal = require('postal');

var config = require('../config');
var package = require('../package');
var logger = require('./utils/logger');

var app = express(), instance;
var bus = postal.channel('event:receive');

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
	var e = req.body;
	bus.publish(e.event, {event: e});

	res.send(201);
});

var server = {
	listen: function (port, callback) {
		instance = app.listen(port, function (err) {
			logger.info('notifier server started, env: ' + process.env.NODE_ENV + ' port: ' + port);
			callback && callback(err);
		});
	},

	close: function (callback) {
		if (!instance) {
			throw new Error('server not started, forgot to call .listen()?');
		}

		instance.close(function (err) {
			logger.info('notifier server shutdown');
			callback && callback(err);
		});
	}
};

module.exports = {
	_server: server
};