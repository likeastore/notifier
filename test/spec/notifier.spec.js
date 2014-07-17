var request = require('request');

var utils = require('../utils');
var notifier = require('../../source/notifier');

describe('notifier.spec.js', function () {
	var url, response, results;

	beforeEach(function () {
		notifier.listen(utils.port());
	});

	beforeEach(function () {
		url = utils.serviceUrl();
	});

	afterEach(function () {
		notifier.close();
	});

	describe('server started', function () {
		beforeEach(function (done) {
			request(url, function (err, resp) {
				response = resp;
				done(err);
			});
		});

		it('should be up and running', function () {
			expect(response.statusCode).to.equal(200);
		});
	});

	describe('when action is created', function () {
		var actionCallback;

		beforeEach(function () {
			actionCallback = sinon.spy();
		});

		beforeEach(function () {
			notifier.action('first-event', actionCallback);
		});

		beforeEach(function () {
			url = utils.serviceEventsAuthUrl();
		});

		describe('and event for corresponding action triggired', function () {
			beforeEach(function (done) {
				var e = {
					event: 'first-event'
				};

				request.post({url: url, body: e, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond 201 (created)', function () {
				expect(response.statusCode).to.equal(201);
			});

			it('should call action function', function () {
				expect(actionCallback.called).to.equal(true);
			});
		});

		describe('and have few subscribers', function () {
			var anotherActionCallback;

			beforeEach(function () {
				anotherActionCallback = sinon.spy();
			});

			beforeEach(function () {
				notifier.action('first-event', anotherActionCallback);
			});

			beforeEach(function (done) {
				var e = {
					event: 'first-event'
				};

				request.post({url: url, body: e, json: true}, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should respond 201 (created)', function () {
				expect(response.statusCode).to.equal(201);
			});

			it('should both actions called function', function () {
				expect(actionCallback.called).to.equal(true);
				expect(anotherActionCallback.called).to.equal(true);
			});
		});
	});

	describe('when action is resolved', function () {
		var resolveCallback;

		beforeEach(function () {
			notifier.action('first-event', function (e, actions) {
				actions.create('first-event-action', {custom: '123'});
			});
		});

		beforeEach(function () {
			resolveCallback = sinon.spy();
			notifier.resolve('first-event-action', resolveCallback);
		});

		beforeEach(function () {
			url = utils.serviceEventsAuthUrl();
		});

		beforeEach(function (done) {
			var e = {
				event: 'first-event'
			};

			request.post({url: url, body: e, json: true}, function (err, resp, body) {
				response = resp;
				results = body;
				done(err);
			});
		});

		it('should respond 201 (created)', function () {
			expect(response.statusCode).to.equal(201);
		});

		describe('and resolve job executed', function () {
			beforeEach(function (done) {
				notifier._jobs.resolve(done);
			});

			it('should trigger resolve callback', function () {
				expect(resolveCallback.called).to.equal(true);
			});
		});
	});
});