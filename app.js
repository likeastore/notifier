var monitor = require('./monitor');

['example/server'].map(monitor).forEach(function (m) {
	m.start();
});

