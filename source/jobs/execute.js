var async = require('async');
var config = require('../../config');
var db = require('../db')(config);

var executors = require('./executors');

function execute(callback) {
	db.actions.find({state: 'ready'}, function (err, actions) {
		if (err) {
			return callback(err);
		}

		async.map(actions, iterateAction, callback);
	});

	function iterateAction(action, callback) {
		var executor = executors[action.id];

		if (!executor) {
			return callback(null, action);
		}

		executor(action, function (err, action) {
			if (err) {
				return callback(err);
			}

			ready(action);
		});

		function ready(action) {
			db.actions.findAndModify({
				query: {_id: action._id},
				update: { $set: {state: 'executed'}}
			}, callback);
		}
	}
}

module.exports = execute;