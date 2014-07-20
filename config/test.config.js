var config = {
	connection: 'mongodb://localhost:27017/notifiertestdb',
	accessToken: '1234',

	logentries: {
		token: null
	},

	transport: {
		mandrill: {
			token: 'fake-mandrill-api-token'
		},
		twilio : {
			accountSid: 'fake-twilio-account-sid',
			authToken: 'fake-twilio-auth-token'
		}
	},

	jobs: {
		run: {
			resolve: 5,
			execute: 10
		},

		collection: 'notifierJobs'
	}
};

module.exports = config;