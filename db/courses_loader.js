var vogels = require('vogels');
vogels.AWS.config.loadFromPath('config.json');
var coursesModel = require('./courses');
var Courses = coursesModel.Courses;


var test_obj1 = {
  'title': 'cis197',
  'date': '2017-12-01'
};

var test_obj2 = {
  'title': 'cis197',
  'date': '2017-12-03'
};

vogels.createTables(function(err) {
  if (err) {
    console.log('Error creating tables: ', err);
  } else {
    console.log('Table has been created');
    Courses.create([test_obj1, test_obj2], function (err, data) {
      if (err) { 
        console.log(err);
      } else { 
        console.log(data);
      }
    });
  }
});