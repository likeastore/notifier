var utils = require('../utils');
var notifier = require('../../source/notifier');

describe('resolve.spec.js', function () {
	var actions, resolve, action;

	beforeEach(function () {
		actions = notifier._actions;
		resolve = notifier._resolve;
	});

	beforeEach(function (done) {
		utils.clearCollection('actions', done);
	});

	describe('when resolving action', function () {
		beforeEach(function (done) {
			actions.create('first-action', {user: 'a@a.com', custom: '123'}, done);
		});

		beforeEach(function (done) {
			utils.getLastAction(function (err, act) {
				action = act;
				done(err);
			});
		});

		beforeEach(function (done) {
			var data = { updated: action.email + ' ' + action.custom };
			resolve.resolve(action, data, done);
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
		beforeEach(function (done) {
			actions.create('first-action', {user: 'a@a.com', custom: '123'}, done);
		});

		beforeEach(function (done) {
			utils.getLastAction(function (err, act) {
				action = act;
				done(err);
			});
		});

		beforeEach(function (done) {
			resolve.skip(action, done);
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
		beforeEach(function (done) {
			actions.create('first-action', {user: 'a@a.com', custom: '123'}, done);
		});

		beforeEach(function (done) {
			utils.getLastAction(function (err, act) {
				action = act;
				done(err);
			});
		});

		beforeEach(function (done) {
			resolve.error(action, new Error('failed to open db'), done);
		});

		beforeEach(function (done) {
			utils.getLastAction(function (err, act) {
				action = act;
				done(err);
			});
		});

		it('should get error state', function () {
			expect(action.state).to.equal('error');
		});

		it('should have reason', function () {
			expect(action.reason).to.be.ok;
		});
	});

});
