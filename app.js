/* Main JavaScript file for the project. Sets the route handlers. */

/********************** Setup Code Below ***********************/

/* Use Express */
var express = require('express');
var app = express();
var http = require('http');
/* Create server using express */
var server = http.createServer(app);
var io = require('socket.io');
/* Require modules for session management */
var uuid = require('node-uuid');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var qaRouter = require('./routes/questions');

/********************** Logical Code Below ***********************/

/* Start server listening on port 8080 */
server.listen(8080, function () {
  console.log('Server is running...');
});

/* Create a WebSockets (socket.io) server */
var socketServer = io(server);

/* Generate a random cookie secret for this app */
var generateCookieSecret = function () {
  return 'iamasecret' + uuid.v4();
};

/* Get static resources */
app.use(express.static(__dirname));

/* Set up cookie sessions and body parsing */
app.use(cookieSession({
  name: 'session', 
  secret: generateCookieSecret()
}));
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', loginRouter);
app.use('/', signupRouter);
app.use('/', qaRouter);


var questions = {};
var idCounter = 0; 

socketServer.on('connection', function (socket) {
  // 'socket' is the bi-directional channel between the server and connected client

  //TODO: put socket.io logic here

  socket.emit('here_are_the_current_questions', questions);

  socket.on('add_new_question', function (question) { 
    var newQuestion = { 
      text: question.text,
      answer: '',
      author: socket.id,
      id: idCounter
    };
    questions[idCounter] = newQuestion; 
    idCounter++;
    socketServer.emit('new_question_added', newQuestion);
  });

  socket.on('get_question_info', function (id) { 
    var requestedQ = questions[id]; 
    if (typeof requestedQ === 'undefined') { 
      socket.emit('question_info', null);
    } else { 
      socket.emit('question_info', requestedQ);
    }
  });

  socket.on('add_answer', function (questionUpdate) { 
    var question = questions[questionUpdate.id];
    if (typeof question === 'undefined') { 
      console.log('Cant retrieve proper question!');
    }
    question.answer = questionUpdate.answer; 
    socket.broadcast.emit('answer_added', question);
  });


});
