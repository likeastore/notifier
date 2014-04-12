var config = require('../../config');
var db = require('../db')(config);

function welcomeEmail(e, callback) {
	db.actions.save({
		id: 'send-welcome-email',
		email: e.data.email
	}, callback);
}

function notifyFollowers(e, callback) {
	db.actions.save({
		id: 'send-notify-followers-email',
		email: e.data.followers,
		title: e.data.title,
		description: e.data.description,
		collectionId: e.data.collectionId
	}, callback);
}

function notifyOwner(e, callback) {
	db.actions.save({
		id: 'send-notify-collection-owner-email',
		email: e.data.owner,
		userName: e.data.followed.name,
		userId: e.data.followed.id
	}, callback);
}

module.exports = {
	welcomeEmail: welcomeEmail,
	notifyFollowers: notifyFollowers,
	notifyOwner: notifyOwner
};