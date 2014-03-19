/* expr: true */
'use strict';

var User = require('../models/user');
var Listing = require('../models/listing');
var gravatar  = require('gravatar');
var moment = require('moment');
/*
function returnUser(){
  User.findById(req.session.passport.user._id, function(){
    
  });
}
*/

exports.create = function(req, res){
  User.update(req.user.facebookId, req.body.email, req.body.role, function(count){
    res.redirect('/listings');
  });
};

exports.update = function(req, res){
  res.render('users/updateInfo', {title: 'Complete Account Registration', user:req.user});
};

exports.show = function(req, res){

  User.findById(req.params.id, function(record){
    if(record.role === 'artist'){
      Listing.findByArtistId(record._id.toString(), function(listings){
        var url = gravatar.url(record.email, {s: '200', r: 'pg'});
        res.render('users/artistShow', {moment:moment, user:req.user, listings:listings, artist:record, gravatar: url});
      });
    }else{
      Listing.findByOwnerId(record._id.toString(), function(listings){
        var url = gravatar.url(record.email, {s: '200', r: 'pg'});
        res.render('users/ownerShow', {moment:moment, user:req.user, listings:listings, owner:record, gravatar: url});
      });
    }
  });
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};
