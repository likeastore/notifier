var Agenda = require('agenda');
var config = require('../config');
var logger = require('./utils/logger');
var timing = require('./utils/timing');

var resolve = require('./jobs/resolve');
var execute = require('./jobs/execute');

var agenda = new Agenda({db: {address: config.connection, collection: 'notifierJobs'} });

agenda.define('resolve actions', function (job, callback) {
	resolve(callback);
});

agenda.define('execute actions', function (job, callback) {
	execute(callback);
});

agenda.purge(function () {
	agenda.every('30 seconds', 'resolve actions');
	agenda.every('1 minute', 'execute actions');
});

agenda.on('start', function (job) {
	timing.start(job.attrs.name);
	logger.info({message: 'job started', job: job.attrs.name });
});

agenda.on('success', function (job) {
	var duration = timing.finish(job.attrs.name);
	logger.success({message: 'job compeleted', job: job.attrs.name, duration: duration.asMilliseconds()});
});

agenda.on('fail', function (err, job) {
	logger.error({message: 'job failed', job: job.attrs.name, err: err});
});

agenda.start();