var config = {
	connection: 'mongodb://localhost:27017/likeastoredb',
	accessToken: '1234',

	logentries: {
		token: null
	},

	transport: {
		mandrill: {
			token: 'fake-mandrill-api-token'
		}
	}
};

module.exports = config;