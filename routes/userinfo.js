

var express = require('express');
var router = express.Router();

router.get('/userinfo', function (req, res) { 
  var info = { 
    username: req.session.username,
    cid: req.session.course
  }
  res.send(JSON.stringify(info));
});


module.exports = router;