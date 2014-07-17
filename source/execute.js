var moment = require('moment');
var postal = require('postal');

var config = require('../config');
var db = require('./db')(config);

var logger = require('./utils/logger');

var bus = postal.channel('action:execute');

var executor = {
	transport: {
		mandrill: {}
	},

	success: function (action, callback) {
		db.actions.findAndModify({
			query: {_id: action._id},
			update: { $set: {state: 'executed', executed: moment().toUtc().toDate() }},
			'new': true
		}, function (err, action) {
			logger.info('error action ' + action.id);
			callback && callback(err, action);
		});
	},

	error: function (action, err, callback) {
		db.actions.findAndModify({
			query: {_id: action._id},
			update: { $set: {state: 'error', reason: err.toString() }},
			'new': true
		}, function (err, action) {
			logger.info('error action ' + action.id);
			callback && callback(err, action);
		});
	}
};

function execute(actionName, fn) {
	if (!fn) {
		throw new Error('missing execute handler');
	}

	bus.subscribe(actionName, function (a) {
		logger.info('action execute triggired ' + a.id);
		fn(a, executor, function (err) {
			if (err) {
				logger.error('action execute failed' + (err.stack || err));
				return executor.error(a, err);
			}

			logger.info('action executed successfully' + a.id);
			executor.success(a);
		});
	});
}

module.exports = {
	execute: execute,
	// expose to use it in tests
	_execute: executor
};