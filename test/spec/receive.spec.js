var utils = require('../utils');
var notifier = require('../../source/notifier');

describe('receive.spec.js', function () {
	var action;

	beforeEach(function () {
		notifier._receiveUnsubscribe();
	});

	beforeEach(function (done) {
		utils.clearCollection('actions', done);
	});

	describe('when event recieved', function () {
		beforeEach(function () {
			notifier.receive('action-event', function (e, actions, callback) {
				actions.create('first-action', {user: e.user, custom: '123'}, callback);
			});
		});

		beforeEach(function (done) {
			notifier._receive.publish('action-event', {event: {user: 'a@a.com'}, callback: done});
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
	});
});