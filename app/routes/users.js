/* expr: true */
'use strict';

var User = require('../models/user');
var Listing = require('../models/listing');
//var gravatar  = require('gravatar');


exports.create = function(req, res){
  User.update(req.user.facebookId, req.body.email, req.body.role, function(count){
    res.redirect('/listings', {user:req.user});
  });
};

exports.update = function(req, res){
  res.render('users/updateInfo', {title: 'Complete Account Registration', user:req.user});
};

exports.show = function(req, res){

  User.findById(req.params.id, function(record){

    if(record.role === 'artist'){
      Listing.findByArtistId(record._id.toString(), function(listings){
          //var url = gravatar.url(record.email, {s: '200', r: 'pg'});
        res.render('users/artistShow', {currentUser:req.user, listings:listings, user:record});
      });
    }else{
      Listing.findByOwnerId(record._id.toString(), function(listings){
        res.render('users/ownerShow', {user:req.user, listings:listings, owner:record});
      });
    }
  });
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};

exports.testLoginArtist = function(req, res){
  req.session.regenerate(function(){
    req.session.facebookId = '123456789';
    req.session.name = 'Jay Knight';
    req.session.email = 'jayKnight@gmail.com';
    req.session.role = 'artist';
    req.session._id = 'zzzzzzzzzzzzzzzzzzzzzzzz';
    req.session.save(function(){
      res.redirect('/');
    });
  });
};

exports.testLoginOwner = function(req, res){
  req.session.regenerate(function(){
    req.session.facebookId = '987654321';
    req.session.name = 'Tiffany Knight';
    req.session.email = 'tiffany@gmail.com';
    req.session.role = 'owner';
    req.session._id = 'oooooooooooooooooooooooo';
    req.session.save(function(){
      res.redirect('/');
    });
  });
};
