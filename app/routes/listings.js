'use strict';

var Listing = require('../models/listing');
var User = require('../models/user');
//var request = require('request');
//var fs = require('fs');
var Mongo = require('mongodb');
//var _ = require('lodash');

exports.new = function(req, res){
  res.render('listings/new', {user:req.user});
};

exports.index = function(req, res){
  //possibly this function should do a findByGeo right away, dont know
  //Also probably need paging, joy... I can import last projects paging into this
  //one pretty easily, as long as we arent also doing find by geo and paging at same time,
  //that might be a little tricky, but maybe un neccesary since our find by
  //geo distance is limiting our results anyway
  Listing.findAll(function(listings){
    res.render('listings/index', {user:req.user, title:'Listings Index Page', listings:listings});
  });
};

exports.query = function(req, res){
  Listing.findByGeo(req.query, function(listings){
    res.send({listings:listings, user:req.user});
  });
};

exports.show = function(req, res){
  User.findById(req.session.passport.user._id, function(currentUser){
    Listing.findById(req.params.id, function(listing){
      res.render('listings/show', {user:req.user, listing:listing, currentUser:currentUser});
    });
  });
};

exports.create = function(req, res){
  var listing = new Listing(req.body);
  listing.ownerId = Mongo.ObjectID(req.session.passport.user._id);
  listing.addCover(req.files.cover.path);
  listing.insert(function(data){
    res.redirect('/listings', {user:req.user});
  });
};

exports.reserve = function(req, res){
  //listing id, date, artist name
  Listing.findById(req.body.listingId, function(listing){
    listing.reserveListing(req.body.artistName, req.session.passport.user._id , req.body.reservedDate, function(){
      res.redirect('/', {user:req.user});
    });
  });
};

exports.destroy = function(req, res){
  Listing.deleteById(req.params.id, function(count){
    res.redirect('users/' + req.session.passport.user._id, {user:req.user});
  });
};
