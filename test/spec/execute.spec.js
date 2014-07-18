var bus = require('postal');
var utils = require('../utils');
var notifier = require('../../source/notifier');

var receive = bus.channel('event:receive');
var execute = bus.channel('events:execute');

describe('execute.spec.js', function () {
	var actions, resolve, execute, action;

	describe('when executing non resolved action', function () {
		beforeEach(function () {
			notifier.action('exec-event', function (event, actions, callback) {
				actions.create('exec-event-action', {message: 123}, callback);
			});
		});

		beforeEach(function () {
			receive.publish('exec-event', {});
		});
	});
});