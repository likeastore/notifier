var util = require('util');
var async = require('async');
var postal = require('postal');
var Agenda = require('agenda');
var moment = require('moment');

var config = require('../config');
var db = require('./db')(config);

var logger = require('./utils/logger');
var timing = require('./utils/timing');

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

var startAgenda = function (callback) {
	var agenda = new Agenda({db: {address: config.connection, collection: config.jobs.collection} });

	agenda.purge(function () {
		agenda.define('resolve actions', function (job, callback) {
			handler('created', 'resolve', callback);
		});

		agenda.define('execute actions', function (job, callback) {
			handler('resolved', 'execute', callback);
		});

		agenda.every(util.format('%d seconds', config.jobs.run.resolve), 'resolve actions');
		agenda.every(util.format('%d seconds', config.jobs.run.execute), 'execute actions');

		agenda.on('start', function (job) {
			timing.start(job.attrs.name);
		});

		agenda.on('success', function (job) {
			var duration = timing.finish(job.attrs.name);
			logger.info({message: 'job compeleted', job: job.attrs.name, duration: duration.asMilliseconds()});
		});

		agenda.on('fail', function (err, job) {
			logger.error({message: 'job failed', job: job.attrs.name, err: err});
		});

		agenda.start();
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
		startAgenda(callback);
	}
};

module.exports = {
	_jobs: jobs
};