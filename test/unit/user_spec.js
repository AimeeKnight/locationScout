'use strict';

process.env.DBNAME = 'scout-test';
var expect = require('chai').expect;
var Mongo = require('mongodb');
//var exec = require('child_process').exec;
//var fs = require('fs');
var User, u1, u2;

describe('User', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      u1 = new User({name: 'Sue Williams', facebookId:'abcd'});
      u2 = new User({name: 'Tyler Malone', facebookId:'1234'});
      done();
    });
  });

  describe('#new', function(){
    it('should create a new user', function(done){
      expect(u1).to.be.instanceof(User);
      expect(u1.facebookId).to.equal('abcd');
      done();
    });
  });

  describe('#insert', function(){
    it('should insert new object into database', function(done){
      u1.insert(function(){
        expect(u1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('#update', function(){
    it('should update user object with email and role', function(done){
      u1.insert(function(){
        u1.update('sue@aol.com', 'artist', function(ret){
          expect(ret).to.equal(1);
          done();
        });
      });
    });
  });

  describe('.findById', function(){
    it('should find a user by ID', function(done){
      u1.insert(function(){
        u2.insert(function(){
          var user2Id = u2._id.toString();
          User.findById(user2Id, function(user){
            expect(user._id.toString()).to.equal(user2Id);
            done();
          });
        });
      });
    });
  });

  describe('.findByFacebookId', function(){
    it('should find a user by fb ID', function(done){
      u2.insert(function(){
        User.findByFacebookId(ret._id.toString, function(ret){
          expect(ret.facebookId).to.be('1234');
          done();
        });
      });
    });
  });

});
