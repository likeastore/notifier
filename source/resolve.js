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
	}
};

function resolve(actionName, fn) {
	if (!fn) {
		throw new Error('missing resolve hander');
	}

	bus.subscribe(actionName, function (e) {
		logger.info('action resolve triggired ' + actionName);
		fn(e, resolver);
	});
}

module.exports = {
	resolve: resolve,

	// expose to use it in tests
	_resolver: resolver
};