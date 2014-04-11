var actions = require('../actions');

function userRegistered(bus) {
	bus.subscribe('user-registered', function (e) {
		actions.welcomeEmail(e);
	});

	bus.subscribe('collection-created', function (e) {
		actions.notifyFollowers(e);
	});
}

module.exports = userRegistered;