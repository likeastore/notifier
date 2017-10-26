var request = require('request');
var notifier = require('../../source/notifier');

var utils = require('../utils');

describe('server.spec.js', function () {
	var url, response, results;

	beforeEach(function (done) {
		notifier._server.listen(utils.port(), done);
	});

	beforeEach(function () {
		url = utils.serviceUrl();
	});

	beforeEach(function (done) {
		utils.clearCollection('actions', done);
	});

	afterEach(function (done) {
		notifier._server.close(done);
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
		var executed, action, transport, e;

		before(function () {
			executed = false;
			e = {
				event: 'first-event'
			};

			notifier
				.receive('first-event', function (e, actions, callback) {
					actions.create('first-event-action', {custom: '123'}, callback);
				})
				.resolve('first-event-action', function (action, actions, callback) {
					actions.resolved(action, {email: 'a@a.com'}, callback);
				})
				.execute('first-event-action', function (a, trans, callback) {
					executed = true;
					action = a;
					transport = trans;
					callback(null);
				});
		});

		beforeEach(function (done) {
			request.post({url: utils.serviceEventsAuthUrl(), body: e, json: true}, function (err, resp, body) {
				response = resp;
				results = body;
				done(err);
			});
		});

		it('should respond 201 (created)', function (done) {
			expect(response.statusCode).to.equal(201);
			done();
		});

		it('should respond 401 (unauthorized)', function (done) {
			request.post({url: utils.serviceEventsUrl(), body: e, json: true}, function (err, resp, body) {
				expect(resp.statusCode).to.equal(401);
				done();
			});
		});

		describe('and resolve job run', function () {
			beforeEach(function (done) {
				notifier._jobs.resolve(done);
			});

			describe('and execute job run', function () {
				beforeEach(function (done) {
					notifier._jobs.execute(done);
				});

				it('should trigger execute callback', function (done) {
					expect(executed).to.equal(true);
					done()
				});

				it('should pass action', function () {
					expect(action.custom).to.equal('123');
					expect(action.data).to.eql({email: 'a@a.com'});
				});

				it('should pass transport', function () {
					expect(transport).to.be.ok;
				});
			});
		});
	});
});