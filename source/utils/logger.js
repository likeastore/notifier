require('colors');

var util = require('util');
var moment = require('moment');
var logentries = require('node-logentries');
var config = require('../../config');
var stub = require('./stub');

var log = logentries.logger({
	token: config.logentries.token,
	printerror: false
});

log.level('debug');

var logger = {
	success: function (message) {
		message = typeof message === 'string' ? message : JSON.stringify(message);
		console.log(this.timestamptMessage(util.format('SUCCESS: %s', message)).green);
		log.log('info', message);
	},

	warning: function (message) {
		message = typeof message === 'string' ? message : JSON.stringify(message);
		console.log(this.timestamptMessage(util.format('WARNING: %s', message)).yellow);
		log.log('warning', message);
	},

	error: function (message) {
		message = typeof message === 'string' ? message : JSON.stringify(message);
		console.log(this.timestamptMessage(util.format('ERROR: %s', message)).red);
		log.log('err', message);
	},

	fatal: function (message) {
		message = typeof message === 'string' ? message : JSON.stringify(message);
		console.log(this.timestamptMessage(util.format('ERROR: %s', message)).red);
		log.log('emerg', message);
	},

	info: function (message) {
		message = typeof message === 'string' ? message : JSON.stringify(message);
		console.log(this.timestamptMessage(message));
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