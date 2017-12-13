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
//var uuid = require('node-uuid');
var uuidv4 = require('uuid/v4');
var uuidv1 = require('uuid/v1');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var qaRouter = require('./routes/questions');
var startRouter = require('./routes/start');
var logoutRouter = require('./routes/logout');
var userInfoRouter = require('./routes/userinfo');

var url = require('url');

var qDB = require('./db/questions_ops.js');

/********************** Server Setup Below ***********************/

/* Start server listening on port 8080 */
server.listen(8080, function () {
  console.log('Server is running...');
});

/* Create a WebSockets (socket.io) server */
var socketServer = io(server);

/********************** App Routing Below ***********************/

/* Generate a random cookie secret for this app */
var generateCookieSecret = function () {
  return 'iamasecret' + uuidv4();
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
app.use('/', startRouter);
app.use('/', logoutRouter);
app.use('/', userInfoRouter);


/********************** Socket.io connection handling below ***********************/
var rooms = [];

socketServer.on('connection', function (socket) {
  

  socket.on('get_questions', function(info) { 
    console.log('Socket server handling get question req with info: ');
    console.log(info);
    if (!socket.room) { 
      rooms.push(info.cid);
      socket.room = info.cid;
      socket.username = info.username;
      socket.join(info.cid);
    }
    qDB.getQuestions(info.cid, function (err, data) {
      console.log('Socket server retrieving questions for cid: ' + info.cid);
      if (err) { 
        console.log('Error getting questions!');
      } else if (data) { 
        console.log('Socket server Retrieved question list: ');
        console.log(data);
        socket.emit('here_are_the_current_questions', data); // send questions to this room jk TODO: send just back to socket
      } else { 
        console.log('Db request for questions turned up nothing!');
      }
    });
  })
  
  socket.on('disconnect', function() {
    socket.leave(socket.room);
  });


  socket.on('add_new_question', function (question) { 
    var newQuestion = {
      cid: question.cid,
      qid: uuidv1(),
      question: question.question,
      author: question.author,
      votes: 0,
      answer: ''
    };
    // emit to same room
    socketServer.to(question.cid).emit('new_question_added', newQuestion);
    // add to db 
    qDB.add(question.cid, newQuestion, function (err, data) { 
      if (err) { 
        console.log('Error adding new question to DB: ' + err); 
      } else { 
        console.log('Question successfully added to DB');
      }
    });
  });

  socket.on('add_answer', function (questionUpdate) { 
    socketServer.to(questionUpdate.cid).emit('answer_added', questionUpdate);
    /* update db */
    qDB.addAnswer(questionUpdate, function (err, data) { 
      if (err) { 
        console.log('Error updating question answer in DB: ' + err); 
      } else { 
        console.log('Question successfully updated in DB');
      }
    });
  });

  socket.on('upvote', function (info) { 
    socketServer.to(info.cid).emit('increase_votes', info.qid);
    /* update db */
    qDB.upvote(info, function (err, data) { 
      if (err) { 
        console.log('Error updating question votes in DB: ' + err); 
      } else { 
        console.log('Question successfully updated in DB');
      }
    });
  });

  socket.on('downvote', function (info) { 
    socketServer.to(info.cid).emit('decrease_votes', info.qid);
    /* update db */
    qDB.downvote(info, function (err, data) { 
      if (err) { 
        console.log('Error updating question votes in DB: ' + err); 
      } else { 
        console.log('Question successfully updated in DB');
      }
    });
  });


});
