var config = require('../../config');
var temp = require('../templates/template');
var logger = require('../utils/logger');
var mandrill = require('node-mandrill')(config.mandrill.token);
var t = require('../translations').t;

function sendMandrill(to, template, vars, callback) {

	temp.jade(template, vars, function (err, content) {

		mandrill('/messages/send', {
			message: {
				auto_html: null,
				to: to,
				preserve_recipients: false,
				from_email: config.mandrill.from.email,
				from_name: t('common.from.name'),
				subject: t('templates.welcome-email.subject'),
				// from_email: "notifier@democracyos.org",
				// from_name: "DemocracyOS Notifier",
				// subject: "Testing the notifier!",
				text: content,
				html: content,
				auto_text: true
			}

			// mandrill('/messages/send-template', {
			// 	template_name: template,
			// 	template_content: [],
			// 	message: {
			// 		auto_html: null,
			// 		to: to,
			// 		global_merge_vars: vars,
			// 		preserve_recipients: false
			// 	}
		}, function (err) {
			callback && callback(err);
		});

	});
}

function formatUrl(collection) {
	var id = collection._id;
	var user = collection.userData;

	return 'https://app.likeastore.com/u/' + user.name + '/' + id;
}

var executors = {
	'send-welcome': function (action, callback) {
		var vars = [
			// {name: 'USERID', content: action.data.user._id}
			{name: 'USER_NAME', content: action.data.user.name}
		];

			sendMandrill([{email: action.data.email}], 'welcome-email', vars,  function (err) {
			callback(err, action);
		});
	},

	'send-personal': function (action, callback) {
		var user = action.data.user;

		var vars = [
			{ name: 'USER_NAME', content: user.displayName || user.name },
			{ name: 'USER_EMAIL', content: user.email },
		];

		sendMandrill([{email: action.data.email}], 'personal-email', vars,  function (err) {
			callback(err, action);
		});
	},

	'send-notify-followers-collection-created': function (action, callback) {
		var emails = action.data.email.map(function (e) {
			return {email: e};
		});

		var user = action.data.user;
		var collection = action.data.collection;

		var vars = [
			{ name: 'USER_NAME', content: user.name },
			{ name: 'USER_AVATAR', content: user.avatar },
			{ name: 'COLLECTION_URL', content: formatUrl(collection) },
			{ name: 'COLLECTION_TITLE', content: collection.title },
			{ name: 'COLLECTION_THUMBNAIL', content: collection.thumbnail },
			{ name: 'COLLECTION_DESCRIPTION', content: collection.description }
		];

		sendMandrill(emails, 'notify-followers-collection-created', vars, callback);
	},

	'send-notify-owner-collection-followed': function (action, callback) {
		var follower = action.data.follower;
		var collection = action.data.collection;

		var vars = [
			{ name: 'USERID', content: action.data.user._id },
			{ name: 'USER_NAME', content: follower.name },
			{ name: 'USER_AVATAR', content: follower.avatar },
			{ name: 'COLLECTION_URL', content: formatUrl(collection) },
			{ name: 'COLLECTION_TITLE', content: collection.title },
			{ name: 'COLLECTION_THUMBNAIL', content: collection.thumbnail }
		];

		sendMandrill([{email: action.data.email}], 'notify-owner-collection-followed', vars, function (err) {
			callback(err, action);
		});
	},

	'send-notify-followers-new-item-added': function (action, callback) {
		var emails = action.data.email.map(function (e) {
			return {email: e};
		});

		var item = action.data.item;
		var collection = action.data.collection;

		var vars = [
			{ name: 'USER_NAME', content: collection.userData.displayName || collection.userData.name },
			{ name: 'ITEM_TITLE', content: item.title || item.authorName },
			{ name: 'ITEM_THUMBNAIL', content: item.thumbnail },
			{ name: 'ITEM_DESCRIPTION', content: item.description },
			{ name: 'ITEM_OWNER_USER_NAME', content: item.userData.displayName || item.userData.name },
			{ name: 'ITEM_COLLECTION_URL', content: formatUrl(collection) },
			{ name: 'ITEM_TYPE', content: item.type }
		];

		sendMandrill(emails, 'notify-followers-new-item-added', vars, callback);
	},

	'send-notify-developers': function (action, callback) {
		var user = action.data.user;
		var message = action.message;

		var vars = [
			{ name: 'USER_NAME', content: user.name },
			{ name: 'USER_DISPLAY_NAME', content: user.displayName || 'NONE' },
			{ name: 'USER_EMAIL', content: user.email },
			{ name: 'MESSAGE', content: message}
		];

		sendMandrill([{email: action.data.email}], 'notify-developers-user-feedback', vars, function (err) {
			callback(err, action);
		});
	}
};

module.exports = executors;