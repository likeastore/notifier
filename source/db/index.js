var mongo = require('mongojs');
var logger = require('../utils/logger');

module.exports = function (config, connection) {
  if (config.db) config = config.db;

	connection = connection || 'connection';

	var db = mongo.connect(config[connection], ['actions']);

	if (!db) {
		throw new Error('could not connect to ' + config.connection);
	}

  // expose default collections as aliases in db
  for (var key in config.aliases) {
    db[key] = db[config.aliases[key]];
  }

	return db;
};
