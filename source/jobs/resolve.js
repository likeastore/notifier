var async = require('async');
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
		callback(null, action);
	},

	'send-notify-followers-new-items-added': function (action, callback) {
		callback(null, action);
	}
};

function resolve(callback) {
	db.actions.find({state: 'created'}, function (err, actions) {
		if (err) {
			return callback(err);
		}

		async.map(actions, resolveAction, callback);
	});

	function resolveAction(action, callback) {
		var resolver = resolvers[action.id];

		if (!resolver) {
			return callback(null, action);
		}

		resolver(action, function (err, action, data) {
			if (err) {
				return callback(err);
			}

			ready(action, data);
		});

		function ready(action, data) {
			db.actions.findAndModify({
				query: {_id: action._id},
				update: { $set: {data: data, state: 'ready'}}
			}, callback);
		}
	}
}

module.exports = resolve;