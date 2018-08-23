$(document).ready(function() {
  if (document.cookie === "accepted=yes") {
    $(".cookieWall").remove();
  }
  $(".cookieWall button").on('click', function (){
    document.cookie = "accepted=yes";
    $(".cookieWall").remove();
  })
});
