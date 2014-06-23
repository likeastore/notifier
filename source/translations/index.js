/**
 * Module dependencies.
 */

var t = require('t-component');
var config = require('../../config');

/**
 * Load localization dictionaries to translation application
 */

/**
 * Init `t-component` component with parameter locale
 */

var en = require('./lib/en');
var es = require('./lib/es');
// var ca = require('./lib/ca');
// var fr = require('./lib/fr');
// var fi = require('./lib/fi');
// var it = require('./lib/it');

module.exports.t = t;

// English
t.en = en;

// Spanish
t.es = es;

// // Català
// t.ca = ca;

// // French
// t.fr = fr;

// // Finnish
// t.fi = fi;

// // Italian
// t.it = it;

t.lang(config.locale);