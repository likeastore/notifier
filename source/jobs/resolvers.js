var _ = require('underscore');
var config = require('../../config');
var db = require('../db')(config);

var ObjectId = require('mongojs').ObjectId;

var userPick = ['_id', 'avatar', 'email', 'name', 'displayName'];
var collectionPick = ['_id', 'color', 'description', 'public', 'title', 'user'];

var resolvers = {
	'send-welcome': function (action, callback) {
		db.users.findOne({email: action.user}, function (err, user) {
			if (err) {
				return callback(err);
			}

			if (!user) {
				return callback({message: 'user not found', email: action.email});
			}

			callback(null, action, {email: action.user, user: user});
		});
	},

	'send-personal': function (action, callback) {
		db.users.findOne({email: action.user}, function (err, user) {
			if (err) {
				return callback(err);
			}

			if (!user) {
				return callback({message: 'user not found', email: action.email});
			}

			callback(null, action, {email: action.user, user: user});
		});
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
					return callback({message: 'user not found', email: action.user});
				}

				var followers = user.followed || [];
				var emails = followers.map(function (u) {
					return u.email;
				});

				var data = {
					email: emails,
					user: _.pick(user, userPick),
					collection: _.pick(collection, collectionPick)
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

			db.users.findOne({_id: new ObjectId(action.follower)}, function (err, follower) {
				if (err) {
					return callback(err);
				}

				if (!follower) {
					return callback({message: 'user not found', email: action.follower});
				}

				var data = {
					email: collection.userData.email,
					user: _.pick(collection.userData, userPick),
					follower: follower,
					collection: _.pick(collection, collectionPick)
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

			var followers = collection.followers || [];
			var emails = followers.map(function (f) {
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
	},

	'send-notify-developers': function (action, callback) {
		db.users.findOne({email: action.user}, function (err, user) {
			if (err) {
				return callback(err);
			}

			if (!user) {
				return callback({message: 'user not found', email: action.email});
			}

			var data = {
				email: 'devs@likeastore.com',
				user: _.pick(user, userPick)
			};

			callback(null, action, data);
		});
	}
};

module.exports = resolvers;