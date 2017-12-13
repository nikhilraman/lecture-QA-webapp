
var Joi = require('Joi');
var vogels = require('vogels');
vogels.AWS.config.loadFromPath('config.json');
var coursesModel = require('./courses');
var Courses = coursesModel.Courses;
var qDB = require('./questions_ops.js');
var uuidv1 = require('uuid/v1');
var _ = require('lodash');

var courses_get_all = function (route_callback) { 
  Courses.scan().exec(function (err, results) {
    if (err) { 
      route_callback(err, null);
    } else if (results) {
      route_callback(null, _.map(results.Items, 'attrs'));	
    } else { 
      route_callback(null, null);
    }
  });
}

var courses_add = function (key, value, route_callback) { 
  var toAdd = { 
    'title': key,
    'date': value
  }; 

  Courses.create(toAdd, function (err, course) { 
    if (err) {
      route_callback(err, null);
    } else if (course) {
      qDB.add( key + '_' + value, {
        qid: uuidv1(), 
        question: 'Welcome to this Q/A tool for lecture sessions. Add questions using the button above.', 
        author: 'The RP Project',
        answer: 'You can also upvote/downvote questions and answer questions!',
        answerer: 'The RP Team'
      }, function (err, data) {
        if (err) { 
          route_callback(err, null);
        } else { 
          route_callback(null, course); 
        }
      });
    } else { 
      route_callback(null, null);
    }
  });
}

var courses_lookup = function (key, value, route_callback) {
  Courses.get(key, value, function (err, course) {
    if (err) {
      console.log('Error looking up course with key: ' + key);
      route_callback(err, null)
    } else if (course) {
      route_callback(null, course.attrs);
    } else {
      route_callback(null, null);
    }
  });
};

var courseDB = {
   getAll: courses_get_all,
   lookup: courses_lookup,
   add: courses_add
};

module.exports = courseDB;