/* This program connects to AWS DynamoDB and sets up some initial tables. One for storing users and their login info. 
Another for storing users and their recent class sessions. Another for storing class sessions and their q/a logs. */

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

var db = new AWS.DynamoDB();
var kvs = require('./db/keyvaluestore.js');

var usersTableName = 'rp_users';
var userLecturesTableName = 'rp_users_lectures';
var lectureTableName = 'rp_lectures';


var sampleUser = "nik"; 
var sampleUserInfo = { 
  password: "nack",
  fullname: "Nikhil Raman"
};

var uploadSampleUser = function(userDB, callback) {
  console.log('Adding user: ' + sampleUser); 
  userDB.put(sampleUser, JSON.stringify(sampleUserInfo), function (err, data) { 
    if (err) { 
      console.log('Oops, error when adding user "' + sampleUser + '": ' + err);
    }
  });
  callback();
};

/* It is a bit messy, but below we define a setup funtcion that recursively calls 
itself in order order to setup the aforementioned tables */

var i = 0;
function setup(err, data) {
  i++;
  if (err && i != 2) {
    console.log('Error: ' + err); 
  } else if (i == 1) {
    console.log('Deleting table ' + usersTableName + ' if it already exists...');
    params = {
        "TableName": usersTableName
    };
    db.deleteTable(params, function(){
      console.log('Waiting 10s for the table to be deleted...');
      setTimeout(setup,10000);
    });
  } else if (i == 2) {
    console.log('Creating table ' + usersTableName + '...');
    table = new kvs(usersTableName);
    table.init(setup);
  } else if (i == 3) {
    console.log('Waiting 30s for the table to become active...');
    setTimeout(setup, 30000); 
  } else if (i == 4) {
    console.log('Uploading');
    uploadSampleUser(table, function() {
      console.log('Done uploading!');
    });
  }
}



// call the setup function 
setup(null,null);