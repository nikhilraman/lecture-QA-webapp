// This file contains client (aka browser) side code. Please don't modify the below line;
// it is a flag for our linter.
/* global $, io */

$(document).ready(function () {
  // This code connects to your server via websocket;
  // please don't modify it.
  window.socketURL = 'http://localhost:8080';

  window.socket = io(window.socketURL);

  var local_questions = [];
  var local_cid = '';
  var local_username = '';
  var local_info = {};


  window.socket.on('connect', function () {
    console.log('Connected to server!');
    $.getJSON('/userinfo', function(info) { 
      local_username = info.username;
      local_cid = info.cid;
      console.log('User info retrieved on client!! username: ' + local_username + ', cid: ' + local_cid);
      console.log(info);
      local_info = {cid: local_cid, username: local_username};
      window.socket.emit('get_questions', local_info);
    });
  });

  var local_questions = [];

  // The below two functions are helper functions you can use to
  // create html from a question object.
  // DO NOT MODIFY these functions - they're meant to help you. :)
  window.makeQuestion = function (question) {
    var html = '<div data-question-id="' + question.qid + '" class="question"><h1><span class="qid" style="font-size:50%;color:gray">Question ID: ' + question.qid + '</span>' + '</h1><p class="the-question">' +
      question.question + '</p><br><p>Asked by User: <span class="socket-user">' +
      question.author + '</p></div><div class="answer"><h1>Answer</h1><p>' +
      '<div class="form-group"><textarea class="form-control" rows="5" id="answer">' +
      '' + '</textarea></div></p><button class="btn btn-default" id="update-answer">Add Answer</button></div>';
    return html;
  };

  window.makeQuestionAnswered = function (question) {
    var html = '<div data-question-id="' + question.qid + '" class="question"><h1><span class="qid" style="font-size:50%;color:gray">Question ID: ' + question.qid + '</span>' + '</h1><p class="the-question">' +
      question.question + '</p><br><p>Asked by Socket user ID: <span class="socket-user">' +
      question.author + '</p></div><div class="answer"><h1>Answer</h1><p>' + question.answer +
      '</p><br><p>Answered by User: <span class="socket-user">' + question.answerer + '</p></div>';
    return html;
  };

  window.makeQuestionPreview = function (question) {
    var html = [
      '<li id="' + question.qid + '" class="question-preview"><h1><span class="preview-content">' +
      question.question + '</span></h1><p><em>Author: ' + question.author + 
      '</em></p><p><button class="btn btn-default votes" id="upvote">Upvote</button><button class="btn btn-default votes" id="downvote">Downvote</button><span class="vote-label">Votes: </span><span class="vote-number">' + question.votes + '</span></p></li>'
    ];
    html.join('');
    return html;
  };

  /* handler to hide the add question modal when the 'close' button is clicked. */
  $('#closeModal').on('click', function () {
    $('#questionModal').modal('hide');
    console.log('QUESTION MODAL CLOSED!!');
  });

  /* handler for new questions */
  $('#submitQuestion').on('click', function () { 
    console.log('QUESTION SUBMITTED!!');
    var textEntered = $('#question-text').val(); 
    // if len > 0 only? 
    if (textEntered.length > 0) { 
      console.log('Emitting message!');
      window.socket.emit('add_new_question', { question: textEntered, author: local_username, cid: local_cid });
      $('#question-text').val('');
    }
  });

  window.socket.on('here_are_the_current_questions', function (questions) { 
    console.log('received questions!');
    local_questions = questions;
    var $qList = $('.question-list');
    for (var i = 0; i < questions.length; i++) { 
      var html = window.makeQuestionPreview(questions[i]); 
      $qList.prepend(html);
    }
  });

  window.socket.on('new_question_added', function (question) { 
    local_questions.push(question);
    var html = window.makeQuestionPreview(question); 
    $('.question-list').prepend(html);
  });

  

  window.socket.on('question_info', function (question) { 
    if (question != null) { 
      var html = '';
      if (question.answerer) { 
        html = window.makeQuestionAnswered(question);
      } else { 
        html = window.makeQuestion(question); 
      }
      $('.question-view').html(html);
    }
  }); 

  var displayQuestion = function (question) { 
    if (question != null) { 
      var html = '';
      if (question.answerer) { 
        html = window.makeQuestionAnswered(question);
      } else { 
        html = window.makeQuestion(question); 
      }
      $('.question-view').html(html);
    }
  }

  $('.question-view').on('click', '#update-answer', function () { 
    console.log('Adding answer!!');
    var parent = $(this).parent();
    var textEntered = parent.find('#answer').val();
    var qID = parent.prev().attr('data-question-id'); 
    // var answerO = { 
    //   answer: textEntered,
    //   answerer: local_username,
    //   cid: local_cid,
    //   qid: qID
    // };
    var myQ = local_questions.find( function (element) {
      return element.qid === qID;
    });
    myQ.answer = textEntered;
    myQ.answerer = local_username;
    console.log(myQ);
    window.socket.emit('add_answer', myQ);
    //parent.find('#answer').val(textEntered); // why am I doing this?
  });



  $('.question-list').on('click', '.question-preview', function () {
    console.log('clicked');
    var $el = $(this);
    var id = $el.attr('id');
    var myQ = local_questions.find( function (element) {
      return element.qid === id;
    });
    displayQuestion(myQ);
    //window.socket.emit('get_question_info', Number(id)); // instead of asking server we can use local cache
  });

  window.socket.on('answer_added', function (question) { 
    var currentID = $('.question-view').find('.question').attr('data-question-id');
    if (currentID === question.qid) { 
      var html = '';
      console.log('Preparing Answer!!');
      if (question.answerer) { 
        html = window.makeQuestionAnswered(question);
      } else { 
        html = window.makeQuestion(question); 
      }
      $('.question-view').html(html);
    }
    var myQ = local_questions.find( function (element) {
      return element.qid === question.qid;
    });
    myQ.answer = question.answer;
    myQ.answerer = question.answerer;
  });

  $('.question-list').on('click', '#upvote', function (event) { 
    event.stopPropagation();
    console.log('Upvoted!!');
    var $parent = $(this).parent().parent();
    var id = $parent.attr('id');
    console.log('Found id: ' + id);
    window.socket.emit('upvote', {cid: local_cid, qid: id});
  });

  window.socket.on('increase_votes', function(id) { 
    var $elt = $('.question-list').find( ("#" + id + " .vote-number") ); 
    var oldVal = $elt.text(); 
    var newVal = 1 + Number(oldVal);
    $elt.text(newVal);
    // update cache
    var myQ = local_questions.find( function (element) {
      return element.qid === id;
    });
    myQ.votes = myQ.votes + 1;
  }); 

  $('.question-list').on('click', '#downvote', function (event) { 
    event.stopPropagation();
    console.log('Downvoted!!');
    var $parent = $(this).parent().parent();
    var id = $parent.attr('id');
    console.log('Found id: ' + id);
    window.socket.emit('downvote', {cid: local_cid, qid: id});
  });

  window.socket.on('decrease_votes', function(id) { 
    console.log('Decreasing vote nums!');
    var $elt = $('.question-list').find( ("#" + id + " .vote-number") ); 
    var oldVal = $elt.text();
    console.log(Number(oldVal)); 
    var newVal = (Number(oldVal) - 1) + "";
    $elt.text(newVal);
    // update cache
    var myQ = local_questions.find( function (element) {
      return element.qid === id;
    });
    myQ.votes = myQ.votes - 1;
  }); 

});








