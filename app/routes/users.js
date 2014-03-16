/* expr: true */
'use strict';

var User = require('../models/user');
//var Listing = require('../models/listing');

exports.create = function(req, res){
  res.redirect('/');
};
/*
exports.show = function(req, res){

  User.findbyId(req.params.id, function(record){
    //this idea uses the concept of having two seperate view pages, one for the user show
    //page if you are an artist, and another if you are a property owner
    //theoretically allows us to have one if statemenet here, and none in the Jade,
    //should be easier, but there could be issues Im not thinking abouto

    if(record.role === 'artist'){
      Listing.findReservationsByArtistId(record._id.toString(), function(listings){
        res.render('users/artistShow', {listings:listings, user:record});
      });
    }else{
      Listing.findByOwnerId(record._id.toString(), function(listings){
        res.render('users/ownerShow', {listings:listings, user:record});
      });
    }
    */

exports.show = function(req, res){
  User.findById(req.session.userId, function(user){
    //var url = gravatar.url(user.email, {s: '200', r: 'pg'});
    if(user.role === 'owner')
      Listing.findByOwnerId

    res.render('users/show', {user:user});
  });
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};
