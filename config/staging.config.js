var config = {
	connection: process.env.MONGO_CONNECTION,
	accessToken: '1234',

	logentries: {
		token: '8adf2203-f6bf-4a23-9f3e-2ac9002080f7'
	},

	transport: {
		mandrill: {
			token: process.env.MANDRILL_TOKEN
		},
		twilio : {
			accountSid: process.env.TWILLIO_ACCOUNT_SID,
			authToken: process.env.TWILLIO_ACCOUNT_TOKEN
		}
	}
};

module.exports = config;