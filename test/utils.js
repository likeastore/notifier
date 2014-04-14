var accessToken = '1234';
var config = require('../config');
var db = require('../source/db')(config);

module.exports = {
	serviceUrl: function () {
		return 'http://localhost:3031/api/events?access_token=' + accessToken;
	},

	clearDb: function (callback) {
		db.dropDatabase(callback);
	},

	clearCollection: function(collection, callback) {
		db[collection].remove(callback);
	},

	getLastAction: function (callback) {
		db.actions.find({}).sort({_id: -1}).limit(1, function (err, actions) {
			callback(err, actions[0]);
		});
	}
};