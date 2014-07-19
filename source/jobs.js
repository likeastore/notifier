var async = require('async');
var postal = require('postal');

var config = require('../config');
var db = require('./db')(config);

var channels = {
	'resolve': postal.channel('action:resolve'),
	'execute': postal.channel('action:execute')
};

var handler = function (state, channel, callback) {
	db.actions.find({state: state}, function (err, actions) {
		if (err) {
			return callback(err);
		}

		async.each(actions, function (action, callback) {
			channels[channel].publish(action.id, {action: action, callback: callback});
		}, callback);
	});
};

var jobs = {
	resolve: function (callback) {
		handler('created', 'resolve', callback);
	},

	execute: function (callback) {
		handler('resolved', 'execute', callback);
	},

	start: function (callback) {

	}
};

module.exports = {
	_jobs: jobs
};