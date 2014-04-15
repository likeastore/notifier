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
		var current = state(e);

		current.use(function (err, state) {
			// TODO: log errors
			updateState(state, function (e, state) {
				if (state.properties.count >= 3) {
					produceAction(state, function () {
						current.clear();
					});
				}
			});
		});

		function produceAction(state, callback) {
			actions.sendNotifyFollowersNewItemsAdded(e, state.properties.items, callback);
		}

		function updateState(state, callback) {
			var properties = state.properties || {count: 0, items: []};

			properties.count += 1;
			properties.items.push(e.data.item);

			current.update(properties, callback);
		}
	});
}

module.exports = userRegistered;