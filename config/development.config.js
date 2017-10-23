var config = {
	connection: 'mongodb://localhost:27017/notifierdb',
	accessToken: '1234',

	hook: {
		url: 'http://localhost:5000/api/notify/',
		token: 'fake-hook-token'
	},

	logging: {
		loglevel: 'debug',
		logentries: {
			token: null
		},	
	},	

	transport: {
		mandrill: {
			token: 'fake-mandill-api-token'
		},
		twilio : {
			accountSid: 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
			authToken: 'fake-twilio-auth-token'
		},
		gcm : {
			serverApiKey: 'fake-google-server-api-key'
		},
		apn : {
			cert: 'fake-cert-path',
			key: 'fake-key-path'
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