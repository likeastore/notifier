function sendMandrill() {

}

var executors = {
	'send-welcome': function (action, callback) {
		callback(null);
	},

	'send-notify-followers-collection-created': function (action, callback) {
		callback(null);
	},

	'send-notify-owner-collection-followed': function (action, callback) {
		callback(null);
	},

	'send-notify-followers-new-item-added': function (action, callback) {
		callback(null);
	}
};

module.exports = executors;