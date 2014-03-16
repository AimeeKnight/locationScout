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
      callbackURL: 'http://192.168.15.84:4001/auth/facebook/callback'
    },

    function(accessToken, refreshToken, profile, done){
   
      process.nextTick(function() {

        User.findByFacebookId(profile.id, function(err, user){
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
  app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    //Successful authentication, redirect home.
    res.redirect('/');
  });
  app.get('/listings', d, listings.index);
  app.post('/listings', d, listings.create);
  app.get('/listings/new', d, listings.new);
  app.get('/listings/filter', d, listings.new);
  app.post('/listings/reserve', d, listings.reserve);
  app.get('/listings/:id', d, listings.show);
  app.del('/listings/:id', d, listings.destroy);
  //app.post('/listings/rent/:id', d, listings.rent);
  app.get('/users', d, users.create);
  app.get('/users/:id', d, users.show);
  app.post('/logout', d, users.logout);



  fn();
}

