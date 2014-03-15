'use strict';

process.env.DBNAME = 'listing-test';
var app = require('../../app/app');
var request = require('supertest');
//var fs = require('fs');
//var exec = require('child_process').exec;
//var expect = require('chai').expect;


//gobal variables
var User, Listing;

describe('listings', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      Listing = require('../../app/models/listing');
      done();
    });
  });

  describe('GET /listings', function(){
    it('should display all listings', function(done){
      request(app)
      .get('/listings')
      .expect(200, done);
    });
  });

  describe('GET /listings/new', function(){
    it('should display page to create a new listing', function(done){
      request(app)
      .get('/listings/new')
      .expect(200, done);
    });
  });

  describe('GET /listings/:id', function(){
    it('should show the the profile of a listing', function(done){
      var l1 = new Listing({name:'Listing2',
                         ownerId:'222222222222222222222222',
                         lat: '32',
                         lng: '32',
                         address: '123 Main St.',
                         amount: 100});
      l1.insert();
      request(app)
      .get('listings/show/222222222222222222222222')
      .expect(200, done);
    });
  });

//End//
});
