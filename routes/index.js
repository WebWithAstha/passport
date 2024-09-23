require('dotenv').config();
var express = require('express');
var router = express.Router();
var userModel = require('../models/userModel.js')

// passport related import
var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');
// var db = require('../db');




// isLoggedIn fuction/middleware
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/');
}




passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: [ 'profile','email' ]
}, async function verify(issuer, profile, cb) {
  const user = await userModel.findOne({email:profile.emails[0].value})
    if (user) {
        cb(null, user)
        return;
    }
    const newUser = await userModel.create({
        username: profile.displayName,
        email: profile.emails[0].value,
    })
    cb(null, newUser)
}));


























/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/home', isLoggedIn, function(req, res, next) {
  res.render('home.ejs');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/login/federated/google', passport.authenticate('google'));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/home',
  failureRedirect: '/'
}));

module.exports = router;
