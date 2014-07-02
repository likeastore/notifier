var config = {
  connection: process.env.MONGO_CONNECTION,
  accessToken: process.env.ACCESS_TOKEN,

  logentries: {
    token: '0bb5837f-db56-45dd-8be1-6541b14a49f0'
  },

  mandrill: {
    token: process.env.MANDRILL_TOKEN,
    from: {
      email: process.env.MANDRILL_FROM_EMAIL,
      name: process.env.MANDRILL_FROM_NAME
    }
  }
};

module.exports = config;