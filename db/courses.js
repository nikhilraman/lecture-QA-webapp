var Joi = require('Joi');
var vogels = require('vogels');

var Courses = vogels.define('rpp_course', {
  hashKey : 'title',
  rangeKey: 'date',
  schema : {
    title : Joi.string(),
    date : Joi.string()
  }
});

var model = {
  Courses: Courses
};
                                        
module.exports = model;                                        
