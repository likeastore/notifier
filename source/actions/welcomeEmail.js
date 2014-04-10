var config = require('../../config');
var db = require('../db')(config);

function welcomeEmail(e, callback) {
	db.actions.save({id: 'send-welcome-email'}, callback);
}

module.exports = welcomeEmail;