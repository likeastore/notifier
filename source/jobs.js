var Agenda = require('agenda');
var config = require('../config');
var logger = require('./utils/logger');
var timing = require('./utils/timing');

var agenda = new Agenda({db: {address: config.connection, collection: 'notifierJobs'} });

agenda.define('resolve actions', function (job, callback) {
	callback(null);
});

agenda.define('execute actions', function (job, callback) {
	callback(null);
});

agenda.schedule('every 3 minutes', 'resolve actions');
agenda.schedule('every 5 minutes', 'execute actions');

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