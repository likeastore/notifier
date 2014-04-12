var request = require('request');
var utils = require('../utils');

describe('server.spec.js', function () {
	var url, event, action, response;

	before(function () {
		url = utils.serviceUrl();
	});

	before(function (done) {
		utils.clearDb(done);
	});

	describe('when user-registered event', function () {
		describe('send welcome email', function () {
			beforeEach(function () {
				event = {event: 'user-registered', data: {email: 'a@a.com'}};
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
				expect(action.id).to.equal('send-welcome-email');
				expect(action.email).to.equal('a@a.com');
			});
		});
	});

	describe('when collection-created', function () {
		describe('notify followers action', function () {
			beforeEach(function () {
				event = {event: 'collection-created', data: {owner: 'a@a.com', followers: ['b@b.com', 'c@c.com'], title: 'aaa', description: 'bbb', collectionId: '123'}};
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
				expect(action.id).to.equal('send-notify-followers-email');
				expect(action.email).to.eql(['b@b.com', 'c@c.com']);
				expect(action.title).to.equal('aaa');
				expect(action.description).to.equal('bbb');
				expect(action.collectionId).to.equal('123');
			});
		});
	});

	describe('when collection-followed', function () {
		describe('notify collection owner', function () {
			beforeEach(function () {
				event = {event: 'collection-followed', data: {owner: 'a@a.com', followed: {name: 'john doe', id: '123'}}};
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
				expect(action.id).to.equal('send-notify-collection-owner-email');
				expect(action.email).to.eql('a@a.com');
				expect(action.userName).to.equal('john doe');
				expect(action.userId).to.equal('123');
			});
		});
	});

	describe('when collection-item-added', function () {

	});
});