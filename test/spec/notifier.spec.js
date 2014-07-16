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

});