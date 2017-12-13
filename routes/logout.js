/* Routing logic for handling simple logout request */

var express = require('express');
var router = express.Router();


router.get('/logout', function (req, res) { 
  //req.session.destroy();
  req.session = null;
  res.redirect('/');
});


module.exports = router;