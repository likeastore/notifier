var fs = require('fs');
var path = require('path');
var jade = require('jade');
var t = require('t-component');
var logger = require('../utils/logger');

function jadeTemplate(name, callback) {
  var filePath = path.join(__dirname, './' + name + '.jade');

  console.log('looking for template [' + name + '] in path: ' + filePath);

  fs.readFile(filePath, { encoding: 'utf-8' }, function (err, template) {
    if (!err) {
      // var mail = jade.compile(template, { t: t });

      var mail = jade.compile(template);
      var content = mail({ t: t });

      console.log('JADE: ' + content);

      callback(null, content);
    } else {
      console.log('Error while reading template: ' + err.stack);
      callback({message: 'unable to find template with name ' + name});
    }
  }); 
};


module.exports = {
  jade: jadeTemplate
};