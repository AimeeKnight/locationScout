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
  res.redirect('users/' + req.session.userId, {title:'Random title'});
};

exports.destroy = function(req, res){
  Listing.deleteById(req.params.id, function(count){
    res.redirect('users/' + req.session.userId);
    console.log('COUNT >>>>>>>>>>>>>>>> '+ count);
  });
};
