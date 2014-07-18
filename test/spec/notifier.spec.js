var request = require('request');

var utils = require('../utils');

describe('notifier.spec.js', function () {
	var notifier, url, response, results;

	beforeEach(function () {
		notifier = require('../../source/notifier');
		notifier.listen(utils.port());
	});

	beforeEach(function () {
		url = utils.serviceUrl();
	});

	beforeEach(function (done) {
		utils.clearCollection('actions', done);
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

	describe('when action is executed', function () {
		var executed;

		before(function () {
			executed = false;

			notifier.receive('first-event', function (e, actions, callback) {
				actions.create('first-event-action', {custom: '123'}, callback);
			});

			notifier.resolve('first-event-action', function (action, actions, callback) {
				actions.resolve(action, {email: 'a@a.com'}, callback);
			});

			notifier.execute('first-event-action', function (action, actions, callback) {
				executed = true;
				callback(null);
			});
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

		describe('and resolve job run', function () {
			beforeEach(function (done) {
				notifier._jobs.resolve(done);
			});

			describe('and execute job run', function () {
				beforeEach(function (done) {
					notifier._jobs.execute(done);
				});

				it('should trigger execute callback', function () {
					expect(executed).to.equal(true);
				});
			});
		});
	});
});