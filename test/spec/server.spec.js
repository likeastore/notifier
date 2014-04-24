var moment = require('moment');
var _ = require('underscore');
var request = require('request');
var utils = require('../utils');

describe('server.spec.js', function () {
	var url, event, action, response;

	before(function () {
		url = utils.serviceUrl();
	});

	beforeEach(function (done) {
		utils.clearCollection('actions', done);
	});

	describe('when user-registered event', function () {
		beforeEach(function () {
			event = {
				event: 'user-registered',
				user: 'a@a.com'
			};
		});

		beforeEach(function (done) {
			request.post({url: url, body: event, json: true}, function (err, resp) {
				response = resp;
				done(err);
			});
		});

		describe('send welcome email', function () {
			beforeEach(function (done) {
				setTimeout(function () {
					utils.getLastActions(function (err, act) {
						action = _.find(act, function (a) {
							return a.id === 'send-welcome';
						});
						done(err);
					});
				}, 30);
			});

			it('should respond 201 (created)', function () {
				expect(response.statusCode).to.equal(201);
			});

			it('should send-welcome-email action created', function () {
				expect(action.id).to.equal('send-welcome');
				expect(action.user).to.equal('a@a.com');
			});
		});

		describe('send personal message in 3 days', function () {
			beforeEach(function (done) {
				setTimeout(function () {
					utils.getLastActions(function (err, act) {
						action = _.find(act, function (a) {
							return a.id === 'send-personal';
						});
						done(err);
					});
				}, 30);
			});

			it('should respond 201 (created)', function () {
				expect(response.statusCode).to.equal(201);
			});

			it('should send-personal-email action created', function () {
				expect(action.id).to.equal('send-personal');
				expect(action.user).to.equal('a@a.com');
			});

			it('should be executed after 3 days', function () {
				var duration = moment.duration(moment(action.executeAfter).diff(moment())).humanize();
				expect(duration).to.equal('3 days');
			});
		});
	});

	describe('when collection-created', function () {
		beforeEach(function () {
			event = {
				event: 'collection-created',
				user: 'a@a.com',
				data: {collection: '123'}
			};
		});

		beforeEach(function (done) {
			request.post({url: url, body: event, json: true}, function (err, resp) {
				response = resp;
				done(err);
			});
		});

		describe('notify followers action', function () {
			beforeEach(function (done) {
				setTimeout(function () {
					utils.getLastAction(function (err, act) {
						action = act;
						done(err);
					});
				}, 30);
			});

			it('should respond 201 (created)', function () {
				expect(response.statusCode).to.equal(201);
			});

			it('should send-notify-followers-email action created', function () {
				expect(action.id).to.equal('send-notify-followers-collection-created');
				expect(action.user).to.eql('a@a.com');
				expect(action.collection).to.equal('123');
			});
		});
	});

	describe('when collection-followed', function () {
		beforeEach(function () {
			event = {
				event: 'collection-followed',
				user: 'a@a.com',
				data: {collection: '321', follower: '123'}
			};
		});

		beforeEach(function (done) {
			request.post({url: url, body: event, json: true}, function (err, resp) {
				response = resp;
				done(err);
			});
		});

		describe('notify collection owner', function () {
			beforeEach(function (done) {
				setTimeout(function () {
					utils.getLastAction(function (err, act) {
						action = act;
						done(err);
					});
				}, 30);
			});

			it('should respond 201 (created)', function () {
				expect(response.statusCode).to.equal(201);
			});

			it('should send-notify-collection-owner action created', function () {
				expect(action.id).to.equal('send-notify-owner-collection-followed');
				expect(action.user).to.eql('a@a.com');
				expect(action.follower).to.equal('123');
				expect(action.collection).to.equal('321');
			});
		});
	});

	xdescribe('when collection-item-added', function () {
		beforeEach(function (done) {
			request.post({url: url, body: {
				event: 'collection-item-added',
				user: 'user@notify.com',
				data: { item: '123', collection: '345'}}, json: true}, function (err, resp) {
					response = resp;
					done(err);
			});
		});

		describe('notify followers', function () {
			beforeEach(function (done) {
				setTimeout(function () {
					utils.getLastAction(function (err, act) {
						action = act;
						done(err);
					});
				}, 30);
			});

			it('should send-notify-followers-new-item-added', function () {
				expect(action.id).to.equal('send-notify-followers-new-item-added');
				expect(action.user).to.eql('user@notify.com');
				expect(action.collection).to.equal('345');
				expect(action.item).to.eql('123');
			});
		});
	});

	describe('when user sends feedback', function () {
		beforeEach(function (done) {
			request.post({url: url, body: {
				event: 'user-feedback',
				user: 'user@notify.com',
				data: { message: 'you are awesome'}}, json: true}, function (err, resp) {
					response = resp;
					done(err);
			});
		});

		beforeEach(function (done) {
			setTimeout(function () {
				utils.getLastAction(function (err, act) {
					action = act;
					done(err);
				});
			}, 30);
		});

		it('should send-notify-developers', function () {
			expect(action.id).to.equal('send-notify-developers');
			expect(action.user).to.eql('user@notify.com');
			expect(action.message).to.equal('you are awesome');
		});
	});
});