var async = require('async');

module.exports = {
	start: function (port, callback) {
		var notifier = this;

		async.parallel([
			startHttpServer,
			startAgendaServer
		], callback);

		function startHttpServer(callback) {
			notifier._server.listen(port, callback);
		}

		function startAgendaServer(callback) {
			notifier._jobs.start(callback);
		}
	}
};