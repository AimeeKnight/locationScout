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
      callbackURL: 'http://10.0.1.13:4009/auth/facebook/callback'
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

  //--------facebook-Auth----------//
  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get('/auth/facebook/callback', d,
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/listings');
  });

  //--------users----------------//
  app.post('/updateUser', d, ensureAuthenticated, users.create);
  app.get('/updateUser', d, ensureAuthenticated, users.update);
  app.get('/users/:id', d, ensureAuthenticated, bounce, users.show);

  //-------listings--------------//
  app.get('/listings', d, listings.index);
  app.get('/listings/query', d, listings.query);
  app.get('/listings/new', ensureAuthenticated, listings.new);
  app.get('/listings/paging', d, listings.indexPaging);
  app.post('/listings', d, listings.create);
  app.post('/listings/photo/:id', d, listings.addPhoto);
  app.post('/listings/reserve', d, listings.reserve);
  app.post('/logout', d, users.logout);
  app.get('/listings/:id', d, ensureAuthenticated, listings.show);
  app.del('/listings/:id', d, ensureAuthenticated, listings.destroy);

  //-------logout----------------//
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
