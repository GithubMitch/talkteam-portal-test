$(document).ready(function() {
  $('#eofbot').on('load', function(){
    var wavy = $(this).contents().find("#wavy");
    var eofbot = $('#eofbot');
    var header = $('#eofbot header');
    botheader = eofbot.contents().find("header", eofbot);
    available = eofbot.contents().find(".botname span", eofbot);
    toggleElements = $(this).contents().find("#input, #minMax, #wavy")
    input =  $(this).contents().find("#input");
    $(toggleElements).bind("touchstart click", function(e) {
        var $this = $(e.target);
        if ($this[0] === input[0] && $('#eofbot').hasClass('active')) {
        } else {
          toggleText();
          activeHeader();
        }
    })
  });

  //ToggleFunctions()
  function toggleText() {
    if (available[0].innerHTML === "available" && !$(eofbot).hasClass('active')) {
      available[0].innerHTML = "Chatting";
    } else {
      available[0].innerHTML = "available";
    }
  }
  function activeHeader() {
    if ( !$('#eofbot').hasClass('active')) {
      $('#eofbot').addClass('active');
      $(botheader[0]).addClass('active');
    } else if ($('#eofbot').hasClass('active')) {
      $('#eofbot').toggleClass('active');
      $(botheader[0]).toggleClass('active');
    } else {
      $(botheader[0]).removeClass('active')
    }
  }
});
