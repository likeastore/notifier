var moment = require('moment');
var postal = require('postal');

var config = require('../config');
var db = require('./db')(config.db);
var transport = require('./transport');

var logger = require('./utils/logger');

var bus = postal.channel('action:execute');
var subscribers = [];

var handler = function (action, set, message, callback) {
	db.actions.findAndModify({
		query: {_id: action._id},
		update: {$set: set},
		'new': true
	}, function (err, action) {
		logger.info(message + ' ' + action.id);
		callback && callback(err, action);
	});
};

var executor = {
	success: function (action, callback) {
		handler(action, {state: 'executed', executed: moment().utc().toDate()}, 'action executed', callback);
	},

	error: function (action, err, callback) {
		handler(action, {state: 'error', reason: err, executed: moment().utc().toDate()}, 'action error', callback);
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
			logger.error('execute called for non-resolved action' + action.id + ' (' + action._id + ')');
			return error(callback);
		}

		if (action.executeAfter && moment().diff(action.executeAfter) < 0) {
			logger.info('delayed execution of action since executeAfter' + action.id + ' (' + action._id + ')');
			return callback && callback(null);
		}

		fn(action, transport, function (err) {
			if (err) {
				logger.error('action execute failed ' + action.id + ' (' + action._id + ') ' + JSON.stringify(err));
				return executor.error(action, err, callback);
			}

			logger.info('action executed successfully ' + action.id);
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