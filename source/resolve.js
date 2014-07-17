var moment = require('moment');
var postal = require('postal');

var config = require('../config');
var db = require('./db')(config);

var logger = require('./utils/logger');

var bus = postal.channel('action:resolve');

var resolver = {
	resolve: function (action, data, callback) {
		db.actions.findAndModify({
			query: {_id: action._id},
			update: { $set: {data: data, state: 'resolved', resolved: moment().utc().toDate() }},
			'new': true
		}, function (err, action) {
			logger.info('resolved action ' + action.id);
			callback && callback(err, action);
		});
	},

	skip: function (action, callback) {
		db.actions.findAndModify({
			query: {_id: action._id},
			update: { $set: {state: 'skipped', resolved: moment().utc().toDate() }},
			'new': true
		}, function (err, action) {
			logger.info('skipped action ' + action.id);
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

function resolve(actionName, fn) {
	if (!fn) {
		throw new Error('missing resolve hander');
	}

	bus.subscribe(actionName, function (a) {
		logger.info('action resolve triggired ' + a.id);
		fn(a, resolver, function (err) {
			if (err) {
				logger.error('action resolver failed' + (err.stack || err));
				resolver.error(a, err);
			}
		});
	});
}

module.exports = {
	resolve: resolve,
	// expose to use it in tests
	_resolve: resolver
};