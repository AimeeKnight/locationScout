'use strict';

var Listing = require('../models/listing');
//var User = require('../models/user');
//var request = require('request');
//var fs = require('fs');
//var Mongo = require('mongodb');
//var _ = require('lodash');

exports.new = function(req, res){
  res.render('listings/new');
};

exports.index = function(req, res){
  //possibly this function should do a findByGeo right away, dont know
  //Also probably need paging, joy... I can import last projects paging into this
  //one pretty easily, as long as we arent also doing find by geo and paging at same time,
  //that might be a little tricky, but maybe un neccesary since our find by
  //geo distance is limiting our results anyway
  Listing.findAll(function(listings){
    res.render('listings/index', {title:'Listings Index Page', listings:listings});
  });
};

exports.show = function(req, res){
  res.render('listings/show', {title:'Listings Index Page'});
};

exports.create = function(req, res){
  var listing = new Listing(req.body);
  listing.ownerId = req.session.userId;
  listing.insert(function(data){
    console.log(data);
    res.redirect('/');
  });
  //res.redirect('users/' + req.session.userId, {title:'Random title'});
  
};

exports.reserve = function(req, res){
  //listing id, date, artist name
  Listing.findById(req.body.listingId, function(listing){
    listing.reserveListing(req.body.artistName, req.body.arrtistId , req.body.reservedDate, function(){
      res.redirect('/');
    });
  });
};

exports.destroy = function(req, res){
  Listing.deleteById(req.params.id, function(count){
    res.redirect('users/' + req.session.userId);
  });
};
