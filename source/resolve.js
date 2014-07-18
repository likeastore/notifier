var moment = require('moment');
var postal = require('postal');

var config = require('../config');
var db = require('./db')(config);

var logger = require('./utils/logger');

var bus = postal.channel('action:resolve');

var hander = function(action, set, message, callback) {
	db.actions.findAndModify({
		query: {_id: action._id},
		update: { $set: set},
		'new': true
	}, function (err, action) {
		logger.info(message + ' ' + action.id);
		callback && callback(err, action);
	});
};

var resolver = {
	resolve: function (action, data, callback) {
		hander(action, {data: data, state: 'resolved', resolved: moment().utc().toDate() }, 'resolved action', callback);
	},

	skip: function (action, callback) {
		hander(action, {state: 'skipped', resolved: moment().utc().toDate() }, 'skipped action', callback);
	},

	error: function (action, err, callback) {
		hander(action, {state: 'error', reason: err.toString()}, 'error action', callback);
	}
};

function resolve(actionName, fn) {
	if (!fn) {
		throw new Error('missing resolve hander');
	}

	bus.subscribe(actionName, function (data) {
		var action = data.action;
		var callback = data.callback;

		logger.info('action resolve triggired ' + action.id);

		fn(action, resolver, function (err) {
			if (err) {
				logger.error('action resolver failed' + (err.stack || err));
				return resolver.error(action, err, callback);
			}

			logger.info('action resolved successfully' + action.id);
			callback(null);
		});
	});
}

module.exports = {
	resolve: resolve,
	// expose to use it in tests
	_resolve: resolver
};