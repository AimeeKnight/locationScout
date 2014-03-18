'use strict';

process.env.DBNAME = 'users-test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
//var fs = require('fs');
//var exec = require('child_process').exec;
var User, u1;
//var cookie;
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
