/* Route Logic for Signup Page */

var express = require('express');
var router = express.Router();
var userDB = require('../db/users.js');

/* Handler for sign up page. Simply render relevant ejs file and errors*/
router.get('/signup', function (req, res) {
  res.render('signup.ejs', {error: (req.query.error ? req.query.error : null)});
});

/* Handler for create account post request. Similar to login handler. Parse out inputs,
 * then do error handling. If everything is valid put entry in DB and go to restaurants page.
 * Otherwise redirect to sign up page. */
router.post('/createaccount', function (req, res) {
  var username = req.body.username; 
  var password = req.body.password;
  var fullname = req.body.fullname; 
  console.log('U: ' + username + ', P: ' + password + ', N: ' + fullname);
  if (!username || username.trim().length <= 0 || !password || 
		  password.trim().length <= 0 || !fullname || fullname.trim().length <= 0) {
    res.redirect('/signup?error=Invalid+Empty+Field');
  } else {
	  username = username.trim();
    userDB.exists(username, function (data, err) {
      if (err) {
        res.redirect('/signup?error=' + err);
      } else if (data){
        res.redirect('/signup?error=Username+Already+Exists');
      } else {
        userDB.add(username, {password: password, fullname: fullname}, function (putData, putErr) {
          if (putErr) {
        	  res.redirect('/signup?error=' + putErr);
          }
          else {
            req.session.isLoggedIn = true;
            req.session.username = username;
            res.redirect('/home');
          }
        });
      }
    });
  }
});



module.exports = router;