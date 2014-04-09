var accessToken = '';
var config = require('../config');
var db = require('../source/db')(config);

module.exports = {
	serviceUrl: function () {
		return 'http://localhost:3031/api/events?access_token=' + accessToken;
	},

	clearDb: function (callback) {
		db.dropDatabase(callback);
	},

	getLastAction: function (callback) {
		callback(null, {});
	}
};