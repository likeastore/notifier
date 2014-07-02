var actions = require('../actions');

function userRegistered(bus) {
	bus.subscribe('signup', function (e) {
		actions.sendWelcomeEmail(e);
	});
}

// Add custom triggers here

module.exports = userRegistered;