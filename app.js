var monitor = require('./monitor');

['source/server'].map(monitor).forEach(function (m) {
	m.start();
});

