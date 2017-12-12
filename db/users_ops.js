
var Joi = require('Joi');
var vogels = require('vogels');
vogels.AWS.config.loadFromPath('config.json');
var usersModel = require('./users');
var Users = usersModel.Users;

var users_lookup = function (key, route_callback) {
  Users.get(key, function (err, usr) {
    if (err) {
      route_callback(err, null)
    } else if (usr) {
      route_callback(err, usr.attrs);
    } else {
      route_callback(null, null);
    }
  });
};

var users_add = function (toAdd, route_callback) {
  Users.create(toAdd, function (err, usr) {
    if (err) {
      route_callback(err, null);
    } else if (usr) {
      route_callback(null, usr);
    } else { 
      route_callback(null, null);
    }
  });
};

var userDB = {
   lookup: users_lookup,
   add: users_add
};

module.exports = userDB;
