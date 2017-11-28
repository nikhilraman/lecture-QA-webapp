var express = require('express');
var router = express.Router();

router.get('/home', function (req, res) { 
  if (req.session.isLoggedIn) {
	res.render('home.ejs');
  }
  else {
    res.redirect('/');
  }
});

module.exports = router;