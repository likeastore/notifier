var config = {
	connection: process.env.MONGO_CONNECTION,
	accessToken: process.env.ACCESS_TOKEN,

	logentries: {
		token: '0bb5837f-db56-45dd-8be1-6541b14a49f0'
	},

	transport: {
		mandrill: {
			token: process.env.MANDRILL_TOKEN
		},
		twilio : {
			accountSid: 'not-using-twillio',
			authToken: 'not-using-twillio'
		}
	},

	jobs: {
		run: {
			resolve: 30,
			execute: 60
		},

		collection: 'notifierJobs'
	}
};

module.exports = config;