var express = require('express');
var router = express.Router();

var qDB = require('../db/questions_ops.js');

router.get('/home/:cid', function (req, res) { 
  if (req.session.isLoggedIn) {
    req.session.course = req.params.cid; 
    var split = req.params.cid.split('_');
    res.render('home.ejs', {course: split[0], date: split[1], error: (req.query.error ? req.query.error : null)});
    // qDB.getQuestions(req.params.cid, function (err, data) {
    //   if (err) { 
    //     console.log('Error getting questions!');
    //   } else if (data) { 
    //     console.log('Retrieved question list');
    //     console.log(data);
    //     res.render('home.ejs', {questions: data, error: (req.query.error ? req.query.error : null)});
    //   } else { 
    //     console.log('Db request for questions turned up nothing!');
    //   }
    // });
  }
  else {
    res.redirect('/');
  }
});

module.exports = router;