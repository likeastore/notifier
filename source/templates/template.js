var fs = require('fs');
var path = require('path');
var jade = require('jade');
var merge = require('merge-util');
var t = require('t-component');
var logger = require('../utils/logger');

function jadeTemplate(name, options, callback) {
  var filePath = path.join(__dirname, '/' + name + '.jade');

  logger.info('looking for template [' + name + '] in path: ' filePath);

  fs.readFile(filePath, {encoding: 'utf-8'}, function (err, template) {
    if (err) {
      callback({message: 'unable to find template with name ' + name});
      return err;
    }

    callback(null, jade.compile(template, merge(options, {t: t})))
  }); 
};


module.exports = {
  jade: jadeTemplate
};