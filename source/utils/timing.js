var moment = require('moment');
var started = {};

var timing = {
	start: function (name) {
		started[name] = moment();
	},

	finish: function (name) {
		var finished = moment();
		var duration = moment.duration(finished.diff(started[name]));

		return duration;
	}
};

module.exports = timing;