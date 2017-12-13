var express = require('express');
var router = express.Router();

var qDB = require('../db/questions_ops.js');

router.get('/home/:cid', function (req, res) { 
  if (req.session.isLoggedIn) {
    req.session.course = req.params.cid; 
    var split = req.params.cid.split('_');
    res.render('home.ejs', {course: split[0], date: split[1], error: (req.query.error ? req.query.error : null)});
  }
  else {
    res.redirect('/');
  }
});

module.exports = router;