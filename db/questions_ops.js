
var Joi = require('Joi');
var vogels = require('vogels');
vogels.AWS.config.loadFromPath('config.json');
var questionsModel = require('./questions');
var Questions = questionsModel.Questions;
var _ = require('lodash');

var questions_get_all = function (key, route_callback) {
  Questions.query(key).usingIndex('votesIndex').ascending().exec(function (err, questions) {
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
    'qid': value.qid,
    'question': value.question,
    'author': value.author,
    'votes': 0,
  };

  if (value.answer) { 
  	toAdd['answer'] = value.answer; 
  }
  if (value.answerer) { 
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

var questions_add_answer = function (answerObj, route_callback) { 
  var updateObj = { 
    cid: answerObj.cid,
    qid: answerObj.qid,
    answer: answerObj.answer,
    answerer: answerObj.answerer
  }

  Questions.update(updateObj, function (err, data) { 
    if (err) { 
      route_callback(err, null); 
    } else { 
      route_callback(null, data);
    }
  });
}

var questions_downvote = function (info, route_callback) { 
  var updateObj = { 
    cid: info.cid,
    qid: info.qid,
    votes: {$add : -1}
  }

  Questions.update(updateObj, function (err, data) { 
    if (err) { 
      route_callback(err, null); 
    } else { 
      route_callback(null, data);
    }
  });
}

var questions_upvote = function (info, route_callback) { 
  var updateObj = { 
    cid: info.cid,
    qid: info.qid,
    votes: {$add : 1}
  }

  Questions.update(updateObj, function (err, data) { 
    if (err) { 
      route_callback(err, null); 
    } else { 
      route_callback(null, data);
    }
  });
}

var qDB = {
   getQuestions: questions_get_all,
   add: questions_add,
   upvote: questions_upvote,
   downvote: questions_downvote,
   addAnswer: questions_add_answer
};

module.exports = qDB;
