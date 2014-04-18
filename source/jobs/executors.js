var config = require('../../config');
var logger = require('../utils/logger');
var mandrill = require('node-mandrill')(config.mandrill.token);

function sendMandrill(to, template, vars, callback) {
	mandrill('/messages/send-template', {
		template_name: template,
		template_content: [],
		message: {
			auto_html: null,
			to: to,
			global_merge_vars: vars,
			preserve_recipients: false
		}
	}, function (err) {
		if (err) {
			logger.error({message: 'error during mandrill send', err: err});
		}

		callback && callback(err);
	});
}

var executors = {
	'send-welcome': function (action, callback) {
		sendMandrill([{email: action.data.email}], 'welcome-email', null,  callback);
	},

	'send-notify-followers-collection-created': function (action, callback) {
		callback(null);
	},

	'send-notify-owner-collection-followed': function (action, callback) {
		callback(null);
	},

	'send-notify-followers-new-item-added': function (action, callback) {
		callback(null);
	}
};

module.exports = executors;