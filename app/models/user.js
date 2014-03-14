'use strict';

module.exports = User;
//var bcrypt = require('bcrypt');
var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var _ = require('lodash');
//var fs = require('fs');
//var path = require('path');

function User(user){
  this.name = user.name;
  this.facebookId = user.facebookId;
  this.email = user.email || '';
  this.role = user.role || '';
}

User.prototype.insert = function(fn){
  var self = this;
  users.findOne({facebookId:this.facebookId}, function(err, record){
    if(!record){
      users.insert(self, function(err, records){
        fn(records[0]);
      });
    }else{
      fn(err);
    }
  });
};

User.prototype.update = function(email, role, fn){
  users.update({facebookId:this.facebookId}, {email:email, role:role}, function(err, count){
    fn(count);
  });
};

User.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);

  users.findOne({_id:_id}, function(err, user){
    fn(_.extend(user, User.prototype));
  });
};
