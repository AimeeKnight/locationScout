'use strict';

var d = require('../lib/request-debug');
var passport = require('passport');
var initialized = false;
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  passport.serializeUser(function(user, done){
    done(null, user);
  });

  passport.deserializeUser(function(obj, done){
    done(null, obj);
  });

  passport.use(new FacebookStrategy({
      clientID: '1430897753818675',
      clientSecret: 'a1a805afc58ab0421b780187acd29a66',
      callbackURL: 'http://192.168.11.98:4000/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  ));

  var home = require('../routes/home');
  var users = require('../routes/users');
  //var listings = require('../routes/listings');

  app.get('/', d, home.index);
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/users',
                                      failureRedirect: '/' }));
  app.get('/users', d, users.create);
  console.log('Routes Loaded');
  fn();
}

