'use strict';

var Listing = require('../models/listing');
//var User = require('../models/user');
//var request = require('request');
//var fs = require('fs');
//var Mongo = require('mongodb');
//var _ = require('lodash');


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


