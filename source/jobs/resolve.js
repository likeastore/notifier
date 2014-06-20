var async = require('async');
var config = require('../../config');
var db = require('../db')(config);
var logger = require('../utils/logger');

var resolvers = require('./resolvers');

function resolve(callback) {
	db.actions.find({state: 'created'}, function (err, actions) {
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

		resolver(action, ready);

		function ready(err, updated, data, ignore) {
			action = updated || action;

			if (err) {
				logger.error({message: 'error of execution', action: action, err: err});
			}

			var state = err ? 'error' : ignore ? 'ignore' : 'ready';

			db.actions.findAndModify({
				query: {_id: action._id},
				update: { $set: {data: data, state: state, resolvedAt: new Date() }}
			}, callback);
		}
	}
}

module.exports = resolve;