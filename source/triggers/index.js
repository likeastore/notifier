var actions = require('../actions');

function userRegistered(bus) {
	bus.subscribe('user-registered', function (e) {
		actions.welcomeEmail(e);
	});

	bus.subscribe('collection-created', function (e) {
		actions.notifyFollowers(e);
	});

	bus.subscribe('collection-followed', function (e) {
		actions.notifyOwner(e);
	});

}

module.exports = userRegistered;