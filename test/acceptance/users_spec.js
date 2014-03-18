'use strict';

var express = require('express');
var passport = require('passport');
var request = require('supertest');

process.env.DBNAME = 'users-test';
var app = require('../../app/app');
var request = require('supertest');
//var expect = require('chai').expect;
//var fs = require('fs');
//var exec = require('child_process').exec;
//var User, u1;
//var cookie;


describe('app', function() {
  describe('GET /', function() {
    it('should return 403 when no user is logged in', function(done) {

      //var app = express();
      app.use(passport.initialize());
      app.use(passport.session());
      app.get('/', function(req, res){
        if (!req.user || !req.isAuthenticated()){
          return res.send(403);
        }
        res.send(200);
      });

      request(app)
        .get('/')
        .expect(403)
        .end(done);
    });

    it('should return 200 when user is logged in', function(done) {

      var app = express();
      app.use(passport.initialize());
      app.use(passport.session());
      app.use(function(req, res, next) {
        req.isAuthenticated = function() {
          return true;
        };
        req.user = {};
        next();
      });
      app.get('/', function(req, res){
        if (!req.user || !req.isAuthenticated()){
          return res.send(403);
        }
        res.send(200);
      });

      request(app)
        .get('/')
        .expect(200)
        .end(done);

    });
  });
});

/*
describe('users', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      u1 = new User({name:'Chyld', facebookId:'12234567890'});
      u1.insert(function(){
        User.update('1234567890', 'knicos@aol.com', 'artist', function(){
          done();
        });
      });
    });
  });

  describe('GET /', function(){
    it('should display the home page', function(done){
      request(app)
      .get('/')
      .expect(200, done);
    });
  });

  describe('GET /auth/facebook', function(){
    it('should redirect you to home page due to a failed facebook auth', function(done){
      request(app)
      .get('/auth/facebook')
      .expect(302, done);
    });
  });

  describe('AUTHORIZED', function(){
    describe('GET /listings', function(){
      it('should login a user and show listings', function(done){
        //passportStub.login({name: 'Tyler Malone', facebookId:'123456789'});
        request(app)
        .get('/listings')
        .end(function(err, res){
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });

/////////////
});
*/
