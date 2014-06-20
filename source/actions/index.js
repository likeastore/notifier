var moment = require('moment');
var config = require('../../config');
var db = require('../db')(config);
var logger = require('../utils/logger');

var initial = 'created';

function sendWelcomeEmail(e, callback) {
	db.actions.save({
		id: 'send-welcome',
		user: e.user,
		state: initial,
	}, function (err) {
		logger.info({message: 'created send-welcome action'});
		callback && callback(err);
	});
}

function sendPersonalEmail(e, callback) {
	db.actions.save({
		id: 'send-personal',
		user: e.user,
		state: initial,
		executeAfter: moment().add(3, 'days').toDate()
	}, function (err) {
		logger.info({message: 'created send-personal action'});
		callback && callback(err);
	});
}

function sendNotifyFollowersCollectionCreated(e, callback) {
	db.actions.save({
		id: 'send-notify-followers-collection-created',
		user: e.user,
		collection: e.data.collection,
		state: initial,
	}, function (err) {
		logger.info({message: 'created send-notify-followers-collection-created action'});
		callback && callback(err);
	});
}

function sendNotifyOwnerCollectionFollowed(e, callback) {
	db.actions.save({
		id: 'send-notify-owner-collection-followed',
		user: e.user,
		follower: e.data.follower,
		collection: e.data.collection,
		state: initial
	}, function (err) {
		logger.info({message: 'created send-notify-owner-collection-followed action'});
		callback && callback(err);
	});
}

function sendNotifyFollowersNewItemAdded(e, callback) {
	db.actions.save({
		id: 'send-notify-followers-new-item-added',
		user: e.user,
		collection: e.data.collection,
		item: e.data.item,
		state: initial
	}, function (err) {
		logger.info({message: 'created send-notify-followers-new-item-added action'});
		callback && callback(err);
	});
}

function sendNotifyCollectionOwner(e, callback) {
	db.actions.save({
		id: 'send-notify-collection-owner-item-used',
		user: e.user,
		collection: e.data.collection,
		item: e.data.item,
		state: initial
	}, function (err) {
		logger.info({message: 'created send-notify-collection-owner-item-used action'});
		callback && callback(err);
	});
}

function sendNotifyToDevelopers(e, callback) {
	db.actions.save({
		id: 'send-notify-developers',
		user: e.user,
		message: e.data.message,
		state: initial
	}, function (err) {
		logger.info({message: 'created send-notify-followers-new-item-added action'});
		callback && callback(err);
	});
}

function sendSorrySeeYouGo(e, callback) {
	db.actions.save({
		id: 'send-sorry',
		user: e.user,
		message: e.data.message,
		state: initial,
		executeAfter: moment().add(1, 'days').toDate()
	}, function (err) {
		logger.info({message: 'created send-sorry action'});
		callback && callback(err);
	});
}

module.exports = {
	sendWelcomeEmail: sendWelcomeEmail,
	sendPersonalEmail: sendPersonalEmail,
	sendNotifyFollowersCollectionCreated: sendNotifyFollowersCollectionCreated,
	sendNotifyOwnerCollectionFollowed: sendNotifyOwnerCollectionFollowed,
	sendNotifyFollowersNewItemAdded: sendNotifyFollowersNewItemAdded,
	sendNotifyToDevelopers: sendNotifyToDevelopers,
	sendSorrySeeYouGo: sendSorrySeeYouGo,
	sendNotifyCollectionOwner: sendNotifyCollectionOwner
};