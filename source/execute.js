var moment = require('moment');
var postal = require('postal');

var config = require('../config');
var db = require('./db')(config);

var logger = require('./utils/logger');

var bus = postal.channel('action:execute');
var subscribers = [];

var executor = {
	transport: {
		mandrill: {}
	},

	success: function (action, callback) {
		db.actions.findAndModify({
			query: {_id: action._id},
			update: { $set: {state: 'executed', executed: moment().utc().toDate() }},
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

function error(callback) {
	var err = new Error('counld not execute non-resolved action');

	if (!callback) {
		throw err;
	}

	callback(err);
}

function execute(actionName, fn) {
	if (!fn) {
		throw new Error('missing execute handler');
	}

	var subscriber = bus.subscribe(actionName, function (data) {
		var action = data.action;
		var callback = data.callback;

		logger.info('action execute triggired ' + action.id);

		if (!action.state || action.state !== 'resolved') {
			return error(callback);
		}

		fn(action, executor, function (err) {
			if (err) {
				logger.error('action execute failed' + (err.stack || err));
				return executor.error(action, err, callback);
			}

			logger.info('action executed successfully' + action.id);
			executor.success(action, callback);
		});
	});

	subscribers.push(subscriber);

	return this;
}

function unsubscribe() {
	subscribers.forEach(function (subscriber) {
		subscriber.unsubscribe();
	});
}

module.exports = {
	execute: execute,
	// private, expose to use it in tests
	_executeBus: bus,
	_executeUnsubscribe: unsubscribe
};