var vogels = require('vogels');
vogels.AWS.config.loadFromPath('config.json');
var qModel = require('./questions');
var Questions = qModel.Questions;


var test_obj1 = {
  'cid': 'cis197_2017-12-01',
  'question': 'Test test test!',
  'author': 'mickey',
  'votes': 0
};

var test_obj2 = {
  'cid': 'cis197_2017-12-01',
  'question': 'West west west!',
  'author': 'nikkkkk',
  'votes': 0
};

var test_obj3 = {
  'cid': 'cis197_2017-12-03',
  'question': 'Lest lest lest!',
  'author': 'mickey',
  'votes': 0
};

vogels.createTables(function(err) {
  if (err) {
    console.log('Error creating tables: ', err);
  } else {
    console.log('Table has been created');
    Questions.create([test_obj1, test_obj2, test_obj3], function (err, data) { 
      if (err) { 
        console.log(err);
      } else { 
        console.log('Created questions in db', data);
      }
    });
  }
});