'use strict';

//var express = require('express');
var passport = require('passport');
var request = require('supertest');

process.env.DBNAME = 'users-test';
var app = require('../../app/app');
var request = require('supertest');
var User;
var userId;
var cookie;

describe('User', function() {

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
      app.use(passport.initialize());
      app.use(passport.session());
      var u1 = new User({role:'artist', email:'prince@aol.com', name:'Person1', facebookId:'12345'});
      u1.insert(function(user){
        userId = user._id.toString();
        done();
      });
    });
  });

  describe('GET /', function(){
    it('should display the home page when not logged in', function(done){
      request(app)
      .get('/')
      .expect(200, done);
    });
  });

  beforeEach(function(done){
    
    app.get('/log-me-in-now', function(req, res){
      app.use(passport.initialize());
      app.use(passport.session());
      req.session.passport.user = {};
      res.send(200);
    });

    request(app)
    .get('/log-me-in-now')
    .end(function(err, res){
      cookie = res.headers['set-cookie'];
      done();
    });
  });

  describe('GET /users/:id', function(){
    it('should display the user page when logged in', function(done){

      request(app)
      .get('/users/' + userId)
      .set('cookie', cookie)
        .expect(200, done);
    });
  });

  describe('GET /users/:id', function(){
    it('should not display the user page when not logged in', function(done){

      request(app)
      .get('/users/' + userId)
        .expect(302, done);
    });
  });

  describe('GET /logout', function(){
    it('should logout a user', function(done){

      request(app)
      .get('/logout')
        .expect(302, done);
    });
  });
});
