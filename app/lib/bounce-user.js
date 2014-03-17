'use strict';

var User = require('../models/user');

module.exports = function(req, res, next){
  var FId = req.user.facebookId;
  User.findByFacebookId(FId.toString(), function(record){
    console.log('req.user.id>>>>>>>>>>', req.user.facebookId);
    console.log('record >>>>>>>>>>', record);
    if(record.role){
      next();
    }else{
      res.redirect('/');
    }
  });
};

