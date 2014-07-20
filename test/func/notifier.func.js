var http = require('http-mock');


describe('notifier.func.js', function () {
	var mandrill, twilio;

	beforeEach(function () {
		// mock http calls to twilio, mandrill etc..
		mandrill = http.mock('https://mandrill.com');
		twilio = http.mock('https://api.twilio.com');
	});

	beforeEach(function () {
		// start example/server.js
	});

	describe('when sending events', function () {
		describe('welcome email', function () {
			beforeEach(function () {
				// hit server with welcome events
			});

			beforeEach(function (done) {
				mandrill.idle(100, done);
			});

			it('should hit mandrill service', function () {
				expect(mandrill.hits).to.equal(1);
			});
		});

		describe('sms verification', function () {
			beforeEach(function () {
				// hit server with welcome events
			});

			beforeEach(function (done) {
				mandrill.idle(100, done);
			});

			it('should hit mandrill service', function () {
				expect(twilio.hits).to.equal(1);
			});
		});
	});
});