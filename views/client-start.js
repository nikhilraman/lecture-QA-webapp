/* client side code for the start.ejs html code */

$(document).ready(function () {
  

  $('#course-dropdown').on('click', function () { 
    document.getElementById("dropdown-menu").classList.toggle("show");
  }); 

  $('#course-create-btn').on('click', function () { 
    $('#course-create-field').toggle();
  })


});