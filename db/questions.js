var Joi = require('Joi');
var vogels = require('vogels');

var Questions = vogels.define('rpp_question', {
  hashKey: 'cid',
  rangeKey: 'qid', 
  schema : {
    cid: Joi.string(),
    qid: vogels.types.uuid(),
    question: Joi.string(),
    author: Joi.string(),
    votes: Joi.number(), 
    answer: Joi.string().allow(null),
    answerer: Joi.string().allow(null)
  },

  indexes: [{
    hashKey: 'cid', rangeKey: 'votes', type: 'local', name: 'votesIndex'
  }]
});

var model = {
  Questions: Questions
};
                                        
module.exports = model;                                        
