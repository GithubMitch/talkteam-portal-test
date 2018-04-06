$(document).ready(function() {
  var toolbarOptions = [
	  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
	  ['blockquote', 'code-block'],

	  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
	  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
	  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
	  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
	  [{ 'direction': 'rtl' }],                         // text direction

	  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
	  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [ 'link', 'image', 'video', 'formula' ],

	  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
	  [{ 'font': [] }],
	  [{ 'align': [] }]

	  // ['clean']                                         // remove formatting button
	];
  var jsonParser = $("#jsonParser");
  var currentPage = $("title").text();
  var node = $('.cm');


  i=-1;

  function addNodes() {
    $(node).each(function(){
      i++;
      var cm_box = $(this).find(".cm_box");
      var cm_boxHTML = $(cm_box).html();
      insertEditor = 	"<div id="+'editor'+i+">"+ cm_boxHTML +"</div>";
      $(this).prepend(insertEditor);
      var editor = new Quill("#editor"+i+"", {
        modules: {
          toolbar: toolbarOptions
        },
        placeholder: 'Compose an epic...',
        theme: 'snow'  // or 'bubble'
      });
    });
  };
  function applyNodes() {
    cmsNodes = [];

    $(node).each(function(){
      i++;
      var editor = $(this).find('.ql-editor');
      var cm_box = $(this).find(".cm_box");
      $(cm_box).html(editor.html());
      var jsonNode = editor.html();

      //push json string to cmsNodes Array
      cmsNodes.push(jsonNode);

      // console.log(editor.html())
      // console.log(cmsNodes);

      jsonFile = {
          "page":currentPage,
          cmsNodes
       };

       $(jsonParser).attr("value",JSON.stringify(jsonFile));
    });
  };
  addNodes();

  $( "#admin_ApplyButton" ).on( "click", function() {
    var toolBar = $('.ql-toolbar');
    var qlContainer = $('.ql-container');
    applyNodes();
    $(qlContainer).each(function(){
      $(this).remove();
    });
    $(toolBar).each(function(){
      $(this).remove();
    });
  });

  $( "#admin_SafeButton" ).on( "click", function() {

  });

  if($('#jsonConverter').attr("value") != '') {
    // var jsonRequestedData = document.getElementById("jsonConverter").getAttribute("value");
    // var jsonParsedData = JSON.parse(jsonRequestedData);
    // var jsonOutput = jsonParsedData.cmsNodes;
    // console.log(jsonOutput)

    // $.each(getcmsNodes.cmsNodes, function(i, object) {
    //   node[i].replaceWith();
    // });
    // $('#jsonConverter').remove();


  };


});
