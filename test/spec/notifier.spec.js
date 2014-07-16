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

	describe('when action is initialized', function () {
		var actionCallback;

		beforeEach(function () {
			actionCallback = sinon.spy();
		});

		beforeEach(function () {
			notifier.action('first-event', actionCallback);
		});

		describe('and event for corresponding action triggired', function () {
			beforeEach(function (done) {
				var e = {
					event: 'first-event'
				};

				request.post({url: url, body: e, json: true}, function (err, resp) {
					response = resp;
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
	});
});