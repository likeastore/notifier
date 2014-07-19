var notifier = require('../source/notifier');

// just for example, here it will be call to db or external service
var asyncRequestForUser = function (userId, callback) {
	var user = {
		email: 'example@likeastore.com',
		name: 'alexander.beletsky',
		phone: '+3805554455'
	};

	process.nextTick(function () {
		callback(null, user);
	});
};

notifier
	.receive('user-registered', function (e, actions, callback) {
		actions.create('send-welcome-email', {user: e.user}, callback);
	})
	.receive('user-registered', function (e, actions, callback) {
		actions.create('send-verify-sms', {user: e.user}, callback);
	})
	.resolve('send-welcome-email', function (a, actions, callback) {
		asyncRequestForUser(actions.user, function (err, user) {
			if (err) {
				return callback(err);
			}

			actions.resolve(a, {email: user.email, name: user.name}, callback);
		});
	})
	.resolve('send-verify-sms', function (a, actions, callback) {
		asyncRequestForUser(actions.user, function (err, user) {
			if (err) {
				return callback(err);
			}

			actions.resolve(a, {phone: user.email}, callback);
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
			message: {
				to: [{email: user.email}],
				global_merge_vars: vars
			}
		}, callback);
	}).
	execute('send-verify-sms', function (a, transport, callback) {
		// TODO: add twillio example
		callback(null);
	});

notifier.start(function () {
	// started!
});