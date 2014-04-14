var actions = require('../actions');
var state = {};

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

	bus.subscribe('collection-item-added', function (e) {
		var current = state(e);

		current.use(function (err, state) {
			// log errors
			rule(state).call(this, state);
		});

		function rule(state) {
			return state.count > 3 ? produceAction : updateState;
		}

		function produceAction(state) {
			current.clear(function (err) {
				actions.notifyFollowers(e);
			});
		}

		function updateState(state) {
			current.update({})
		}
	});

}

module.exports = userRegistered;