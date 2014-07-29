var mongo = require('mongojs');
var logger = require('../utils/logger');

module.exports = function (config, connection) {
  if (config.db) config = config.db;

	connection = connection || 'connection';

  //default collections
  var collections = ['events', 'actions', 'states', 'collections', 'users', 'items'];

  // add db aliases to default collections
  for (var key in config.aliases) {
    var index = collections.indexOf(config.aliases[key]);

    if (!~index) collections.push(config.aliases[key]);
  }

  // connect to db
	var db = mongo.connect(config[connection], collections);
	if (!db) {
		throw new Error('could not connect to ' + config.connection);
	}

  // expose default collections as aliases in db
  for (var key in config.aliases) {
    db[key] = db[config.aliases[key]];
  }

	return db;
};
