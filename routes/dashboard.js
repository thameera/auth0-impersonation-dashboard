var express = require('express');
var passport = require('passport');
var rp = require('request-promise');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

var getOauthToken = function() {
  var data = {
    client_id: process.env.AUTH0_GLOBAL_CLIENT_ID,
    client_secret: process.env.AUTH0_GLOBAL_CLIENT_SECRET,
    grant_type: 'client_credentials'
  };
  return rp.post({
    url: 'https://' + process.env.AUTH0_DOMAIN + '/oauth/token',
    json: true,
    body: data
  }).then(function(res) {
    return res.access_token;
  });
};

var getImpersonationLink = function(token, user_id) {
  var data = {
    protocol: 'oauth2',
    impersonator_id: process.env.IMPERSONATOR_ID,
    client_id: process.env.AUTH0_CLIENT_ID,
    additionalParameters: {
      response_type: 'token',
      scope: 'openid',
      callback_url: process.env.CALLBACK_URL
    }
  };
  return rp.post({
    url: 'https://' + process.env.AUTH0_DOMAIN + '/users/' + user_id + '/impersonate',
    json: true,
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: data
  })
};

/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  if (!req.query || !req.query.id) {
    return res.render('dashboard', { user: req.user });
  }
  // Generate impersonation link
  return getOauthToken()
    .then(function(token) {
      return getImpersonationLink(token, req.query.id);
    })
    .then(function(link) {
      console.log(link);
      return res.render('dashboard', { user: req.user });
    });
});

module.exports = router;
