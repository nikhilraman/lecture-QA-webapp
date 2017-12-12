var Joi = require('Joi');
var vogels = require('vogels');

var Users = vogels.define('rpp_user', {
  hashKey : 'username',
  schema : {
    username : Joi.string(),
    password : Joi.string(),
    fullname : Joi.string()
  }
});

var model = {
  Users: Users
};
                                        
module.exports = model;                                        
