// This file contains client (aka browser) side code. Please don't modify the below line;
// it is a flag for our linter.
/* global $, io */

$(document).ready(function () {
  // This code connects to your server via websocket;
  // please don't modify it.
  window.socketURL = 'http://localhost:8080';

  window.socket = io(window.socketURL);

  window.socket.on('connect', function () {
    console.log('Connected to server!');
  });

  // The below two functions are helper functions you can use to
  // create html from a question object.
  // DO NOT MODIFY these functions - they're meant to help you. :)
  window.makeQuestion = function (question) {
    var html = '<div data-question-id="' + question.id + '" class="question"><h1>Question ' + '<span class="qid">' + question.id + '</span>' + '</h1><p class="the-question">' +
      question.text + '</p><br><p>Asked by Socket user ID: <span class="socket-user">' +
      question.author + '</p></div><div class="answer"><h1>Answer</h1><p>' +
      '<div class="form-group"><textarea class="form-control" rows="5" id="answer">' +
      question.answer + '</textarea></div></p><button class="btn btn-default" id="update-answer">Add Answer</button></div>';
    return html;
  };

  window.makeQuestionPreview = function (question) {
    var html = [
      '<li data-question-id="' + question.id + '" class="question-preview"><h1><span class="preview-content">' +
      question.text + '</span></h1><p><em>Author: ' + question.author + '</em></p>'
    ];
    html.join('');
    return html;
  };

  // handler to hide the add question modal when the 'close' button is clicked.
  $('#closeModal').on('click', function () {
    $('#questionModal').modal('hide');
    console.log('QUESTION MODAL CLOSED!!');
  });

  // You will now need to implement both socket handlers,
  // as well as click handlers. 

  $('#submitQuestion').on('click', function () { 
    console.log('QUESTION SUBMITTED!!');
    var textEntered = $('#question-text').val(); 
    // if len > 0 only? 
    if (textEntered.length > 0) { 
      console.log('Emitting message!');
      window.socket.emit('add_new_question', { text: textEntered});
    }
    
  });

  window.socket.on('here_are_the_current_questions', function (questions) { 
    var keys = Object.keys(questions); 
    var $qList = $('.question-list');
    for (var i = 0; i < keys.length; i++) { 
      var html = window.makeQuestionPreview(questions[keys[i]]); 
      $qList.prepend(html);
    }
  });

  window.socket.on('new_question_added', function (question) { 
    var html = window.makeQuestionPreview(question); 
    $('.question-list').prepend(html);
  });

  $('.question-list').on('click', '.question-preview', function () {
    var $el = $(this);
    var id = $el.attr('data-question-id');
    window.socket.emit('get_question_info', Number(id));
  });

  window.socket.on('question_info', function (question) { 
    if (question != null) { 
      var html = window.makeQuestion(question); 
      $('.question-view').html(html);
    }
  }); 

  $('.question-view').on('click', '#update-answer', function () { 
    console.log('Adding answer!!');
    var parent = $(this).parent();
    var textEntered = parent.find('#answer').val();
    var qID = parent.prev().attr('data-question-id'); 
    var answerO = { 
      answer: textEntered,
      id: Number(qID)
    };
    console.log(answerO);
    window.socket.emit('add_answer', answerO);
    parent.find('#answer').val(textEntered); 
  });

  window.socket.on('answer_added', function (question) { 
    var currentID = $('.question-view').find('.question').attr('data-question-id');
    if (Number(currentID) === question.id) { 
      var html = window.makeQuestion(question); 
      $('.question-view').html(html);
    }
  });

});








