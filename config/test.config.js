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
		},
		gcm : {
			serverApiKey: 'fake-google-server-api-key'
		}
	}
};

module.exports = config;