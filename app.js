var monitor = require('./monitor');

['source/server', 'source/jobs'].map(monitor).forEach(function (m) {
	m.start();
});

