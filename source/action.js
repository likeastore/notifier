var _ = require('underscore');
var moment = require('moment');
var postal = require('postal');

var config = require('../config');
var db = require('./db')(config);

var logger = require('./utils/logger');

var bus = postal.channel('event:receive');

var actions = {
	create: function (id, data, callback) {
		var action = _.extend({id: id, created: moment().utc().toDate(), state: 'created' }, data);

		db.actions.save(action, function (err, action) {
			if (err) {
				logger.error('failed to save action');
			}

			logger.info('created action ' + id);
			callback && callback(err, action);
		});
	}
};

function subscribe(eventName, fn) {
	if (!fn) {
		throw new Error('missing event hander');
	}

	bus.subscribe(eventName, function (e) {
		logger.info('event triggired ' + e.id);
		fn(e, actions, function (err) {
			err && logger.error('event hander failed' + (err.stack || err));
		});
	});
}

module.exports = {
	action: subscribe,
	// expose to use it in tests
	_actions: actions
};