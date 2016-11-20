var express = require('express');
var passport = require('passport');
var router = express.Router();

var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN
};

var getCallbackURL = function(req) {
	return req.protocol + '://' + req.get('host') + '/callback';
};

/* GET home page. */
router.get('/', function(req, res, next) {
	env.AUTH0_CALLBACK_URL = getCallbackURL(req);
  res.render('index', { title: 'Auth0 Impersonation Dashboard', env: env });
});

router.get('/login',
  function(req, res){
		env.AUTH0_CALLBACK_URL = getCallbackURL(req);
    res.render('login', { env: env });
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  function(req, res) {
    if (req.user.id !== process.env.IMPERSONATOR_ID) {
      req.logout();
      return res.redirect('/');
    }
    res.redirect(req.session.returnTo || '/dashboard');
  });


module.exports = router;
