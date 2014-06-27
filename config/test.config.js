var config = {
  connection: 'mongodb://localhost:27017/notifier-test',
  accessToken: '1234',

  logentries: {
    token: null
  }

  mandrill: {
    token: null,
    from: {
      email: 'no-reply@democracyos.org'
    }
  }
};

module.exports = config;