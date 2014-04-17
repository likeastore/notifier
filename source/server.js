var express = require('express');
var config = require('../config');
var postal = require('postal');

var app = express();
var bus = postal.channel();

require('./triggers')(bus);

var cors = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-Access-Token, X-Revision, Content-Type');

	next();
};

app.configure(function(){
	app.set('port', process.env.PORT || 3031);
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

app.post('/api/events', checkAccessToken, validateEvent, function (req, res) {
	var e = req.body;
	bus.publish(e.event, e);

	res.send(201);
});

app.listen(app.get('port'), function () {
	console.log('notify server started, port: ' + app.get('port') + ' env: ' + (process.env.NODE_ENV || 'development'));
});