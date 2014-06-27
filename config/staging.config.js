var config = {
  connection: process.env.MONGO_CONNECTION,
  accessToken: '1234',

  logentries: {
    token: '8adf2203-f6bf-4a23-9f3e-2ac9002080f7'
  },

  mandrill: {
    token: process.env.MANDRILL_TOKEN,
    from: {
      email: process.env.MANDRILL_FROM_EMAIL
    }
  }
};

module.exports = config;