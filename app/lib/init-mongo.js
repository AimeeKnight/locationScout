'use strict';

var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost/' + process.env.DBNAME;
var initialized = false;

exports.connect = function(req, res, next){
  if(!initialized){
    initialized = true;
    exports.db(next);
  }else{
    next();
  }
};

exports.db = function(fn){
  MongoClient.connect(mongoUrl, function(err, db) {
    if(err){throw err;}
    global.nss = {};
    global.nss.db = db;
    global.nss.db.collection('listings').ensureIndex({'coordinates':'2dsphere'}, function(err, indexName){
      console.log(err);
      console.log(indexName);
      console.log('Connected to MongoDB');
      fn();
    });
  });
};

