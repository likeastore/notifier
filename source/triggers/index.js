var actions = require('../actions');

function userRegistered(bus) {
	bus.subscribe('user-registered', function (e) {
		actions.sendWelcomeEmail(e);
	});
}

// Add custom triggers here

module.exports = userRegistered;