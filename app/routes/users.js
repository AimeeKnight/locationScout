'use strict';

exports.create = function(req, res){
  res.redirect('/');
};

exports.show = function(req, res){
  User.findbyId(req.params.id, function(record){
    if(record.role === 'artist'){
      Listing.findReservationsByArtistId(record._id.toString(), function(listings){
      res.render('users/artistShow', {listings:listings, user:record});

  });
};
