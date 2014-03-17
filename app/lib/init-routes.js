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
  var bounce = require('../lib/bounce-user');
  var User = require('../models/user');
  passport.serializeUser(function(user, done){
    done(null, user);
  });

  passport.deserializeUser(function(obj, done){
    done(null, obj);
  });

  passport.use(new FacebookStrategy({
      clientID: '1430897753818675',
      clientSecret: 'a1a805afc58ab0421b780187acd29a66',
      callbackURL: 'http://192.168.11.98:4009/auth/facebook/callback'
    },

    function(accessToken, refreshToken, profile, done){
   
      process.nextTick(function() {

        User.findByFacebookId(profile.id.toString(), function(user){
          if(user){
            return done(null, user);
          }else{
            var newUser = new User({});
            newUser.facebookId = profile.id;
            newUser.name = profile.displayName;
            newUser.insert(function(user){
              return done(null, user);
            });
          }
        });
      });
    }
  ));

  var home = require('../routes/home');
  var users = require('../routes/users');
  var listings = require('../routes/listings');

  app.get('/', d, home.index);

  //facebook auth//
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback', d,
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    //Successful authentication, redirect home.
    res.redirect('/listings');
  });
  app.get('/listings', d, listings.index);
  app.get('/testArtist', d, users.testLoginArtist);
  app.get('/testOwner', d, users.testLoginOwner);
  app.post('/listings', d, listings.create);
  app.get('/listings/new', ensureAuthenticated, bounce, listings.new);
  app.post('/updateUser', d, users.create);
  app.get('/updateUser', d, /*ensureAuthenticated,*/ users.update);
  app.get('/listings/filter', d, listings.new);
  app.post('/listings/reserve', d, listings.reserve);
  app.get('/listings/query', d, listings.query);
  app.get('/listings/:id', d, /*ensureAuthenticated, bounce,*/ listings.show);
  app.del('/listings/:id', d, /*ensureAuthenticated,*/ listings.destroy);
  app.get('/users/:id', d, /*ensureAuthenticated, bounce,*/ users.show);
  app.post('/logout', d, users.logout);
  app.get('/logout', function(req, res){
    req.session.destroy(function(){
      res.redirect('/');
    });
  });

  fn();
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}
