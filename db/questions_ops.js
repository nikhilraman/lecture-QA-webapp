
var Joi = require('Joi');
var vogels = require('vogels');
vogels.AWS.config.loadFromPath('config.json');
var questionsModel = require('./questions');
var Questions = questionsModel.Questions;
var _ = require('lodash');

var questions_get_all = function (key, route_callback) {
  Questions.query(key).usingIndex('votesIndex').descending().exec(function (err, questions) {
    if (err) {
      route_callback(err, null)
    } else if (questions) {
      route_callback(null, _.map(questions.Items, 'attrs'));
    } else {
      route_callback(null, null);
    }
  });
};

var questions_add = function (key, value, route_callback) {
  var toAdd = {
    'cid': key,
    'question': value.question,
    'author': value.author,
    'votes': 0,
  };

  if (value.answer) { 
  	toAdd['answer'] = value.answer; 
  	toAdd['answerer'] = value.answerer; 
  }

  Questions.create(toAdd, function (err, q) {
    if (err) {
      route_callback(err, null);
    } else {
      route_callback(null, q);
    }
  });
};

var userDB = {
   getQuestions: questions_get_all,
   add: questions_add
};

module.exports = userDB;
