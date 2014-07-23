var _ = require('underscore');
var mongo = require('mongojs');
var moment = require('moment');

var config = require('./config');
var notifier = require('./source/notifier');

var db = mongo.connect(config.connection, []);

var userPick = ['_id', 'avatar', 'email', 'name', 'displayName'];
var collectionPick = ['_id', 'color', 'description', 'public', 'title', 'user'];

// welcome email

notifier
	.receive('user-registered', function (e, actions, callback) {
		actions.create('send-welcome', {user: e.user}, callback);
	})
	.resolve('send-welcome', function (action, actions, callback) {
		db.users.findOne({email: action.user}, function (err, user) {
			if (err) {
				return callback(err);
			}

			if (!user) {
				return callback({message: 'user not found', email: action.email});
			}

			var data = {
				email: action.user,
				user: _.pick(user, userPick)
			};

			actions.resolved(action, data, callback);
		});
	})
	.execute('send-welcome', function (action, transport, callback) {
		var vars = [
			{name: 'USERID', content: action.data.user._id},
			{name: 'USER_NAME', content: action.data.user.displayName || action.data.user.name}
		];

		transport.mandrill('/messages/send-template', {
			template_name: 'welcome-email',
			template_content: [],
			message: {
				auto_html: null,
				to: [{email: action.data.email}],
				bcc: 'ceo@likeastore.com',
				global_merge_vars: vars,
				preserve_recipients: false
			}
		}, callback);
	});

// into email

notifier
	.receive('user-registered', function (e, actions, callback) {
		actions.create('send-personal', {user: e.user, executeAfter: moment().add(3, 'days').toDate()}, callback);
	})
	.resolve('send-personal', function (action, actions, callback) {
		db.users.findOne({email: action.user}, function (err, user) {
			if (err) {
				return callback(err);
			}

			if (!user) {
				return callback({message: 'user not found', email: action.email});
			}

			var data = {
				email: action.user,
				user: _.pick(user, userPick)
			};

			actions.resolved(action, data, callback);
		});
	})
	.execute('send-personal', function (action, transport, callback) {
		var user = action.data.user;

		var vars = [
			{ name: 'USER_NAME', content: user.displayName || user.name },
			{ name: 'USER_EMAIL', content: user.email },
		];

		transport.mandrill('/messages/send-template', {
			template_name: 'personal-email',
			template_content: [],
			message: {
				auto_html: null,
				to: [{email: action.data.email}],
				bcc: 'ceo@likeastore.com',
				global_merge_vars: vars,
				preserve_recipients: false
			}
		}, callback);
	});

// collection created email

// collection followed email

// user feedback (email to developers)

// sorry see you go email

