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

		});
	});

	describe('when collection-followed', function () {
		describe('notify followers action', function () {

		});
	});

	describe('when collection-item-added', function () {

	});
});