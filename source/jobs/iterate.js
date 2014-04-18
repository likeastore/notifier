var async = require('async');
var config = require('../../config');
var db = require('../db')(config);

function iterate(fromState, toState, resolvers, callback) {
	db.actions.find({state: fromState}, function (err, actions) {
		if (err) {
			return callback(err);
		}

		async.map(actions, iterateAction, callback);
	});

	function iterateAction(action, callback) {
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
				update: { $set: {data: data, state: toState}}
			}, callback);
		}
	}
}

module.exports = iterate;