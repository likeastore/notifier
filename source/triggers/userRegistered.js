var actions = require('../actions');

function userRegistered(bus) {

	bus.subscribe('user-registered', function (e) {
		actions.welcomeEmail(e);
	});

}

module.exports = userRegistered;