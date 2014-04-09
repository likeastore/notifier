var express = require('express');

var app = express();

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

app.listen(app.get('port'), function () {
	console.log('notify server started, port: ' + app.get('port') + ' env: ' + process.env.NODE_ENV || 'development');
});