$(document).ready(function() {
   $("#mainmenu").mmenu({
      // options
      slidingSubmenus: false,
   }, {
       // configuration
       clone:	'true',
    });

  //set active class for menu items - current page = class active
  var pathname = window.location.pathname;
  var result2 = pathname.substring(/\/.*$/);
  var afterSlash = pathname.lastIndexOf('/');
  result = pathname.substring(afterSlash + 0);
  // console.log(result2)
  if (result == '') {
    var result = '/home';
  } else if (result2 == '/blog/') {
    var result = result2
  } else if (result == '/' || result == '/home') {
    var result = '/home';
  }
  var currentLink = $('#mainmenu > ul').find('li > a[href="'+result+'"]');
  var currentLinkMM = $('#mm-mainmenu > ul').find('li > a[href="'+result+'"]');
  $(currentLink).parent().addClass('active');
  $(currentLinkMM).parent().addClass('active');
});
