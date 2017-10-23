require('colors');

var util = require('util');
var moment = require('moment');
var winston = require('winston');
var logentries = require('node-logentries');
var config = require('../../config');
var stub = require('./stub');

// configure logentries
var log = logentries.logger({
	token: config.logging.logentries.token,
	printerror: false
});
log.level(config.logging.loglevel);

// configure winston logging format
const tsFormat = () => (new Date()).toLocaleTimeString();
const winstonLogger = new (winston.Logger)({
	level: config.logging.loglevel,
  	colorize: true,
	timestamp: tsFormat	
});

var logger = {
	success: function (message) {
		message = typeof message === 'string' ? message : JSON.stringify(message);
		winstonLogger.info(util.format('SUCCESS: %s', message));
		log.log('info', message);
	},

	warning: function (message) {
		message = typeof message === 'string' ? message : JSON.stringify(message);
		winstonLogger.warn(util.format('WARNING: %s', message));
		log.log('warning', message);
	},

	error: function (message) {
		message = typeof message === 'string' ? message : JSON.stringify(message);
		winstonLogger.error(util.format('ERROR: %s', message));
		log.log('err', message);
	},

	info: function (message) {
		message = typeof message === 'string' ? message : JSON.stringify(message);
		winstonLogger.info(message);
		log.log('info', message);
	},

	connector: function (name) {
		var me = this;

		return {
			info: function (message) {
				me.info('connector ' + name + ': ' + message);
			},
			warning: function (message) {
				me.warning('connector ' + name + ': ' + message);
			},
			error: function (message) {
				me.error('connector ' + name + ': ' + message);
			},
			success: function (message) {
				me.success('connector ' + name + ': ' + message);
			}
		};
	},

	timestamptMessage: function (message) {
		return util.format('[%s] %s', moment(), message);
	}
};

module.exports = module.exports = (function () {
	var env = process.env.NODE_ENV || 'development';
	if (env === 'test') {
		return stub(logger);
	}

	return logger;
})();