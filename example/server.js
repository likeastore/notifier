var notifier = require('../source/notifier');

notifier
	.receive('user-registered', function (e, actions, callback) {
		actions.create('send-welcome-email', {user: e.user}, callback);
	})
	.resolve('send-welcome-email', function (a, actions, callback) {
		asyncRequestForUser(actions.user, function (err, user) {
			if (err) {
				return callback(err);
			}

			actions.resolved(a, {email: user.email, name: user.name}, callback);
		});
	})
	.execute('send-welcome-email', function (a, transport, callback) {
		var user = a.data;

		var vars = [
			{ name: 'USER_NAME', content: user.name },
			{ name: 'USER_EMAIL', content: user.email}

		];

		transport.mandrill('/messages/send-template', {
			template_name: 'welcome-email',
			template_content: [],

			message: {
				to: [{email: user.email}],
				global_merge_vars: vars
			}
		}, callback);
	});

notifier
	.receive('user-registered', function (e, actions, callback) {
		actions.create('send-verify-sms', {user: e.user}, callback);
	})
	.resolve('send-verify-sms', function (a, actions, callback) {
		asyncRequestForUser(actions.user, function (err, user) {
			if (err) {
				return callback(err);
			}

			actions.resolved(a, {phone: user.email}, callback);
		});
	}).
	execute('send-verify-sms', function (a, transport, callback) {
		transport.twilio.messages.create({
			to: '+380633252435',
			from: '+12282201270',
			body: 'Verification code: 1111',
		}, callback);
	});

notifier.start(process.env.NODE_PORT || 7000);

function asyncRequestForUser(userId, callback) {
	var user = {
		email: 'example@likeastore.com',
		name: 'alexander.beletsky',
		phone: '+3805554455'
	};

	process.nextTick(function () {
		callback(null, user);
	});
}
