'use strict';

var User = require('../models/user');

module.exports = function(req, res, next){
  var FId = req.user.facebookId;
  console.log('FId');
  console.log(FId);
  User.findByFacebookId(FId.toString(), function(record){
    if(record.role){
      next();
    }else{
      res.redirect('/updateUser');
    }
  });
};

