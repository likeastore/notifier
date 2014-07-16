var _ = require('underscore');
var moment = require('moment');
var postal = require('postal');

var config = require('../config');
var db = require('./db')(config);

var bus = postal.channel('events-channel');

var actions = {
	create: function (id, data, callback) {
		var action = _.extend({id: id, created: moment().utc().toDate(), state: 'created' }, data);

		db.actions.save(action, function (err, action) {
			callback && callback(err, action);
		});
	}
};

function subscribe(eventName, fn) {
	if (!fn) {
		throw new Error('missing action hander');
	}

	bus.subscribe(eventName, function (e) {
		fn.call(e, actions);
	});
}

module.exports = {
	action: subscribe,

	// expose actions to use it in tests
	_actions: actions
};