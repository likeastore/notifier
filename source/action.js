var postal = require('postal');
var bus = postal.channel('events-channel');

var actions = {};

function action(eventName, fn) {
	if (!fn) {
		throw new Error('missing action hander');
	}

	bus.subscribe(eventName, function (e) {
		fn.call(e, actions);
	});
}

module.exports = {
	action: action
};