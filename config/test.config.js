var config = {
	connection: 'mongodb://localhost:27017/notifiertestdb',
	accessToken: '1234',

	logging: {
		loglevel: 'debug',
		logentries: {
			token: null
		},	
	},

	hook: {
		url: 'http://localhost:5000/api/notify/',
		token: 'fake-hook-token'
	},

	transport: {
		mandrill: {
			token: 'fake-mandrill-api-token'
		},
		nodemailer: {
			host: 'a-fake-email-server',
			port: 587,
			secure: false,
			auth: {
				user: 'test-user-account',
				pass: 'test-passowrd'
			}
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