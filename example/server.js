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

			actions.resolved(a, {phone: user.phone}, callback);
		});
	}).
	execute('send-verify-sms', function (a, transport, callback) {
		transport.twilio.messages.create({
			to: a.data.phone,
			from: '+12282201270',
			body: 'Verification code: 1111',
		}, callback);
	});

notifier
	.receive('user-completed-action', function (e, actions, callback) {
		actions.create('send-android-push-notification', {user: e.user}, callback);
	})
	.resolve('send-android-push-notification', function (a, actions, callback) {
		asyncRequestForUser(actions.user, function (err, user) {
			if (err) {
				return callback(err);
			}

			actions.resolved(a, {deviceId: user.deviceId}, callback);
		});
	})
	.execute('send-android-push-notification', function (a, transport, callback) {
		var registrationIds = [];
		registrationIds.push(a.data.deviceId);
		
		var message = transport.android.message;
		message.addDataWithObject({
			key1: 'message1',
			key2: 'message2'
		});

		transport.android.push.send(message, registrationIds, 4, callback);
	});

notifier.start(process.env.NODE_PORT || 3031);

function asyncRequestForUser(userId, callback) {
	var user = {
		email: 'example@likeastore.com',
		name: 'alexander.beletsky',
		phone: '+3805554455',
		deviceId: 'regId123'
	};

	process.nextTick(function () {
		callback(null, user);
	});
}
