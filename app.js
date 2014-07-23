var _ = require('underscore');
var mongo = require('mongojs');
var moment = require('moment');

var config = require('./config');
var notifier = require('./source/notifier');

var db = mongo.connect(config.connection, []);

var userPick = ['_id', 'avatar', 'email', 'name', 'displayName'];
var collectionPick = ['_id', 'color', 'description', 'public', 'title', 'user'];

function formatUrl(user, collection) {
	return 'https://app.likeastore.com/u/' + user.name + '/' + collection._id;
}

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

notifier
	.receive('collection-created', function (e, actions, callback) {
		actions.create('send-notify-followers-collection-created', {
			user: e.user,
			collection: e.data.collection
		}, callback);
	})
	.resolve('send-notify-followers-collection-created', function (action, actions, callback) {
		db.collections.findOne({_id: new mongo.ObjectId(action.collection)}, function (err, collection) {
			if (err) {
				return callback(err);
			}

			if (!collection) {
				return callback({message: 'collection not found', collection: action.collection});
			}

			db.users.findOne({email: action.user}, function (err, user) {
				if (err) {
					return callback(err);
				}

				if (!user) {
					return callback({message: 'user not found', email: action.user});
				}

				var followers = user.followed || [];
				var emails = followers.map(function (u) {
					return u.email;
				});

				var data = {
					email: emails,
					user: _.pick(user, userPick),
					collection: _.pick(collection, collectionPick)
				};

				actions.resolved(action, data, callback);
			});
		});
	})
	.execute('send-notify-followers-collection-created', function (action, transport, callback) {
		var emails = action.data.email.map(function (e) {
			return {email: e};
		});

		var user = action.data.user;
		var collection = action.data.collection;

		var vars = [
			{ name: 'USER_NAME', content: user.name },
			{ name: 'USER_AVATAR', content: user.avatar },
			{ name: 'COLLECTION_URL', content: formatUrl(user, collection) },
			{ name: 'COLLECTION_TITLE', content: collection.title },
			{ name: 'COLLECTION_THUMBNAIL', content: collection.thumbnail },
			{ name: 'COLLECTION_DESCRIPTION', content: collection.description }
		];

		transport.mandrill('/messages/send-template', {
			template_name: 'notify-followers-collection-created',
			template_content: [],
			message: {
				auto_html: null,
				to: emails,
				bcc: 'ceo@likeastore.com',
				global_merge_vars: vars,
				preserve_recipients: false
			}
		}, callback);
	});

// collection followed email

notifier
	.receive('collection-followed', function (e, actions, callback) {
		actions.create('send-notify-owner-collection-followed', {
			user: e.user,
			follower: e.data.follower,
			collection: e.data.collection,
		}, callback);
	})
	.resolve('send-notify-owner-collection-followed', function (action, actions, callback) {
		db.collections.findOne({_id: new mongo.ObjectId(action.collection)}, function (err, collection) {
			if (err) {
				return callback(err);
			}

			if (!collection) {
				return callback({message: 'collection not found', collection: action.collection});
			}

			db.users.findOne({_id: new mongo.ObjectId(action.follower)}, function (err, follower) {
				if (err) {
					return callback(err);
				}

				if (!follower) {
					return callback({message: 'user not found', email: action.follower});
				}

				var data = {
					email: collection.userData.email,
					user: _.pick(collection.userData, userPick),
					follower: follower,
					collection: _.pick(collection, collectionPick)
				};

				actions.resolved(action, data, callback);
			});
		});
	})
	.execute('send-notify-owner-collection-followed', function (action, transport, callback) {
		var follower = action.data.follower;
		var user = action.data.user;
		var collection = action.data.collection;

		var vars = [
			{ name: 'USERID', content: action.data.user._id },
			{ name: 'USER_NAME', content: follower.name },
			{ name: 'USER_AVATAR', content: follower.avatar },
			{ name: 'COLLECTION_URL', content: formatUrl(user, collection) },
			{ name: 'COLLECTION_TITLE', content: collection.title },
			{ name: 'COLLECTION_THUMBNAIL', content: collection.thumbnail }
		];

		transport.mandrill('/messages/send-template', {
			template_name: 'notify-owner-collection-followed',
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

// user feedback (email to developers)

// sorry see you go email

