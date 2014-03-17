/* expr: true */
'use strict';

var User = require('../models/user');
var Listing = require('../models/listing');
//var gravatar  = require('gravatar');


exports.create = function(req, res){
  console.log('req.user.facebookId>>>>>', req.user.facebookId);
  User.update(req.user.facebookId, req.body.email, req.body.role, function(count){
    res.redirect('/listings');
  });
};

exports.update = function(req, res){
  console.log('req.user>>>>>', req.user);
  res.render('users/updateInfo', {title: 'Complete Account Registration', user:req.user});
};

exports.show = function(req, res){

  User.findById(req.params.id, function(record){
    //this idea uses the concept of having two seperate view pages, one for the user show
    //page if you are an artist, and another if you are a property owner
    //theoretically allows us to have one if statemenet here, and none in the Jade,
    //should be easier, but there could be issues Im not thinking abouto

    if(record.role === 'artist'){
      //Listing.findReservationsByArtistId(record._id.toString(), function(reservations){
      Listing.findByArtistId(record._id.toString(), function(listings){
          //var url = gravatar.url(record.email, {s: '200', r: 'pg'});
        res.render('users/artistShow', {listings:listings, user:record});
      });
     // });
    }else{
      Listing.findByOwnerId(record._id.toString(), function(listings){
        console.log('>>>>>>>>>>>>>>>>>>>>>LISTINGS!!!!!!!!!!>>>>>>>>>>>>>>>>>>>>>>');
        console.log(listings);
        res.render('users/ownerShow', {listings:listings, owner:record});
      });
    }
  });
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};
