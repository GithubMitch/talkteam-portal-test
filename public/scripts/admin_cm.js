$(document).ready(function() {
  var node = $(".admin_cm");
  var currentPage = $("title").text();
  var cmsNodes = [];
  var jsonParser = $("#jsonParser");
  i= -1;

  var cmsRow = $(".intro");
  // for (var i = 0; i < cmsNodes.length; i++) {
  //   var applyDomFragment = domJSON.toDOM(jsonParsedData.cmsNodes[i]);
  //   console.log(applyDomFragment);
  // };




  $(node).each(function(){
      i++;
      var newClass='textboxAdmin'+i;
      $(this).attr('id',currentPage+ "_" +newClass);
      $(this).attr('contenteditable',"true");
  });


   $( "#admin_ApplyButton" ).on( "click", function() {
     $(node).each(function(){
         // i++;
         var jsonNode = domJSON.toJSON(this, {
           attributes: ['id'],
           metadata: true,
           domProperties: {
               exclude: true,
               values: ['id']
           },
           serialProperties: {
             exclude: true,
             values: ['innerHTML']
           },
           deep: true,
           stringify: false
         });
         //push json string to cmsNodes Array
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
  if($('#jsonConverter').attr("value") != '') {
    var jsonRequestedData = document.getElementById("jsonConverter").getAttribute("value");
    var jsonParsedData = JSON.stringify(jsonRequestedData);
    // var jsonRequestedData = $('#jsonConverter').attr("value");
    // $('home_textboxAdmin0').replaceWith(domJSON.toDOM(jsonParsedData.cmsNodes[0]));
    var jsonOutput = JSON.parse(jsonRequestedData);
    var getcmsNodes = jsonOutput;
    var getcmsNodesString = "'"+getcmsNodes+"'"
    var parsedNodes = JSON.stringify(getcmsNodesString);

    var json = (jsonOutput.cmsNodes);
    console.log(json);
    // $(cmsRow).prepend(domJSON.toDOM(parsedNodes));

    // console.log("'"+getcmsNodes+"'");
    console.log((jsonOutput.cmsNodes));

    var buildObj = domJSON.toDOM(getcmsNodes, {
      noMeta: true
    });
    // console.log( buildObj );
    //
    // $(cmsRow).prepend(buildObj)
    // console.log(jsonOutput);
    // console.log(jsonOutput.cmsNodes[0]);

    $.each(getcmsNodes.cmsNodes, function(i, object) {
      // var buildObj = domJSON.toDOM(object);
      var parseElement = domJSON.toDOM(this);
      // node[i].parentNode.replaceChild(parseElement, node[i]);
      node[i].parentNode.replaceChild(parseElement, node[i]);
      console.log(node[i])
      console.log(parseElement)
      $.each(object, function() {


      });
    });

    // console.log(jsonParsedData.cmsNodes);
    // expected output: 42
    // var applyDomFragment = domJSON.toDOM(jsonParsedData.cmsNodes[0]);
    // var _toJson
    // var applyfragment = domJSON.toDOM(jsonParsedData);
    // console.log($('#jsonConverter').attr("value"));
    // console.log(jsonParsedData.cmsNodes);
    // var applyDomFragment = domJSON.toDOM(jsonParsedData);
    // $(node).each(function(){
    //   $(this).remove();
    // });
    // $(cmsRow).prepend(domJSON.toDOM(applyDomFragment));

    // console.log(applyfragment);
    //Apply Changes & Flush jsonRequestedData


    // for (var i = 0; i < cmsNodes.length; i++) {
    // $(node).each(function(){
    //   console.log(node)
    //
    //   // $(this).replaceWith(applyDomFragment);
    //   // console.log(applyDomFragment);
    // });
    console.log("Applied snapshot values");
    // $('#jsonConverter').removeAttr("value");
    // $('#jsonConverter').remove();

    console.log("Flushed DOM snapshot values");
  };
});
