'use strict';

var util = require('util');

module.exports = function(req, res, next){
  console.log('//----------------------------------------------//');
  util.log('request received [params, query, body]');
  console.log(req.params);
  console.log(req.query);
  console.log(req.body);
  console.log(util.format('path: %s, verb: %s', req.route.path, req.route.method));

  next();
};

