var actions = require('../actions');
var state = require('../state');

function userRegistered(bus) {
	bus.subscribe('user-registered', function (e) {
		actions.sendWelcomeEmail(e);
	});

	bus.subscribe('collection-created', function (e) {
		actions.sendNotifyFollowersCollectionCreated(e);
	});

	bus.subscribe('collection-followed', function (e) {
		actions.sendNotifyOwnerCollectionFollowed(e);
	});

	bus.subscribe('collection-item-added', function (e) {
		actions.sendNotifyFollowersNewItemAdded(e);
	});
}

module.exports = userRegistered;