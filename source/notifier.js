var _ = require('underscore');

var server = require('./server');
var action = require('./action');

module.exports = _.extend({}, server, action);