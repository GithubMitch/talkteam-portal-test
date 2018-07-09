// Fill $chatbotName with CLients chatbot-name
var chatbotName = "TalkTeamBot NL";
// Fill $userName with 'active' user-name
var userName = "jij";

var conversationIndex = 1;
var watsonContext = "";

function loadJSON() {
	//Question
	var questionText = document.getElementById('input').value;
	questionText.style = 'float: left; width:80%;';

	var dialog = new Object();
	dialog.newQuestion = questionText;

	if (questionText != "") {
		var qTOAdd = document.createDocumentFragment();
		var qNnewDiv = document.createElement('div');
		qNnewDiv.id = 'q'+conversationIndex;
		qNnewDiv.className = 'direct-chat-msg right';
		// qNnewDiv.style = 'font-family: sans-serif; font-weight:bold; font-size:11px; margin-right:0px; text-align: justify; margin-right: 0px; float:right; overflow: auto;  background-color: #ed8c00;  border-radius: 3px;  margin: 10px;  padding: 5px;  text-align: left; color: #fff; margin-right:0px;';

		var clearfixDiv = document.createElement('div')
		clearfixDiv.className = 'direct-chat-info clearfix';

		var chatnameleft = document.createElement('h3')
		chatnameleft.className = 'direct-chat-name pull-left';
		chatnameleft.innerHTML= userName; //$Username
		chatnameleft.style = "";

		var qtext = document.createElement('span');
		qtext.className =  'direct-chat-text';
		qtext.innerHTML=questionText;
		qTOAdd.appendChild(qNnewDiv);
		qNnewDiv.appendChild(clearfixDiv);
		clearfixDiv.appendChild(chatnameleft);
		qNnewDiv.appendChild(qtext);
		document.getElementById("conversation").appendChild(qTOAdd);
		scrolldown();
		document.getElementById('input').value="";

	}

	console.log(watsonContext)
	if (watsonContext != "") {

		dialog.context=watsonContext;
	}

	var url = document.getElementById("endpoint").value;

	$.ajax({
		url: url,
		type: 'post',
		dataType: 'json',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify(dialog),
		success: function (data) {
			console.log(data);
			var jsonBodyObj = data;
			var jsonObj=jsonBodyObj.body;
			console.log(jsonObj);
			var responseMessages
			if (jsonObj==null) {
				jsonObj=jsonBodyObj;
			}
			responseMessages = jsonObj.text;

			//todo add ready class to iframe when first response
			$("#eofbot").addClass('ready');

			console.log("Responsemessages =" + responseMessages);

			//loop through array with outputs
			for(var i = 0; i < responseMessages.length; i++) {
				var toAdd = document.createDocumentFragment();
				var responseMessage = responseMessages[i];
				var newDiv = document.createElement('div');
				newDiv.id = 'r'+conversationIndex;

				conversationIndex++;
				newDiv.className = 'direct-chat-msg';

				var clearfixright = document.createElement('div');
				clearfixright.className = 'direct-chat-info clearfix';

				var YourChatname = document.createElement('h3');
				YourChatname.className = 'direct-chat-name pull-left';
				YourChatname.innerHTML= chatbotName; //$Botname


				var spanImgright = document.createElement('span');


				var yourtext = document.createElement('div');
				yourtext.className='direct-chat-text';
				yourtext.innerHTML=responseMessage;
				// yourtext.style = 'font-size: 11px; font-family: sans-serif;  color: #001a73; font-weight: bold; margin-left: 50px; text-align:left; min-height: 40px; border: 1px solid; border-color: #dadada; box-sizing: border-box; border-radius: 5px; box-shadow: inset 1px 1px 2px 0 rgba(0,0,0,.1); padding:10px;';

				toAdd.appendChild(newDiv);
				newDiv.appendChild(clearfixright);
				clearfixright.appendChild(YourChatname);

				newDiv.appendChild(spanImgright);

				spanImgright.appendChild(yourtext);

				watsonContext = jsonObj.context;
				//console.log(watsonContext);
				//updateWatsonContext(watsonContext);

				// scrolldown();
				document.getElementById("conversation").appendChild(toAdd);
			}
			scrolldown();
		},
		fail: function (data) {
			console.log(data)
			//console.log("error, gefaald");
		}
	});
}


function yesbye() {
	document.getElementById('input').value="yes";
	loadJSON();
	scrolldown();
}

function nobye(){
	document.getElementById('input').value="no";
	loadJSON();
	scrolldown();
}

function scrolldown() {
	// setTimeout(function() {
		var conversation = $("#conversation");
		var conversationHeight = $(conversation).height();
		$("main").animate({ scrollTop: $(conversation).height() }, 300); //adjust animation time here '300ms'
		console.log("Scrolled down")
	// }, 300);
	// set delay here '300ms'
}

function ask() {
	if(event.keyCode == 13) {
		loadJSON()
	}
}

function button(userinput, buttonContext) {
	document.getElementById('input').value=userinput;
	watsonContext.product=buttonContext;
	loadJSON();
}

function openlink(url) {
	var win = window.open(url,'_blank');
	win.focus();
}

function process(e) {
	var code = (e.keyCode ? e.keyCode : e.which);
	if (code == 13) { //Enter keycode
		loadJSON();
	}
}
