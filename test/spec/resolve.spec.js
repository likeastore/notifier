var utils = require('../utils');
var actions = require('../../source/actions');
var resolve = require('../../source/jobs/resolve');

describe.only('resolve.spec.js', function () {
	var action;

	beforeEach(function (done) {
		utils.clearCollection('actions', done);
	});

	beforeEach(function (done) {
		utils.clearCollection('collections', done);
	});

	beforeEach(function (done) {
		utils.clearCollection('users', done);
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

	describe('resolve send-notify-followers-collection-created', function () {
		var collectionId;

		beforeEach(function (done) {
			var followers = [
				{email: 'first@follower.com', name: 'first'},
				{email: 'second@follower.com', name: 'second'}
			];

			utils.createTestUser('user@test.com', 'user', followers, done);
		});

		beforeEach(function (done) {
			var userData = {
				email: 'a@a.com',
				name: 'user'
			};

			utils.createTestCollection('user@test.com', 'title', 'description', [], userData, function (err, collection) {
				collectionId = collection._id.toString();
				done(err);
			});
		});

		beforeEach(function (done) {
			actions.sendNotifyFollowersCollectionCreated({user: 'user@test.com', data: {collection: collectionId}}, done);
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
			expect(action.data.email).to.eql(['first@follower.com', 'second@follower.com']);
			expect(action.data.user).to.equal('user');
			expect(action.data.title).to.eql('title');
			expect(action.data.description).to.eql('description');
			expect(action.data.collection).to.eql(collectionId);
		});
	});
});