'use strict';

var Listing = require('../models/listing');
var User = require('../models/user');
var Mongo = require('mongodb');

exports.new = function(req, res){
  res.render('listings/new', {user:req.user});
};

exports.index = function(req, res){
  Listing.findAll(function(listings){
    res.render('listings/index', {user:req.user, title:'All Current Listings', listings:listings});
  });
};

exports.query = function(req, res){
  Listing.findByGeo(req.query, function(listings){
    res.render('listings/index', {user:req.user, title:'Listings Closest To You', listings:listings});
  });
};


//DEFAULTS FOR PAGE AND LIMIT... default for limit also set in listings model
var globalPage = 1;
var globalLimit = 10;
var defaultLimit = 10;

exports.indexPaging = function(req, res){
  if(req.query.move === 'next'){
    globalPage ++;
  }else if(req.query.move === 'prev'){
    globalPage --;
  }else{
    globalPage = 1;
  }

  globalLimit = req.query.limit || defaultLimit;

  req.query.page = req.query.page || globalPage;

  Listing.findByGeoPaging(req.query, function(listings){
    console.log('req.query in findByGeo Paging');
    console.log(req.query);
    res.render('listings/index', {user:req.user, title:'Listings Closest To You With Paging', listings:listings, globalLimit:globalLimit});
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
    res.redirect('/listings');
  });
};

exports.reserve = function(req, res){
  //listing id, date, artist name
  Listing.findById(req.body.listingId.toString(), function(listing){
    listing.reserveListing(req.body.artistName, req.session.passport.user._id , req.body.reservedDate, function(){
      res.redirect('/');
    });
  });
};

exports.destroy = function(req, res){
  Listing.deleteById(req.params.id, function(count){
    res.redirect('users/' + req.session.passport.user._id);
  });
};

exports.addPhoto = function(req, res){
  Listing.findById(req.params.id, function(record){
    console.log('record before add photo', record);
    record.addPhoto(req.files.photo.path, req.files.photo.name, function(err){
      console.log('record after add photo', record);
      record.updatePhotoArray(function(){
        console.log('record after update Photo Array', record);
        res.redirect('/listings/'+req.params.id);
      });
    });
  });
};
