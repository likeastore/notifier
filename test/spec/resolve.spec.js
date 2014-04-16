var utils = require('../utils');
var actions = require('../../source/actions');
var resolve = require('../../source/jobs/resolve');

describe('resolve.spec.js', function () {
	var action;

	beforeEach(function (done) {
		utils.clearCollection('actions', done);
	});

	describe('resove send-welcome', function () {
		beforeEach(function (done) {
			actions.sendWelcomeEmail({user: 'a@a.com'}, done);
		});

		beforeEach(function (done) {
			resolve(done);
		});

		beforeEach(function (done) {
			utils.getLastAction(function (err, act) {
				action = act;
				done(err);
			});
		});

		it('should change state to ready', function () {
			expect(action.state).to.equal('ready');
		});

		it('should have data', function () {
			expect(action).to.have.property('data');
			expect(action.data.email).to.equal('a@a.com');
		});
	});
});