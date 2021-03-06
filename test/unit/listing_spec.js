'use strict';

process.env.DBNAME = 'scout-test';
var Mongo = require('mongodb');
var expect = require('chai').expect;
var fs = require('fs');
var exec = require('child_process').exec;
var User, Listing, l1, l2, l3, listing1Id;

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
    var testdir = __dirname + '/../../app/static/img/listings/test*';
    var cmd = 'rm -rf ' + testdir;

    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/euro.jpg';
      var copy1file = __dirname + '/../fixtures/euro-copy1.jpg';
      var copy2file = __dirname + '/../fixtures/euro-copy2.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy1file));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy2file));
      global.nss.db.dropDatabase(function(err, result){
        global.nss.db.collection('listings').ensureIndex({'coordinates':'2dsphere'}, function(err, indexName){
          l1 = new Listing({name:'Listing1',
            ownerId:'222222222222222222222222',
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
  });

  describe('new', function(){
    it('should create a new Listing', function(){
      var l1 = new Listing({name:'Listing2',
                         ownerId:'222222222222222222222222',
                         lat: '32',
                         lng: '32',
                         address: '123 Main St.',
                         amount: 100});
      expect(l1).to.be.instanceof(Listing);
      expect(l1.name).to.equal('Listing2');
      expect(l1.address).to.equal('123 Main St.');
      expect(l1.ownerId).to.be.instanceof(Mongo.ObjectID);
    });
  });

  describe('#insert', function(){
    it('should insert a new listing', function(done){
      var l2 = new Listing({name:'testListing3',
                         ownerId:'222222222222222222222222',
                         lat: '32',
                         lng: '32',
                         address: '123 Main St',
                         amount: 100});

      var oldname = __dirname + '/../fixtures/euro-copy1.jpg';
      l2.addCover(oldname);
      l2.insert(function(listing2){
        console.log(listing2);
        expect(listing2._id).to.be.instanceof(Mongo.ObjectID);
        expect(listing2.cover).to.equal('/img/listings/testlisting3/cover.jpg');
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

  describe('.findByOwnerId', function(){
    it('should find by listing owner id ', function(done){
      Listing.findByOwnerId('222222222222222222222222', function(listings){
        expect(listings[0].ownerId.toString()).to.equal('222222222222222222222222');
        done();
      });
    });
  });

  describe('.findByArtistId', function(){
    it('should find by listing artist id ', function(done){
      l1.reserveListing('Some artist', '111111111111111111111111','1987-02-27',  function(count){
        Listing.findByArtistId('111111111111111111111111', function(listings){
          expect(listings[0].artistIds[0].toString()).to.equal('111111111111111111111111');
          done();
        });
      });
    });
  });

  describe('.findAll', function(){
    it('should find all listing ', function(done){
      var l2 = new Listing({name:'Listing2',
                         ownerId:'222222222222222222222222',
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

  describe('#reserveListing', function(){
    it('should add a reservation object to the listings reservation array', function(done){
      l1.reserveListing('someDude','111111111111111111111111','1987-02-27',  function(count){
        expect(count).to.equal(1);
        expect(l1.reservations).to.have.length(1);
        expect(l1.reservations[0].reservedDate).to.be.instanceof(Date);
        done();
      });
    });
  });

  describe('.findReservationsByArtistId', function(){
    it('should return all reservations with a given artistId', function(done){
      l1.reserveListing('someDude', '111111111111111111111111','1987-02-27',  function(count){
        Listing.findReservationsByArtistId('111111111111111111111111',  function(reservations){
          expect(reservations[0].artistId.toString()).to.equal('111111111111111111111111');
          done();
        });
      });
    });
  });

  describe('.findByGeoPaging', function(){
    it('should find closest closet by location', function(done){
      l2 = new Listing({name:'Listing2',
                         ownerId:'222222222222222222222222',
                         lat: '32',
                         lng: '-86',
                         address: '23 Main St.',
                         amount: 100});
      l3 = new Listing({name:'Listing3',
                         ownerId:'222222222222222222222222',
                         lat: '42',
                         lng: '32',
                         address: '123 Main St.',
                         amount: 100});
      l2.insert(function(listing2){
        l3.insert(function(listing3){
          var object = {lat: 32, lng:-85};
          Listing.findByGeoPaging(object, function(records){
            expect(records[0].name).to.equal('Listing2');
            done();
          });
        });
      });
    });
  });


});

