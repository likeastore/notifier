var config = require('../config');
var db = require('./db')(config);

function state(e) {
	var query = {user: e.user, event: e.event};

	if (e.data.collection) {
		query.collection = e.data.collection;
	}

	function use(callback) {
		db.states.findOne(query, function (err, state) {
			if (err) {
				return callback(err);
			}

			createOrReturn(state);
		});

		function createOrReturn(state) {
			if (!state) {
				return db.states.save(query, callback);
			}

			callback(null, state);
		}
	}

	function clear(callback) {
		db.states.remove(query, callback);
	}

	function update(properties, callback) {
		db.states.findAndModify({query: query, update: {$set: { properties: properties }}, 'new': true}, callback);
	}

	return {
		use: use,
		update: update,
		clear: clear
	};
}

module.exports = state;