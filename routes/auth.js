const express = require('express');
const router = express.Router();
const passport = require('passport');

//@desc Auth w/ google
//@route GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

//@desc Google auth callback
//@route GET /auth/google/callback

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// @desc logout user
// @route /auth/logout

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router;
