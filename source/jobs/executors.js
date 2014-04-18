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

function formatUrl(collection) {
	var id = collection._id;
	var user = collection.userData;

	return 'https://app.likeastore.com/u/' + user.name + '/' + id;
}

var executors = {
	'send-welcome': function (action, callback) {
		sendMandrill([{email: action.data.email}], 'welcome-email', null,  callback);
	},

	'send-notify-followers-collection-created': function (action, callback) {
		callback(null);
	},

	'send-notify-owner-collection-followed': function (action, callback) {
		var emails = action.data.email.map(function (e) {
			return {email: e};
		});

		var item = action.data.item;
		var collection = action.data.collection;

		var vars = [
			{name: 'ITEM_TITLE', content: item.title || item.authorName },
			{name: 'ITEM_THUMBNAIL', content: item.thumbnail },
			{name: 'ITEM_DESCRIPTION', content: item.description },
			{name: 'ITEM_OWNER_USER_NAME', content: item.userData.displayName || item.userData.name },
			{name: 'USER_NAME', content: collection.userData.displayName || collection.userData.name },
			{name: 'ITEM_COLLECTION_URL', content: formatUrl(collection._id) },
			{name: 'ITEM_TYPE', content: item.type }
		];

		sendMandrill(emails, 'notify-owner-collection-followed', vars, callback);
	},

	'send-notify-followers-new-item-added': function (action, callback) {
		callback(null);
	}
};

module.exports = executors;