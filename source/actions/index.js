var config = require('../../config');
var db = require('../db')(config);

function sendWelcomeEmail(e, callback) {
	db.actions.save({
		id: 'send-welcome',
		email: e.data.email
	}, callback);
}

function sendNotifyFollowersCollectionCreated(e, type, callback) {
	db.actions.save({
		id: 'send-notify-followers-collection-created',
		email: e.data.followers,
		title: e.data.title,
		description: e.data.description,
		collectionId: e.data.collectionId
	}, callback);
}

function sendNotifyOwnerCollectionFollowed(e, callback) {
	db.actions.save({
		id: 'send-notify-owner-collection-followed',
		email: e.data.owner,
		userName: e.data.followed.name,
		userId: e.data.followed.id
	}, callback);
}

function sendNotifyFollowersNewItemsAdded(e, items, callback) {
	db.actions.save({
		id: 'send-notify-followers-new-items-added',
		user: e.user,
		collection: e.data.collection,
		items: items
	}, callback);
}

module.exports = {
	sendWelcomeEmail: sendWelcomeEmail,
	sendNotifyFollowersCollectionCreated: sendNotifyFollowersCollectionCreated,
	sendNotifyOwnerCollectionFollowed: sendNotifyOwnerCollectionFollowed,
	sendNotifyFollowersNewItemsAdded: sendNotifyFollowersNewItemsAdded
};