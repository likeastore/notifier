var async = require('async');
var config = require('../../config');
var db = require('../db')(config);
var logger = require('../utils/logger');

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

		executor(action, ready);

		function ready(err, action) {
			if (err) {
				logger.error({message: 'error of execution', action: action, err: err});
			}

			var state = err ? 'error' : 'executed';

			db.actions.findAndModify({
				query: {_id: action._id},
				update: { $set: {state: state}}
			}, callback);
		}
	}
}

module.exports = execute;