var util = require('util');

var env = process.env.NODE_ENV || 'development';
var config = util.format('/%s.config.js', env);

module.exports = require(__dirname + config);