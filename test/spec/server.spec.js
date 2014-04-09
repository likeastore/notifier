var request = require('request');
var utils = require('../utils');

describe('server.spec.js', function () {
	var url, event, action;

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
				request.post({url: url, body: event, json: true}, done);
			});

			beforeEach(function (done) {
				utils.getLastAction(function (err, act) {
					action = act;
					done(err);
				});
			});

			it('should send-welcome-email action created', function () {
				expect(action.type).to.equal('send-welcome-email');
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