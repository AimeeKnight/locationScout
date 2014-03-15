'use strict';

module.exports = Listing;
//var bcrypt = require('bcrypt');
var listings = global.nss.db.collection('listings');
var Mongo = require('mongodb');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function Listing(listing){
  this.name = listing.name;
  this.amount = listing.amount * 1;
  this.address = listing.address;
  this.coordinates = [listing.lat * 1, listing.lng * 1];
  this.ownerId = Mongo.ObjectID(listing.ownerId);
  this.reservations = [];
  //this.artistIds = [];
}

Listing.prototype.insert = function(fn){
  listings.insert(this, function(err, records){
    fn(records[0]);
  });
};

// id2 === artistId;
Listing.prototype.reserveListing = function(id2, reservedDate, fn){
  var _id2 = new Mongo.ObjectID(id2);
  reservedDate = new Date(reservedDate);
  var updateObj = {artistId:_id2, reservedDate:reservedDate};
  this.reservations.push(updateObj);
  listings.update({_id:this._id}, this, function(err, count){
    fn(count);
  });
};

Listing.deleteById = function(id, fn){
  var _id = new Mongo.ObjectID(id);
  listings.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

Listing.findById = function(id, fn){
  var _id = new Mongo.ObjectID(id);
  listings.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

Listing.findAll = function(fn){
  listings.find().toArray(function(err, records){
    fn(records);
  });
};

Listing.findByOwnerId = function(id, fn){
  var _id = new Mongo.ObjectID(id);
  listings.findOne({_id:_id}, function(owner){
    fn(owner);
  });
};

Listing.findReservationsByArtistId = function(id, fn){
  var _id2 = new Mongo.ObjectID(id);
  var reservations =  _.filter(this.reservations, { 'artistId': _id2});
  console.log(reservations);
  fn(reservations);
};

Listing.findByGeo = function(query, fn){
  var lat = query.lat * 1;
  var lng = query.lng * 1;

  listings.find({'coordinates':{$nearSphere:{$geometry:{type:'Point', coordinates:[lat, lng]}}, $maxDistance : 2500000}}).toArray(function(err, records){
    fn(records);
  });
};

Listing.prototype.addCover = function(oldpath){
  var dirname = this.name.replace(/\W/g,'').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/img/listings/' + dirname;
  fs.mkdirSync(abspath + relpath);

  var extension = path.extname(oldpath);
  relpath += '/cover' + extension;
  fs.renameSync(oldpath, abspath + relpath);

  this.cover = relpath;
};

