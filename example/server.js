var notifier = require('../source/notifier');

// Using mandrill
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

// Using nodemailer
notifier
	.receive('user-registered', function (e, actions, callback) {
		actions.create('send-welcome-email', {user: e.user}, callback);
	})
	.resolve('send-welcome-email', function (a, actions, callback) {
		// skip to execute
		actions.resolved(a, {email: a.user.email, name: a.user.name}, callback);
	})
	.execute('send-welcome-email', function (a, transport, callback) {
		var user = a.data;

		var mailOpts = {
			from: 'test@user.com',
			to: 'example@likeastore.com',
			subject: 'Test Email',
			text: 'An example of a message.',
			html: '<h1>Hello</h1> </br> Welcome!'
		}			

		transport.nodemailer.sendMail(mailOpts, (error, info) => {
			if(error){
				console.log(error);
				return callback(error);
			}

			console.log('Message sent: ' + JSON.stringify(info));
	        // Preview only available when sending through an Ethereal account
	        console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));

	        callback();
		});
	});

// Using twilio
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

// Using android push
notifier
	.receive('user-completed-action', function (e, actions, callback) {
		actions.create('send-android-push', {user: e.user}, callback);
	})
	.resolve('send-android-push', function (a, actions, callback) {
		asyncRequestForUser(actions.user, function (err, user) {
			if (err) {
				return callback(err);
			}

			actions.resolved(a, {deviceId: user.deviceId}, callback);
		});
	})
	.execute('send-android-push', function (a, transport, callback) {
		var regIds = [];
		regIds.push(a.data.regIds);

		var message = {
			title: 'This is a tite',
			message: "Hi there."
		};
		
		transport.android.push({ message: message, regIds: regIds, retries: 3}, callback);
	});

notifier
	.receive('user-completed-action-with-hook', function (e, actions, callback) {
		actions.create('send-android-push', {user: e.user}, callback);
	})
	.resolve('send-android-push', function (a, actions, callback) {
		asyncRequestForUser(actions.user, function (err, user) {
			if (err) {
				return callback(err);
			}

			actions.resolved(a, {deviceId: user.deviceId}, callback);
		});
	})
	.execute('send-android-push', function (a, transport, callback) {
		var regIds = [];
		regIds.push(a.data.regIds);

		var message = {
			title: 'This is a tite',
			message: "Hi there."
		};
		
		transport.android.push({ message: message, regIds: regIds, retries: 3 }, function (err, result) {
			if (result.failure === 1) {
				var data = {
					message: message,
					status: result.success
				};

				notifier.sendHook('notify.sms', err || result, data);
			}

			return callback(err, result);
		});
	});

// Using iOS push
notifier
	.receive('user-completed-action', function (e, actions, callback) {
		actions.create('send-ios-push', {user: e.user}, callback);
	})
	.resolve('send-ios-push', function (a, actions, callback) {
		asyncRequestForUser(actions.user, function (err, user) {
			if (err) {
				return callback(err);
			}

			actions.resolved(a, {deviceId: user.deviceId}, callback);
		});
	})
	.execute('send-ios-push', function (a, transport, callback) {
		var tokens = [];
		tokens.push(a.data.token);

		transport.ios.push({
			production: false, // use specific gateway based on 'production' property.
			passphrase: 'secretPhrase',
			alert: { "body" : "Your turn!", "action-loc-key" : "Play" , "launch-image" : "mysplash.png"},
			badge: 1,
			tokens: tokens
		}, callback);
	});

notifier.start(process.env.NODE_PORT || 3031);

function asyncRequestForUser(userId, callback) {
	var user = {
		email: 'example@likeastore.com',
		name: 'alexander.beletsky',
		phone: '+3805554455',
		token: 'regId123'
	};

	process.nextTick(function () {
		callback(null, user);
	});
}
