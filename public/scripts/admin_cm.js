$(document).ready(function() {
  var textboxAdmin = $(".admin_cm");
  var currentPage = $("title").text();

  //Set up Array
  // var items = ['item1', 'item2', 'item3'];
  // var nodes = [];

  $( ".admin_cm" ).on( "click", function() {
    // Check HTML with log
    // console.log( $(this).html() );
    // console.log(currentPage);
    // console.log(nodes)
  });

  var i= -1;
  $(textboxAdmin).each(function(){
      i++;
      var newClass='textboxAdmin'+i;
      $(this).attr('id',currentPage+ "_" +newClass);
      $(this).attr('contenteditable',"true");
      $(this).val(i);
  });

  // textboxAdmin.each(function(node){
  //   nodes.push(
  //     "id:" + this.id,
  //     "text:" + this.innerHTML
  //   );
  // });


  for (var i = 0; i < textboxAdmin.length; i++) {
      // console.log(textboxAdmin[i] , i);
  }

  var someDOMElement0 = document.getElementById('home_textboxAdmin0');
  var someDOMElement1 = document.getElementById('home_textboxAdmin1');
  var jsonOutput = domJSON.toJSON(someDOMElement1, {
    attributes: [''],
    metadata: true,
    domProperties: {
        exclude: true,
        values: ['id']
    },
    serialProperties: {
      exclude: true,
      values: ['innerHTML']
    },
    deep: 0,
    stringify: true
  });
  $( "#admin_SafeButton" ).on( "click", function() {
    console.log( $(this).html() );
    console.log( someDOMElement0 );
    console.log( domJSON.toDOM(jsonOutput) );
    var applyDomFragment = domJSON.toDOM(jsonOutput);
    $(someDOMElement0).replaceWith(applyDomFragment);
  });


  // var sendValue = nodes;
  // obj = JSON.parse(nodes);

  // document.getElementById("demo").innerHTML =
  // nodes;
  // document.getElementById("demo").innerHTML =
  // obj.page[0].node + "  +  " + obj.page[2].html;


  // console.log(sendValue)




  // console.log(jsonOutput);
  // console.log(JSON.parse((jsonOutput)));


});
