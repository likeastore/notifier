var utils = require('../utils');
var actions = require('../../source/actions');
var resolve = require('../../source/jobs/resolve');

describe('resolve.spec.js', function () {
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
			utils.createTestUser('a@a.com', 'follower', [], function (err, user) {
				done(err);
			});
		});

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

		it('should have resoved at date', function () {
			expect(action.resolvedAt).to.be.a('Date');
		});

		it('should have data', function () {
			expect(action).to.have.property('data');
			expect(action.data.email).to.equal('a@a.com');
			expect(action.data.user.email).to.equal('a@a.com');
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
				email: 'user@test.com',
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

		it('should have resoved at date', function () {
			expect(action.resolvedAt).to.be.a('Date');
		});

		it('should have data', function () {
			expect(action).to.have.property('data');
			expect(action.data.email).to.eql(['first@follower.com', 'second@follower.com']);
			expect(action.data.user.name).to.equal('user');
			expect(action.data.collection._id.toString()).to.eql(collectionId);
		});
	});

	describe('resolve send-notify-owner-collection-followed', function () {
		var collectionId, userId;

		beforeEach(function (done) {
			utils.createTestUser('follower@test.com', 'follower', [], function (err, user) {
				userId = user._id.toString();
				done(err);
			});
		});

		beforeEach(function (done) {
			var userData = {
				email: 'user@test.com',
				name: 'user'
			};

			utils.createTestCollection('user@test.com', 'title', 'description', [], userData, function (err, collection) {
				collectionId = collection._id.toString();
				done(err);
			});
		});

		beforeEach(function (done) {
			actions.sendNotifyOwnerCollectionFollowed({data: {follower: userId,  collection: collectionId}}, done);
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

		it('should have resoved at date', function () {
			expect(action.resolvedAt).to.be.a('Date');
		});

		it('should have data', function () {
			expect(action).to.have.property('data');
			expect(action.data.user.email).to.eql('user@test.com');
			expect(action.data.email).to.eql('user@test.com');
			expect(action.data.follower.email).to.equal('follower@test.com');
			expect(action.data.follower._id.toString()).to.equal(userId);
		});
	});

	describe('resolve send-notify-followers-new-items-added', function () {
		var collectionId, itemId;

		beforeEach(function (done) {
			var userData = {
				email: 'user@test.com',
				name: 'user'
			};

			utils.createTestCollection('user@test.com', 'title', 'description', [{email: 'aa@a.com'}, {email: 'bb@b.com'}], userData, function (err, collection) {
				collectionId = collection._id.toString();
				done(err);
			});
		});

		beforeEach(function (done) {
			utils.createTestItem('user@test.com', function (err, item) {
				itemId = item._id.toString();
				done(err);
			});
		});

		beforeEach(function (done) {
			actions.sendNotifyFollowersNewItemAdded({user: 'a@a.com', data: {collection: collectionId, item: itemId}}, done);
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

		it('should have resoved at date', function () {
			expect(action.resolvedAt).to.be.a('Date');
		});

		it('should have data', function () {
			expect(action).to.have.property('data');
			expect(action.data.email).to.eql(['aa@a.com', 'bb@b.com']);
			expect(action.data.collection._id.toString()).to.equal(collectionId);
			expect(action.data.item._id.toString()).to.equal(itemId);
		});
	});

	describe('resolve send-notify-developers', function () {
		beforeEach(function (done) {
			utils.createTestUser('a@a.com', 'follower', [], function (err, user) {
				done(err);
			});
		});

		beforeEach(function (done) {
			actions.sendNotifyToDevelopers({user: 'a@a.com', data: {message: 'hello world'}}, done);
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

		it('should have resoved at date', function () {
			expect(action.resolvedAt).to.be.a('Date');
		});

		it('should have data', function () {
			expect(action).to.have.property('data');
			expect(action.data.email).to.eql('devs@likeastore.com');
			expect(action.data.user.email).to.eql('a@a.com');
		});
	});
});