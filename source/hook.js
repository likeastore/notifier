var request = require('request');
var config = require('../config');
var logger = require('./utils/logger');

function sendHook(event, data) {
	if (!validConfig()) {
		throw new Error("missing either 'hook.url' or 'hook.token', please update config.hook section");
	}

	var hookType = event.split('.');
	var body = {
		clientId: data.clientId,
		message: data.message,
		status: data.status
	};

	request.post(getUrl() + config.hook.token, body, function (err, result, json) {
		if(err) {
			logger.error(err.toString());
		} else {
			logger.success('[resthook] to: ' + getUrl());
		}
	});

	function getUrl() {
		return config.hook.url + hookType[1] + '?access_token=' + config.hook.token;
	}

	function validConfig() {
		return config.hook.url && config.hook.token;
	}
}

module.exports = {
	sendHook: sendHook
};