var _ = require('underscore');

var server = require('./server');
var action = require('./action');
var resolve = require('./resolve');

module.exports = _.extend({}, server, action, resolve);