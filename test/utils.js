var _ = require('underscore');
var crypto = require('crypto');
var config = require('../config');
var db = require('../source/db')(config);
var moment = require('moment');
var request = require('request');

function getRootUrl () {
	return config.applicationUrl;
}

function createTestEmail() {
	return moment().valueOf() + '@tests.com';
}

function createTestUser (callback) {
	var email = createTestEmail();
	var password = 'password';
	var apiToken = crypto.createHash('sha1').update(email + ';' + password).digest('hex');

	var user = {email: email, password: password, name: email , apiToken: apiToken};
	db.users.save(user, {safe: true}, callback);
}

function createTestUserAndLoginToApi (callback) {
	createTestUser(function (err, user) {
		if (err) {
			return callback(err);
		}

		var url = getRootUrl() + '/api/auth/login';
		request.post({url: url, body: {email: user.email, apiToken: user.apiToken}, json: true}, function (err, response, body) {
			if (err) {
				return callback(err);
			}

			callback (null, user, body.token);
		});
	});
}

function loginToApi(user, callback) {
	var url = getRootUrl() + '/api/auth/login';
	request.post({url: url, body: {email: user.email, apiToken: user.apiToken}, json: true}, function (err, response, body) {
		if (err) {
			return callback(err);
		}

		callback (null, user, body.token);
	});
}

function createTestItems (user, size, callback) {
	if (typeof size === 'function') {
		callback = size;
		size = 10;
	}

	var networks = ['github', 'twitter', 'stackoverflow'];

	var range = _.range(size);
	var items = range.map (function (index) {
		return {
			userId: user._id,
			user: user.email,
			type: networks[index % 3],
			created: moment().toDate(),
			date: moment().toDate(),
			itemId: index
		};
	});

	db.items.insert(items, {safe: true}, callback);
}

function createTestItemsOfType(user, network, size, callback) {
	if (typeof size === 'function') {
		callback = size;
		size = 10;
	}

	var range = _.range(size);
	var items = range.map (function (index) {
		return {
			userId: user._id,
			user: user.email,
			type: network,
			created: moment().toDate(),
			date: moment().toDate(),
			itemId: index
		};
	});

	db.items.insert(items, {safe: true}, callback);
}

function createTestNetwork(user, type, callback) {
	var network = {
		user: user.email,
		service: type
	};

	db.networks.insert(network, {safe: true}, callback);
}

function removeTestNetwork(user, type, callback) {
	db.networks.remove({user: user.email, service: type}, callback);
}

function createTestNetworks(user, props, callback) {
	if (typeof props === 'function') {
		callback = props;
		props = {};
	}

	var range = _.range(3);
	var types = ['github', 'twitter', 'stackoverflow'];

	var networks = range.map(function (index) {
		return _.extend({
			user: user.email,
			service: types[index % 3],
			accessToken: 'test-token'
		}, props);
	});

	db.networks.insert(networks, {safe: true}, callback);
}

function getUserFromDb(user, callback) {
	db.users.findOne({email: user.email}, callback);
}

function addFollows(user, follows, callback) {
	db.users.findAndModify({
		query: {email: user.email},
		update: {$push: {follows: {$each: follows}}}
	}, callback);
}

function getDb() {
	return db;
}

module.exports = {
	// common
	getRootUrl: getRootUrl,
	createTestEmail: createTestEmail,
	createTestUser: createTestUser,
	createTestUserAndLoginToApi: createTestUserAndLoginToApi,
	loginToApi: loginToApi,
	createTestItems: createTestItems,
	createTestItemsOfType: createTestItemsOfType,
	createTestNetwork: createTestNetwork,
	createTestNetworks: createTestNetworks,
	getUserFromDb: getUserFromDb,
	removeTestNetwork: removeTestNetwork,
	addFollows: addFollows,

	// infa
	getDb: getDb
};