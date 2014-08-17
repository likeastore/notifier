var mandrill = require('node-mandrill');
var twilio = require('twilio');
var gcm = require('node-gcm');
var config = require('../config');

var setupMandrill = function () {
	if (!validConfig()) {
		throw new Error('missing mandrill token, please update config.transport.mandrill section');
	}

	return mandrill(config.transport.mandrill.token);

	function validConfig() {
		return config.transport.mandrill && config.transport.mandrill.token;
	}
};

var setupTwilio = function () {
	if (!validConfig()) {
		throw new Error('missing twilio account SID or auth Token, please update config.transport.twilio section');
	}

	return twilio(config.transport.twilio.accountSid, config.transport.twilio.authToken);

	function validConfig() {
		return config.transport.twilio && (config.transport.twilio.accountSid && config.transport.twilio.authToken);
	}
};

var setupAndroidPushNotification = function () {
	if(!validConfig()) {
		throw new Error('missing server api key, please update config.transport.gcm.serverApiKey section');
	}

	return {
		push: new gcm.Sender(config.transport.gcm.serverApiKey),
		message: new gcm.Message()
	};

	function validConfig() {
		return config.transport.gcm && config.transport.gcm.serverApiKey;
	}
};

var transport = {
	mandrill: setupMandrill(),
	twilio: setupTwilio(),
	android: setupAndroidPushNotification()
};

module.exports = transport;