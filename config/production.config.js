var config = {
	connection: process.env.MONGO_CONNECTION,
	accessToken: process.env.ACCESS_TOKEN,

	logging: {
		loglevel: 'error',
		logentries: {
			token: process.env.LOGENTRIES_TOKEN
		},	
	},	

	hook: {
		url: process.env.HOOK_URL,
		token: process.env.HOOK_TOKEN
	},

	transport: {
		mandrill: {
			token: process.env.MANDRILL_TOKEN
		},
		nodemailer: {
			host: process.env.NODEMAILER_HOST,
			port: process.env.NODEMAILER_PORT,
			secure: process.env.NODEMAILER_SECURE, // true for 465, false for other ports
			auth: {
				user: process.env.NODEMAILER_USER,
				pass: process.env.NODEMAILER_PASS
			}
		},
		twilio : {
			accountSid: process.env.TWILIO_ACCOUNT_SID,
			authToken: process.env.TWILIO_ACCOUNT_TOKEN
		},
		gcm : {
			serverApiKey: process.env.GOOGLE_SERVER_API_KEY
		},
		apn : {
			cert: process.env.APPLE_CERT,
			key: process.env.APPLE_KEY
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