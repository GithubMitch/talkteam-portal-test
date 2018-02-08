$(document).ready(function() {
  var node = $(".admin_cm");
  var currentPage = $("title").text();
  var cmsNodes = [];
  var jsonParser = $("#jsonParser");
  i= -1;
  //Apply Changes & Flush _jsonRequestedData
  function applyChanges() {
    for (var i = 0; i < cmsNodes.length; i++) {
      var applyDomFragment = domJSON.toDOM(_jsonParsedData.cmsNodes[0]);
      $(someDOMElement0).replaceWith(applyDomFragment);
      console.log(cmsNodes[i]);
    };



    $('#jsonConverter').removeAttr("value");
  }





  if($('#jsonConverter').attr("value") != '') {
    var _jsonRequestedData = $('#jsonConverter').attr("value");
    var _jsonParsedData = JSON.parse(_jsonRequestedData);
    console.log($('#jsonConverter').attr("value"));
    console.log(_jsonParsedData.cmsNodes);


  }


  $(node).each(function(){
      i++;
      var newClass='textboxAdmin'+i;
      $(this).attr('id',currentPage+ "_" +newClass);
      $(this).attr('contenteditable',"true");
  });


   $( "#admin_ApplyButton" ).on( "click", function() {
     $(node).each(function(){
         i++;
         var jsonNode = domJSON.toJSON(this, {
           attributes: ['id'],
           metadata: false,
           domProperties: {
               exclude: true,
               values: ['id']
           },
           serialProperties: {
             exclude: true,
             values: ['innerHTML']
           },
           deep: 0,
           stringify: false
         });
         //push json string to jsonNodes Array
         cmsNodes.push(jsonNode);
     });


     jsonFile = {
         "page":currentPage,
         cmsNodes
      };
      // console.log(JSON.stringify(jsonFile))

      $(jsonParser).attr("value",JSON.stringify(jsonFile));

     var snapFragment = JSON.stringify(jsonFile);
     // console.log(snapFragment)
     // $(someDOMElement0).replaceWith(snapFragment);
   });

   $( "#admin_SafeButton" ).on( "click", function() {
     var snapFragment = $(jsonParser).val();
     var dbFragment = JSON.stringify(dbFragment);
     // console.log(snapFragment)
   });

  // var someDOMElement0 = document.getElementById('home_textboxAdmin0');
  // var someDOMElement1 = document.getElementById('home_textboxAdmin1');
  // var jsonOutput = domJSON.toJSON(someDOMElement1, {
  //   attributes: ['id'],
  //   metadata: true,
  //   domProperties: {
  //       exclude: true,
  //       values: ['id']
  //   },
  //   serialProperties: {
  //     exclude: true,
  //     values: ['innerHTML']
  //   },
  //   deep: 0,
  //   stringify: false
  // });
  //
  // $( "#admin_SafeButton" ).on( "click", function() {
  //   console.log( $(this).html() );
  //   console.log( someDOMElement0 );
  //   console.log( domJSON.toDOM(jsonOutput) );
  //   var applyDomFragment = domJSON.toDOM(cmsNodes);
  //   $(someDOMElement0).replaceWith(applyDomFragment);
  // });

});
