var postal = require('postal');
var bus = postal.channel('events-channel');

var actions = {};

function action(eventName, fn) {
	bus.subscribe(eventName, function (e) {
		fn.call(e, actions);
	});
}

module.exports = {
	action: action
};