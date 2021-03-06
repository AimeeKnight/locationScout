'use strict';

//var express = require('express');
var passport = require('passport');
var request = require('supertest');
var fs = require('fs');
var exec = require('child_process').exec;

process.env.DBNAME = 'users-test';
var app = require('../../app/app');
var request = require('supertest');
var User;
var Listing;
var userId;
var listingId;
var cookie;

describe('User', function() {

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      Listing = require('../../app/models/listing');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/listings/test*';
    var cmd = 'rm -rf ' + testdir;

    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/euro.jpg';
      var copy1file = __dirname + '/../fixtures/euro-copy1.jpg';
      var copy2file = __dirname + '/../fixtures/euro-copy2.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy1file));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy2file));
      global.nss.db.dropDatabase(function(err, result){
        app.use(passport.initialize());
        app.use(passport.session());
        var u1 = new User({role:'artist', email:'prince@aol.com', name:'Person1'});
        u1.insert(function(user){
          userId = user._id.toString();
          var l1 = new Listing({name:'Listing2',
                             ownerId:'222222222222222222222222',
                             lat: '32',
                             lng: '32',
                             address: '123 Main St.',
                             amount: 100});
          l1.insert(function(listing){
            listingId = listing._id.toString();
            done();
          });
        });
      });
    });
  });

  describe('GET /listings', function(){
    it('should display the listings page when not logged in', function(done){
      request(app)
      .get('/')
      .expect(200, done);
    });
  });

  beforeEach(function(done){
    
    app.get('/log-me-in-now', function(req, res){
      app.use(passport.initialize());
      app.use(passport.session());
      req.session.passport.user = {test:'test'};
      res.send(200);
    });

    request(app)
    .get('/log-me-in-now')
    .end(function(err, res){
      cookie = res.headers['set-cookie'];
      done();
    });
  });

  describe('GET /listings/new', function(){
    it('should display the new listings page when logged in', function(done){

      request(app)
      .get('/listings/new/')
      .set('cookie', cookie)
      .expect(200, done);
    });
  });

  describe('GET /listings/new', function(){
    it('should not display the new listings page when not logged in', function(done){

      request(app)
      .get('/listings/new/')
      .expect(302, done);
    });
  });

  describe('GET /listings/:id', function(){
    it('should display the listings page when logged in', function(done){
      request(app)
      .get('/listings/' + listingId)
      .set('cookie', cookie)
      .expect(200, done);
    });
  });

  describe('GET /listings/:id', function(){
    it('should not display the listings page when not logged in', function(done){
      request(app)
      .get('/listings/' + listingId)
      .expect(302, done);
    });
  });

  describe('POST /listings/reserve', function(){
    it('should create a new listing when logged in', function(done){
      var filename = __dirname + '/../fixtures/euro-copy1.jpg';
      request(app)
      .post('/listings')
      .set('cookie', cookie)
      .field('name', 'Test Listing1')
      .field('amount', 100)
      .field('description', 'Listing1 Description')
      .field('address', '123 Main Street')
      .field('coordinates', [30, 30])
      .field('ownerId', userId)
      .attach('cover', filename)
      .expect(302, done);
    });
  });

  describe('POST /listings/reserve', function(){
    it('should reserve a listing', function(done){
      request(app)
      .post('/listings/reserve')
      .set('cookie', cookie)
      .field('reservedDate', '2012-10-10')
      .field('artistName', 'Person1')
      .field('listingId', listingId)
      .expect(302, done);
    });
  });

//////////
});
