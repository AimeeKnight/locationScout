'use strict';

process.env.DBNAME = 'scout-test';
var Mongo = require('mongodb');
var expect = require('chai').expect;
var fs = require('fs');
var exec = require('child_process').exec;
var User, Listing, l1, listing1Id;

describe('Listing', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      Listing = require('../../app/models/listing');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/test*';
    var cmd = 'rm -rf ' + testdir;

    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/euro.jpg';
      var copy1file = __dirname + '/../fixtures/euro-copy1.jpg';
      var copy2file = __dirname + '/../fixtures/euro-copy2.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy1file));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy2file));
      global.nss.db.dropDatabase(function(err, result){
        l1 = new Listing({name:'Listing1',
                          ownerId:'222222222222222222222222',
                          artistId:'333333333333333333333333',
                          lat: '32',
                          lng: '32',
                          address: '123 Main St.',
                          amount: 100});
        l1.insert(function(listing1){
          listing1Id = listing1._id.toString();
          done();
        });
      });
    });
  });

  describe('new', function(){
    it('should create a new Listing', function(){
      var l1 = new Listing({name:'Listing2',
                         ownerId:'222222222222222222222222',
                         artistId:'333333333333333333333333',
                         lat: '32',
                         lng: '32',
                         address: '123 Main St.',
                         amount: 100});
      expect(l1).to.be.instanceof(Listing);
      expect(l1.name).to.equal('Listing2');
      expect(l1.address).to.equal('123 Main St.');
      expect(l1.ownerId).to.be.instanceof(Mongo.ObjectID);
      expect(l1.artistId).to.be.instanceof(Mongo.ObjectID);
    });
  });

  describe('#insert', function(){
    it('should insert a new listing', function(done){
      var l2 = new Listing({name:'Listing3',
                         ownerId:'222222222222222222222222',
                         artistId:'333333333333333333333333',
                         lat: '32',
                         lng: '32',
                         address: '123 Main St',
                         amount: 100});

      var oldname = __dirname + '/../fixtures/euro-copy1.jpg';
      l2.addCover(oldname);
      l2.insert(function(listing2){
        console.log(listing2);
        expect(listing2._id).to.be.instanceof(Mongo.ObjectID);
        expect(listing2.cover).to.equal('/img/listings/listing3/cover.jpg');
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find by listing id ', function(done){
      Listing.findById(listing1Id, function(listing){
        expect(listing._id.toString()).to.equal(listing1Id);
        done();
      });
    });
  });

  describe('.findAll', function(){
    it('should find all listing ', function(done){
      var l2 = new Listing({name:'Listing2',
                         ownerId:'222222222222222222222222',
                         artistId:'333333333333333333333333',
                         lat: '32',
                         lng: '32',
                         address: '123 Main St.',
                         amount: 100});
      l2.insert(function(listing2){
        Listing.findAll(function(listings){
          expect(listings).to.have.length(2);
          expect(listings[0]._id).to.be.instanceof(Mongo.ObjectID);
          done();
        });
      });
    });
  });

  describe('.deleteById', function(){
    it('should delete listing by id', function(done){
      Listing.deleteById(listing1Id , function(deletedCount){
        expect(deletedCount).to.equal(1);
        done();
      });
    });
  });

});

