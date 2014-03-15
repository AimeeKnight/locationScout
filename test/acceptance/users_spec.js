'use strict';

process.env.DBNAME = 'users-test';
var app = require('../../app/app');
var request = require('supertest');
//var expect = require('chai').expect;
//var fs = require('fs');
//var exec = require('child_process').exec;
var User, u1;

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
      u1 = new User({name:'Knicos', facebookId:'Ahole'});
      u1.insert(function(){
        u1.update('knicos@ahole.com', 'artist', function(){
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

  describe('GET users/:id', function(){
    it('should render the user profile page', function(){
      request(app)
      .get('/user/123456')
      .set('cookie', cookie)
      .expect(200, done);
    });
  });

});
