$(document).ready(function() {
  var node = $(".admin_cm");
  var admin = '';
  if ($("#setAdmin").length) {
    admin = true;
    console.log("admin = true");
  } else {
    admin = false;
    console.log("admin = false");
  }
  var currentPage = $("title").text();
  cmsNodes = [];
  var jsonParser = $("#jsonParser");
  i= -1;

  console.log("Admin Account = ",admin)

  giveCMSClass();


  function giveCMSClass() {
    $(node).each(function(){
      i++;
      var newClass='textboxAdmin'+i;
      $(this).attr('id',currentPage+ "_" +newClass);
    });
  };

  function adminEditable() {
    if (admin === true) {
      $(".admin_cm").each(function(){
        $(this).attr('contenteditable',admin)
      });
    } else {
      $(".admin_cm").each(function(){
        $(this).attr('contenteditable',admin)
      });
    }
  }



   $( "#admin_ApplyButton" ).on( "click", function() {
     cmsNodes = [];

     node = $(".admin_cm");

     $(node).each(function(){
         // i++;
         var jsonNode = domJSON.toJSON(this, {
           attributes: {
             values: ['class', 'id']
           },
           deep: true,
           domProperties: {
             values: ['innerText', 'outerHTML']
           },
           stringify: false,
           serialProperties:  false
         });

         //push json string to cmsNodes Array
         cmsNodes.push(jsonNode);
     });
     jsonFile = {
         "page":currentPage,
         cmsNodes
      };

      console.log(jsonFile);


      $(jsonParser).attr("value",JSON.stringify(jsonFile));

      var snapFragment = JSON.stringify(jsonFile);
   });

   $( "#admin_SafeButton" ).on( "click", function() {
     var snapFragment = $(jsonParser).val();
     var dbFragment = JSON.stringify(dbFragment);
   });

  if($('#jsonConverter').attr("value") != '') {
    var jsonRequestedData = document.getElementById("jsonConverter").getAttribute("value");
    var jsonParsedData = JSON.stringify(jsonRequestedData);

    var jsonOutput = JSON.parse(jsonRequestedData);
    var getcmsNodes = jsonOutput;
    var getcmsNodesString = "'"+getcmsNodes+"'"
    var parsedNodes = JSON.stringify(getcmsNodesString);

    var json = (jsonOutput.cmsNodes);
    console.log(getcmsNodes);
    console.log(json);

    console.log((jsonOutput.cmsNodes));

    var buildObj = domJSON.toDOM(getcmsNodes, {
      noMeta: true
    });

    $.each(getcmsNodes.cmsNodes, function(i, object) {
      var parsedElement = domJSON.toDOM(this);
      node[i].replaceWith(parsedElement);
      // node[i].remove();
      console.log(node[i])
      console.log(parsedElement)
      console.log("Applied snapshot values to node" + [i]);
    }),adminEditable();
    // $('#jsonConverter').remove();

    $( "#admin_ResetButton" ).on( "click", function() {
      // $(jsonConverter).remove();
      console.log("Flushed DOM snapshot values");
    });

  };
  adminEditable();
});
