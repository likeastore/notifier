var moment = require('moment');
var config = require('../../config');
var db = require('../db')(config);
var logger = require('../utils/logger');

var initial = 'created';

function sendWelcomeEmail(e, callback) {
	db.actions.save({
		id: 'send-welcome',
		user: e.user,
		validateUrl: e.validateUrl,
		state: initial,
	}, function (err) {
		logger.info({message: 'created send-welcome action'});
		callback && callback(err);
	});
}

// Add custom actions here

module.exports = {
	sendWelcomeEmail: sendWelcomeEmail
};