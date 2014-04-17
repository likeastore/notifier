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

	createTestUser: function (email, name, followers, callback) {
		db.users.save({
			email: email,
			name: name,
			followed: followers
		}, callback);
	},

	createTestCollection: function (user, title, description, followers, userData, callback) {
		db.collections.save({
			user: user,
			title: title,
			description: description,
			followers: followers,
			userData: userData
		}, callback);
	},

	createTestItem: function (user, callback) {
		db.items.save({
			user: user
		}, callback);
	},

	getLastAction: function (callback) {
		db.actions.find({}).sort({_id: -1}).limit(1, function (err, actions) {
			callback(err, actions[0]);
		});
	}
};