var async = require('async');
var postal = require('postal');

var config = require('../config');
var db = require('./db')(config);

var resolve = postal.channel('action:resolve');
var execute = postal.channel('action:execute');

var jobs = {
	resolve: function (callback) {
		db.actions.find({state: 'created'}, function (err, actions) {
			if (err) {
				return callback(err);
			}

			async.each(actions, function (action, callback) {
				resolve.publish(action.id, {action: action, callback: callback});
			}, callback);
		});
	},

	execute: function (callback) {
		db.actions.find({state: 'resolved'}, function (err, actions) {
			if (err) {
				return callback(err);
			}

			async.each(actions, function (action, callback) {
				execute.publish(action.id, {action: action, callback: callback});
			}, callback);
		});
	}
};

module.exports = {
	_jobs: jobs
};