var mandrill = require('node-mandrill');
var config = require('../config');

var setupMandrill = function () {
	if (!config.transport.mandrill || !config.transport.mandrill.token) {
		throw new Error('missing mandrill token, please update config.transport.mandrill section');
	}

	return mandrill(config.transport.mandrill.token);
};

var setupTwillio = function () {
	// TODO: add twillio
};

var transport = {
	mandrill: setupMandrill(),
	twillio: setupTwillio()
};

module.exports = transport;