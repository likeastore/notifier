var mandrill = require('node-mandrill');
var twilio = require('twilio');
var gcm = require('node-gcm');
var apn = require('apn');
var logger = require('./utils/logger');
var config = require('../config');

var setupMandrill = function () {
	if (!validConfig()) {
		var errorMsg = 'missing mandrill token, please update config.transport.mandrill section';
		logger.error(errorMsg);
		throw new Error(errorMsg);
	}

	return mandrill(config.transport.mandrill.token);

	function validConfig() {
		return config.transport.mandrill && config.transport.mandrill.token;
	}
};

var setupTwilio = function () {
	if (!validConfig()) {
		var errorMsg = 'missing twilio account SID or auth Token, please update config.transport.twilio section';
		logger.error(errorMsg);
		throw new Error(errorMsg);
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
		push: push
	};

	function push(options, callback) {
		if(!validOptions()) {
			var errorMsg = "missing 'options' or required required fields, please make sure you have provided 'options'";
			logger.error(errorMsg);
			throw new Error(errorMsg);
		}

		var service = new gcm.Sender(config.transport.gcm.serverApiKey);
		var message = new gcm.Message({
			collapseKey: 'notifier',
			timeToLive: 3600 * 2,
			delayWhileIdle: false
		});

		message.addDataWithObject(options.message);


		service.send(message, options.regIds, options.retries, callback);

		function validOptions() {
			return options.message && options.regIds && options.retries;
		}
	}

	function validConfig() {
		return config.transport.gcm && config.transport.gcm.serverApiKey;
	}
};

var setupIOSPushNotification = function () {

	if(!validConfig()) {
		var errorMsg = "missing 'cert.pem' or 'key.pem', please update 'config.transport.apn section'";
		logger.error(errorMsg);
		throw new Error(errorMsg);
	}

	return {
		push: push
	};

	function validConfig() {
		return config.transport.apn && (config.transport.apn.cert && config.transport.apn.key);
	}

	function push(options, callback) {
		var service, note;
		var productionGateway = 'gateway.push.apple.com',
			developmentGateway = 'gateway.sandbox.push.apple.com';

		if(!validOptions()) {
			var errorMsg = "missing 'options' or required fields, please make sure you have that options are defined";
			logger.error(errorMsg);
			throw new Error(errorMsg);
		}

		initConnection();
		initNotification();

		service.pushNotification(note, options.tokens);

		function validOptions() {
			return options && options.alert && (options.tokens && options.tokens.length > 0);
		}

		function initConnection() {
			service = new apn.connection({
				production: options.production,
				gateway: options.production ? productionGateway : developmentGateway,
				port: options.port || 2195,
				enhanced: options.enhanced || true,
				cacheLength: options.cacheLength || 100,
				// errorCallback: callback,
				cert: config.transport.apn.cert,
				key: config.transport.apn.key,
				passphrase: options.passphrase
			});

			service.on('connected', function() {
				logger.info('APN Connected.');
			});

			service.on('transmitted', function(notification, device) {
				return callback(null, "Notification transmitted to:" + device.token.toString('hex'));
			});

			service.on('transmissionError', function(errCode, notification, device) {
				if(errCode === 8) {
					var errorMsg = 'A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox';
					logger.error(errorMsg);
					return callback(errorMsg);
				}

				return callback('Notification caused error: ' + errCode + ' for device ', device, notification);
			});

			service.on('timeout', function() {
				var errorMsg = 'APNS connection timeout';
				logger.warning(errorMsg);
				return callback(errorMsg);
			});

			service.on('socketError', function() {
				var errorMsg = 'APNS socket error';
				logger.error(errorMsg);
			});
		}

		function initNotification() {
			note = new apn.notification();
			note.sound = options.sound  || 'notification-beep.wav';
			note.alert = options.alert || { "body" : "Place your message here.", "action-loc-key" : "Play" , "launch-image" : "mysplash.png"};
			note.payload = options.payload || {'messageFrom': 'Notifier'};
			note.badge = options.badge;
		}
	}
};

var transport = {
	mandrill: setupMandrill(),
	twilio: setupTwilio(),
	android: setupAndroidPushNotification(),
	ios: setupIOSPushNotification()
};

module.exports = transport;