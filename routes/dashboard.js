var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var router = express.Router();

/* GET user profile. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  if (!req.query || !req.query.id) {
    return res.render('dashboard', { user: req.user });
  }
  // Generate impersonation link
});

module.exports = router;
