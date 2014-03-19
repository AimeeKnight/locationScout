'use strict';

exports.index = function(req, res){
  var login;
  if(req.user){
    login = true;
  }else{
    login = false;
  }
  res.render('home/index', {user:req.user, title: 'Location Scout', login:login});
};

