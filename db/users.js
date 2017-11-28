var keyvaluestore = require('./keyvaluestore.js');
var kvs = new keyvaluestore('rp_users');
kvs.init(function(err, data){});

var userDB_get = function (key, route_callback){
  console.log('Getting results for: ' + key);	
  kvs.get(key, function (err, data) {
    if (err) {
      route_callback(null, "DB lookup error: "+err);
    } else if (data === null) {
      route_callback(null, null);
    } else {
      route_callback(JSON.parse(data[0].value), null);
    }
  });
};

var userDB_put = function (key, value, route_callback) { 
  console.log('Putting key: ' + key + ', and value: ' + value);
  kvs.put(key, JSON.stringify(value), function (err, data) { 
    if (err) {
	  route_callback(null, "DB put error: "+err);
	} else if (data === null) {
	  route_callback(null, null);
	} else {
	  route_callback(data, null);
    }
  });
}; 

var userDB_exists = function (key, route_callback) {
  console.log('Checking if key: "' + key + '" exists.');
  kvs.exists(key, function (err, data) {
    if (err) {
      route_callback(null, "DB check exists error: " + err);	
    } else if (data === null) { 
      route_callback(false, null);
    } else {
      route_callback(data, null);
    }
  });
};

var userDB = { 
  get: userDB_get,
  add: userDB_put, 
  exists: userDB_exists,
};
                                        
module.exports = userDB;
                                        
