var async = require('async');
var postal = require('postal');

var config = require('../config');
var db = require('./db')(config);

var resolveBus = postal.channel('action:resolve');

var jobs = {
	resolve: function (callback) {
		db.actions.find({state: 'created'}, function (err, actions) {
			if (err) {
				return callback(err);
			}

			actions.forEach(function (action) {
				resolveBus.publish(action.id, action);
			});

			callback(null);
		});

	},

	execute: function (callback) {
		callback(null);
	}
};

module.exports = {
	_jobs: jobs
};