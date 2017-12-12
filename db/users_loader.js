var vogels = require('vogels');
vogels.AWS.config.loadFromPath('config.json');
var usersModel = require('./users');
var userDB = require('./users_ops.js');


var test_obj = {
  'username': 'mickey',
  'fullname': 'Mickey Mouse',
  'password': 'mouse'
};

vogels.createTables(function(err) {
  if (err) {
    console.log('Error creating tables: ', err);
  } else {
    console.log('Table has been created');
    userDB.add(test_obj, function (err, data) { 
      console.log('Adding test obj to table');
      if (err) { 
        console.log(err);
      } else { 
        console.log(data);
      }
    });
  }
});