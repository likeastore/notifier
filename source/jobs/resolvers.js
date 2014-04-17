var config = require('../../config');
var db = require('../db')(config);

var ObjectId = require('mongojs').ObjectId;

var resolvers = {
	'send-welcome': function (action, callback) {
		callback(null, action, {email: action.user});
	},

	'send-notify-followers-collection-created': function (action, callback) {
		db.collections.findOne({_id: new ObjectId(action.collection)}, function (err, collection) {
			if (err) {
				return callback(err);
			}

			if (!collection) {
				return callback({message: 'collection not found', collection: action.collection});
			}

			db.users.findOne({email: action.user}, function (err, user) {
				if (err) {
					return callback(err);
				}

				if (!user) {
					return ({message: 'user not found', email: action.user});
				}

				var emails = user.followed.map(function (u) {
					return u.email;
				});

				var data = {
					email: emails,
					title: collection.title,
					description: collection.description,
					user: collection.userData.name,
					collection: collection._id.toString()
				};

				callback(null, action, data);
			});
		});
	},

	'send-notify-owner-collection-followed': function (action, callback) {
		db.collections.findOne({_id: new ObjectId(action.collection)}, function (err, collection) {
			if (err) {
				return callback(err);
			}

			if (!collection) {
				return callback({message: 'collection not found', collection: action.collection});
			}

			db.users.findOne({email: action.follower}, function (err, user) {
				if (err) {
					return callback(err);
				}

				if (!user) {
					return callback({message: 'user not found', email: action.user});
				}

				var data = {
					email: collection.userData.email,
					follower: user,
					collection: collection
				};

				callback(null, action, data);
			});
		});
	},

	'send-notify-followers-new-item-added': function (action, callback) {
		db.collections.findOne({_id: new ObjectId(action.collection)}, function (err, collection) {
			if (err) {
				return callback(err);
			}

			if (!collection) {
				return callback({message: 'collection not found', collection: action.collection});
			}

			var emails = collection.followers.map(function (f) {
				return f.email;
			});

			db.items.findOne({_id: new ObjectId(action.item)}, function (err, item) {
				if (err) {
					return callback(err);
				}

				var data = {
					email: emails,
					collection: collection,
					item: item
				};

				callback(null, action, data);
			});
		});
	}
};

module.exports = resolvers;