var express = require('express');
var router = express.Router();

var coursesDB = require('../db/courses_ops.js');


router.get('/start', function (req, res) { 
  if (req.session.isLoggedIn) {
    coursesDB.getAll(function (err, data) {
      if (err) { 
        console.log('Error getting courses!');
      } else if (data) { 
        console.log('Retrieved course list for start dropdown: ');
        console.log(data);
        res.render('start.ejs', {courses: data, error: (req.query.error ? req.query.error : null)});
      } else { 
        console.log('Db request for courses turned up nothing!');
      }
    });
  }
  else {
    res.redirect('/');
  }
});

router.post('/checkcourse', function (req, res) { 
  console.log('Reached Check Course Post method!!');
  var name = req.body.name; 
  name = name.replace(/\s/g,'').toLowerCase() + '';
  var date = '' + req.body.date; 
  console.log('Checking course: ' + name + ' -- ' + date);
  coursesDB.lookup(name, date, function (err, data) { 
    console.log(data);
    if (err) { 
      console.log('Error in lookup!');
      res.redirect('/start?error=' + err);
    } else if (data) { 
      res.redirect('/start?error=Course+Already+Exists');
    } else { 
      coursesDB.add(name, date, function (addErr, addData) { 
        if (addErr) { 
          console.log('Error in adding to DB');
          res.redirect('/start?error=' + addErr);
        } else if (addData) { 
          var cid = name + '_' + date;
          res.redirect('/home/' + cid);
        } else { 
          console.log('Trouble adding new course');
        }
      });
    }
  })
});

module.exports = router;