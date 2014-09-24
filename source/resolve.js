var moment = require('moment');
var postal = require('postal');

var config = require('../config');
var db = require('./db')(config.db);
var logger = require('./utils/logger');

var bus = postal.channel('action:resolve');
var subscribers = [];

var hander = function(action, set, message, callback) {
	db.actions.findAndModify({
		query: {_id: action._id},
		update: {$set: set},
		'new': true
	}, function (err, action) {
		logger.info(message + ' ' + action.id);
		callback && callback(err, action);
	});
};

var resolver = {
	resolved: function (action, data, callback) {
		hander(action, {data: data, state: 'resolved', resolved: moment().utc().toDate()}, 'resolved action', callback);
	},

	skipped: function (action, callback) {
		hander(action, {state: 'skipped', resolved: moment().utc().toDate()}, 'skipped action', callback);
	},

	error: function (action, err, callback) {
		hander(action, {state: 'error', reason: err}, 'error action', callback);
	}
};

function resolve(actionName, fn) {
	if (!fn) {
		throw new Error('missing resolve hander');
	}

	var subscriber = bus.subscribe(actionName, function (data) {
		var action = data.action;
		var callback = data.callback;

		logger.info('action resolve triggired ' + action.id);

		fn(action, resolver, function (err) {
			if (err) {
				logger.error('action resolve failed ' + action.id + ' (' + action._id + ') ' + JSON.stringify(err));
				return resolver.error(action, err, callback);
			}

			logger.info('action resolved successfully ' + action.id);
			callback(null);
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
	resolve: resolve,
	// private, expose to use it in tests
	_resolveBus: bus,
	_resolveUnsubscribe: unsubscribe
};