var util = require('util');
var translations = require('../source/translations');
var t = require('t-component');

var env = process.env.NODE_ENV || 'development';
var config = util.format('/%s.config.js', env);

/**
 * Load localization dictionaries to translation application
 */

translations.help(t);

/**
 * Init `t-component` component with parameter locale
 */

t.lang(config.locale);

module.exports = require(__dirname + config);