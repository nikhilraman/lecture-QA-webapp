/* Route Logic for Login Page */

var express = require('express');
var router = express.Router();
var userDB = require('../db/users.js');

router.get('/', function (req, res) { 
  res.render('login.ejs', {
	usernameError: (req.query.uError ? req.query.uError : null), 
	passwordError: (req.query.pError ? req.query.pError : null)
  });
});

/* Handler for the check login POST request. */
router.post('/checklogin', function (req, res) { 
  var username = req.body.username; 
  var password = req.body.password; 
  /* Give appropriate feedback if any fields are empty */
  if (!username || username.trim().length <= 0 || !password || password.trim().length <= 0) {
    var redirectString = ''; 
    if (!username || username.length <= 0) {
      redirectString += 'uError=Empty+Username';
      if (!password || password.length <= 0) {
        redirectString += '&';
      }
    }
    if (!password || password.length <= 0) {
      redirectString += 'pError=Empty+Password';
    }
    res.redirect('/?' + redirectString);
    return;
  }
  /* Give appropriate feedback if username/password is invalid. 
   * Otherwise, redirect to the restaurants page. */
  userDB.get(username, function (data, err) { 
    if (err) { 
      res.redirect('/?uError=' + err);	
    } else if (data === null) {
      res.redirect('/?uError=Invalid+Username');
    } else { 
      if (password === data.password) { 
        req.session.isLoggedIn = true;
        req.session.username = username;
        res.redirect('/home');
      }
      else {
        res.redirect('/?pError=Invalid+Password');
      }
    }
  }); 
});

module.exports = router;



