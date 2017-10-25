var config = require('../config');
var accessToken = config.accessToken;
var db = require('../source/db')(config);

module.exports = {
	accessToken: function () {
		return accessToken;
	},

	port: function () {
		return 3031;
	},

	serviceUrl: function () {
		return 'http://localhost:3031';
	},

	serviceEventsUrl: function () {
		return 'http://localhost:3031/api/events';
	},

	serviceEventsAuthUrl: function () {
		return 'http://localhost:3031/api/events?access_token=' + accessToken;
	},

	clearDb: function (callback) {
		db.dropDatabase(callback);
	},

	clearCollection: function(collection, callback) {
		db[collection].remove(callback);
	},

	createAction: function (data, callback) {
		db.actions.save(data, callback);
	},

	getLastAction: function (callback) {
		db.actions.find({}).sort({_id: -1}).limit(1, function (err, actions) {
			callback(err, actions[0]);
		});
	},

	getLastActions: function (callback) {
		db.actions.find({}).sort({_id: -1}, callback);
	}
};