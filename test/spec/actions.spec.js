var utils = require('../utils');
var notifier = require('../../source/notifier');

describe('actions.spec.js', function () {
	var actions, action;

	beforeEach(function () {
		actions = notifier._actions;
	});

	beforeEach(function (done) {
		utils.clearCollection('actions', done);
	});

	describe('when creating actions', function () {
		beforeEach(function (done) {
			actions.create('first-action', {user: 'a@a.com', custom: '123'}, done);
		});

		beforeEach(function (done) {
			utils.getLastAction(function (err, act) {
				action = act;
				done(err);
			});
		});

		it('should be created', function () {
			expect(action).to.be.ok;
		});

		it('should be in initial state', function () {
			expect(action.state).to.equal('created');
		});

		it('should have properties initialized', function () {
			expect(action.id).to.equal('first-action');
			expect(action.user).to.equal('a@a.com');
			expect(action.custom).to.equal('123');
		});

		it('should have timespampt', function () {
			expect(action.created).to.be.a('Date');
		});

		describe('and callback is optional', function () {
			beforeEach(function () {
				actions.create('second-action', {user: 'a@a.com', custom: '123'});
			});

			beforeEach(function (done) {
				utils.getLastAction(function (err, act) {
					action = act;
					done(err);
				});
			});

			it('should be created', function () {
				expect(action).to.be.ok;
			});

			it('should be in initial state', function () {
				expect(action.state).to.equal('created');
			});
		});
	});
});