var actions = {}, bus, client, db, user;
var server = require('./source/server');

client.emit({eventId: 'user-registered', user: 'a@a.com', data: {email: 'a@a.com', date: user.registered}});

server.recieve(function (event) {
	db.events.store(event, function (err, event) {
		bus.publish(event.eventId, event);
	});
});

bus.listen('user-registered', function (e, state, callback) {
	callback(null, actions.sendEmail('welcome', e));
});

bus.listen('collection-created', function (e, state, callback) {
	callback(null, actions.notifyFollowers('collection-created', e));
});

bus.listen('collection-item-added', function (e, state, callback) {
	var current = state.current(e.user);

	current.use(function (e, state) {
		rule(state).apply(callback);
	});

	function rule(state) {
		return state.count > 3 ? produceAction : updateState;
	}

	function produceAction(callback) {
		current.clear(function () {
			if (e) {
				return callback(e);
			}

			callback(null, actions.notifyFollowers('collection-item-added', e));
		});
	}

	function updateState(callback) {
		state.count += 1;
		state.items.push(e.data.item);

		current.save(state, callback);
	}
});