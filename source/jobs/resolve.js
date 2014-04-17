var async = require('async');
var config = require('../../config');
var db = require('../db')(config);
var resolvers = require('./resolvers');

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