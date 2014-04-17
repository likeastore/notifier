var mongo = require('mongojs');

module.exports = function (config, connection) {
	connection = connection || 'connection';
	var db = mongo.connect(config[connection], ['events', 'actions', 'states', 'collections', 'users', 'items']);
	if (!db) {
		throw new Error('could not connect to ' + config.connection);
	}

	return db;
};
