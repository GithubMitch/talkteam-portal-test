$(document).ready(function() {
  var textboxAdmin = $(".admin_cm");
  var currentPage = $("title").text();

  //Set up Array
  // var items = ['item1', 'item2', 'item3'];
  var nodes = [];







  $( ".admin_cm" ).on( "click", function() {
    // Check HTML with log
    // console.log( $(this).html() );
    // console.log(currentPage);
    console.log(nodes)
  });




  var i= -1;
  $(textboxAdmin).each(function(){
      i++;
      var newClass='textboxAdmin'+i;
      $(this).attr('id',currentPage+ "_" +newClass);
      $(this).attr('contenteditable',"true");
      $(this).val(i);
  });
  textboxAdmin.each(function(node){
    nodes.push(
      "id:" + this.id,
      "text:" + this.innerHTML
    );
  });


  for (var i = 0; i < textboxAdmin.length; i++) {
      // console.log(textboxAdmin[i] , i);
  }

  $( "#admin_SafeButton" ).on( "click", function() {
    console.log( $(this).html() );
  });

  var sendValue = nodes;
  // obj = JSON.parse(nodes);

  // document.getElementById("demo").innerHTML =
  // nodes;
  // document.getElementById("demo").innerHTML =
  // obj.page[0].node + "  +  " + obj.page[2].html;


  console.log(sendValue)



});
