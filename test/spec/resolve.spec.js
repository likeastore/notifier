var utils = require('../utils');
var notifier = require('../../source/notifier');

describe.only('resolve.spec.js', function () {
	var action;

	beforeEach(function () {
		notifier._resolveUnsubscribe();
	});

	beforeEach(function (done) {
		utils.clearCollection('actions', done);
	});

	beforeEach(function (done) {
		utils.createAction({id: 'first-action', userId: '123'}, function (err, created) {
			action = created;
			done(err);
		});
	});

	describe('when resolving action', function () {
		beforeEach(function () {
			notifier.resolve('first-action', function (action, actions, callback) {
				// emulate async call
				process.nextTick(function () {
					actions.resolved(action, {user: 'a@a.com', custom: '123'}, callback);
				});
			});
		});

		beforeEach(function (done) {
			notifier._resolveBus.publish('first-action', {action: action, callback: done});
		});

		beforeEach(function (done) {
			utils.getLastAction(function (err, act) {
				action = act;
				done(err);
			});
		});

		it('should get resolved state', function () {
			expect(action.state).to.equal('resolved');
		});

		it('should have resolved field', function () {
			expect(action.resolved).to.be.a('Date');
		});
	});

	describe('when skipping action', function () {
		beforeEach(function () {
			notifier.resolve('first-action', function (action, actions, callback) {
				// emulate async call
				process.nextTick(function () {
					actions.skipped(action, callback);
				});
			});
		});

		beforeEach(function (done) {
			notifier._resolveBus.publish('first-action', {action: action, callback: done});
		});

		beforeEach(function (done) {
			utils.getLastAction(function (err, act) {
				action = act;
				done(err);
			});
		});

		it('should get skipped state', function () {
			expect(action.state).to.equal('skipped');
		});

		it('should have resolved field', function () {
			expect(action.resolved).to.be.a('Date');
		});
	});

	describe('when error action', function () {
		beforeEach(function () {
			notifier.resolve('first-action', function (action, actions, callback) {
				// emulate async call
				process.nextTick(function () {
					actions.error(action, new Error('failed to open db'), callback);
				});
			});
		});

		beforeEach(function (done) {
			notifier._resolveBus.publish('first-action', {action: action, callback: done});
		});

		beforeEach(function (done) {
			utils.getLastAction(function (err, act) {
				action = act;
				done(err);
			});
		});

		it('should get skipped state', function () {
			expect(action.state).to.equal('error');
		});

		it('should have reason', function () {
			expect(action.reason).to.be.ok;
		});
	});
});
