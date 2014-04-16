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

			var data = {
				title: collection.title,
				description: collection.description,
				url: config.app + '/collections/' + collection._id
			};

			callback(null, action, data);
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
			// set action to ready state
			callback(null, action);
		}
	}
}

module.exports = resolve;