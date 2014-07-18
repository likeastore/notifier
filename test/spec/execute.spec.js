var utils = require('../utils');
var notifier = require('../../source/notifier');

describe.only('execute.spec.js', function () {
	var action;

	beforeEach(function () {
		notifier._executeUnsubscribe();
	});

	beforeEach(function (done) {
		utils.clearCollection('actions', done);
	});

	describe('when executing non resolved action', function () {
		var error;

		beforeEach(function (done) {
			utils.createAction({id: 'just-created-action', state: 'created'}, function (err, created) {
				action = created;
				done(err);
			});
		});

		beforeEach(function () {
			notifier.execute('just-created-action', function (action, actions, callback) {
				callback(null);
			});
		});

		beforeEach(function (done) {
			notifier._executeBus.publish('just-created-action', {action: action, callback: function (err) {
				error = err;
				done();
			}});
		});

		it('should return error', function () {
			expect(error).to.be.ok;
		});
	});

	describe('when executed successfully', function () {
		beforeEach(function (done) {
			utils.createAction({id: 'just-created-action', state: 'resolved'}, function (err, created) {
				action = created;
				done(err);
			});
		});

		beforeEach(function () {
			notifier.execute('just-created-action', function (action, actions, callback) {
				callback(null);
			});
		});

		beforeEach(function (done) {
			notifier._executeBus.publish('just-created-action', {action: action, callback: done});
		});

		beforeEach(function (done) {
			utils.getLastAction(function (err, act) {
				action = act;
				done(err);
			});
		});

		it('should get executed state', function () {
			expect(action.state).to.equal('executed');
		});

		it('should have executed date', function () {
			expect(action.executed).to.be.a('Date');
		});
	});
});