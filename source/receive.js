var _ = require('underscore');
var moment = require('moment');
var postal = require('postal');

var config = require('../config');
var db = require('./db')(config.db);

var logger = require('./utils/logger');

var bus = postal.channel('event:receive');
var subscribers = [];

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

function receive(eventName, fn) {
	if (!fn) {
		throw new Error('missing event hander');
	}

	var subscriber = bus.subscribe(eventName, function (data) {
		var e = data.event;
		var callback = data.callback;

		logger.info('event triggired ' + eventName);
		fn(e, actions, function (err) {
			err && logger.error('event hander failed ' + (err.stack || err));
			callback && callback(err);
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
	receive: receive,

	// private, expose to use it in tests
	_receive: bus,
	_receiveUnsubscribe: unsubscribe
};