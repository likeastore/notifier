var request = require('request');
var utils = require('../utils');

describe('server.spec.js', function () {
	var url, event, action, response;

	before(function () {
		url = utils.serviceUrl();
	});

	beforeEach(function (done) {
		utils.clearCollection('actions', done);
	});

	describe('when user-registered event', function () {
		describe('send welcome email', function () {
			beforeEach(function () {
				event = {
					event: 'user-registered',
					user: 'a@a.com'
				};
			});

			beforeEach(function (done) {
				request.post({url: url, body: event, json: true}, function (err, resp) {
					response = resp;
					done(err);
				});
			});

			beforeEach(function (done) {
				setTimeout(function () {
					utils.getLastAction(function (err, act) {
						action = act;
						done(err);
					});
				}, 30);
			});

			it('should respond 201 (created)', function () {
				expect(response.statusCode).to.equal(201);
			});

			it('should send-welcome-email action created', function () {
				expect(action.id).to.equal('send-welcome');
				expect(action.user).to.equal('a@a.com');
			});
		});
	});

	describe('when collection-created', function () {
		describe('notify followers action', function () {
			beforeEach(function () {
				event = {
					event: 'collection-created',
					user: 'a@a.com',
					data: {collection: '123'}
				};
			});

			beforeEach(function (done) {
				request.post({url: url, body: event, json: true}, function (err, resp) {
					response = resp;
					done(err);
				});
			});

			beforeEach(function (done) {
				setTimeout(function () {
					utils.getLastAction(function (err, act) {
						action = act;
						done(err);
					});
				}, 30);
			});

			it('should respond 201 (created)', function () {
				expect(response.statusCode).to.equal(201);
			});

			it('should send-notify-followers-email action created', function () {
				expect(action.id).to.equal('send-notify-followers-collection-created');
				expect(action.user).to.eql('a@a.com');
				expect(action.collection).to.equal('123');
			});
		});
	});

	describe('when collection-followed', function () {
		describe('notify collection owner', function () {
			beforeEach(function () {
				event = {
					event: 'collection-followed',
					user: 'a@a.com',
					data: {follower: '123'}
				};
			});

			beforeEach(function (done) {
				request.post({url: url, body: event, json: true}, function (err, resp) {
					response = resp;
					done(err);
				});
			});

			beforeEach(function (done) {
				setTimeout(function () {
					utils.getLastAction(function (err, act) {
						action = act;
						done(err);
					});
				}, 30);
			});

			it('should respond 201 (created)', function () {
				expect(response.statusCode).to.equal(201);
			});

			it('should send-notify-collection-owner action created', function () {
				expect(action.id).to.equal('send-notify-owner-collection-followed');
				expect(action.user).to.eql('a@a.com');
				expect(action.follower).to.equal('123');
			});
		});
	});

	describe('when collection-item-added', function () {

		before(function (done) {
			utils.clearCollection('states', done);
		});

		describe('first item added', function () {
			beforeEach(function (done) {
				request.post({url: url, body: {
					event: 'collection-item-added',
					user: 'user@notify.com',
					data: { item: '123', collection: '345'}}, json: true}, function (err, resp) {
						response = resp;
						done(err);
				});
			});

			beforeEach(function (done) {
				setTimeout(function () {
					utils.getLastAction(function (err, act) {
						action = act;
						done(err);
					});
				}, 30);
			});

			it('should no actions be added', function () {
				expect(action).to.not.ok;
			});
		});

		describe('second item added', function () {
			beforeEach(function (done) {
				request.post({url: url, body: {
					event: 'collection-item-added',
					user: 'user@notify.com',
					data: { item: '456', collection: '345'}}, json: true}, function (err, resp) {
						response = resp;
						done(err);
				});
			});

			beforeEach(function (done) {
				setTimeout(function () {
					utils.getLastAction(function (err, act) {
						action = act;
						done(err);
					});
				}, 30);
			});

			it('should no actions be added', function () {
				expect(action).to.not.ok;
			});
		});

		describe('third item added', function () {
			beforeEach(function (done) {
				request.post({url: url, body: {
					event: 'collection-item-added',
					user: 'user@notify.com',
					data: { item: '789', collection: '345'}}, json: true}, function (err, resp) {
						response = resp;
						done(err);
				});
			});

			beforeEach(function (done) {
				setTimeout(function () {
					utils.getLastAction(function (err, act) {
						action = act;
						done(err);
					});
				}, 30);
			});

			it('should send-notify-followers-email', function () {
				expect(action.id).to.equal('send-notify-followers-new-items-added');
				expect(action.user).to.eql('user@notify.com');
				expect(action.collection).to.equal('345');
				expect(action.items).to.eql(['123', '456', '789']);
			});
		});

		describe('and repeated', function () {

		});
	});
});