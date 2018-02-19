$(document).ready(function() {
   $("#mainmenu").mmenu({
      // options
   }, {
       // configuration
       clone:	'true',
    });

  //set active class for menu items - current page = class active
  var pathname = window.location.pathname;
  var afterSlash = pathname.lastIndexOf('/');
  result = pathname.substring(afterSlash + 0);
  if (result == '/') {
    var result = '/home';
  }
  var currentLink = $('#mainmenu > ul').find('li > a[href="'+result+'"]');
  var currentLinkMM = $('#mm-mainmenu > ul').find('li > a[href="'+result+'"]');
  $(currentLink).parent().addClass('active');
  $(currentLinkMM).parent().addClass('active');
});
