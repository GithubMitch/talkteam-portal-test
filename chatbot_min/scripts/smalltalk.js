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
		qNnewDiv.style = 'font-family: sans-serif; font-weight:bold; font-size:11px; margin-right:0px; text-align: justify; margin-right: 0px; float:right; overflow: auto;  background-color: #35B297;  border-radius: 3px;  margin: 10px;  padding: 5px; padding-right:1em; text-align: left; color: #fff; margin-right:1em;';

		var clearfixDiv = document.createElement('div')
		clearfixDiv.className = 'direct-chat-info clearfix';

		var chatnameleft = document.createElement('span')
		chatnameleft.className = 'direct-chat-name pull-left';
		chatnameleft.innerHTML= "";
		chatnameleft.style = 'display: none;';

		var qtext = document.createElement('span');
		qtext.className =  'direct-chat-text';
		qtext.innerHTML=questionText;
		qTOAdd.appendChild(qNnewDiv);
		qNnewDiv.appendChild(clearfixDiv);
		clearfixDiv.appendChild(chatnameleft);
		qNnewDiv.appendChild(qtext);
		document.getElementById("conversation").appendChild(qTOAdd);
		scrolldown();
	}

	console.log(watsonContext)
	if (watsonContext != "") {
		updateWatsonContext(watsonContext); //Retrieve timestamps and returns them to Conversation Service within context variable
		dialog.context=watsonContext;
	}

	var url = "https://eofwatsonsdkusage.mybluemix.net/api/chatbotpostnl"; //BELANGRIJK
	//var url = "http://localhost:9080/api/chatbotpostnl"; //local

	$.ajax({
		url: url,
		type: 'post',
		dataType: 'json',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify(dialog),
		success: function (data) {
			console.log(data);
			var jsonObj = data;

			console.log(jsonObj);
			var responseMessages = jsonObj.text;
			console.log("Responsemessage =" + responseMessages);

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

				var YourChatname = document.createElement('span');
				YourChatname.className = 'direct-chat-name pull-left';
				YourChatname.innerHTML= "";

				var spanImgleft = document.createElement('span');
				spanImgleft.ClassName = 'spanImgleft';

				var spanImgright = document.createElement('span');
				spanImgleft.ClassName = 'spanImgright';
				var Image = document.createElement('img');
				Image.ClassName = 'direct-chat-img';
				Image.style = 'float: left; height:40px;';
				var imgsrc = "img/avatar.png";
				Image.src = (imgsrc);

				var yourtext = document.createElement('div');
				yourtext.className='direct-chat-text';
				yourtext.innerHTML=responseMessage;
				yourtext.style = 'font-size: 11px; font-family: sans-serif;  color: #001a73; font-weight: bold; margin-left: 50px;  text-align:left; min-height: 40px; border: 1px solid; border-color: #dadada; box-sizing: border-box; border-radius: 5px; box-shadow: inset 1px 1px 2px 0 rgba(0,0,0,.1); padding:10px;';

				toAdd.appendChild(newDiv);
				newDiv.appendChild(clearfixright);
				clearfixright.appendChild(YourChatname);
				newDiv.appendChild(spanImgleft);
				newDiv.appendChild(spanImgright);
				spanImgleft.appendChild(Image);
				spanImgright.appendChild(yourtext);
				document.getElementById('input').value="";

				watsonContext = jsonObj.context;
				//console.log(watsonContext);
				//updateWatsonContext(watsonContext);

				scrolldown();
				document.getElementById("conversation").appendChild(toAdd);
				scrolldown();
			}
		},
		fail: function (data) {
			console.log(data)
			//console.log("error, gefaald");
		}
	});
}

function updateWatsonContext(watsonContext) {
	console.log(watsonContext)
	var username = retrieveUsername(watsonContext);
	watsonContext['username'] = username;

	//if(watsonContext.hasOwnProperty('time') && watsonContext.hasOwnProperty('officialtime') && watsonContext.hasOwnProperty('date')) {
	var timestamps = retrieveTimeStamp();
	//[time, officialtime, date, timeindication] = retrieveTimeStamp();
	watsonContext['time'] = timestamps[0];
	watsonContext['officialtime'] = timestamps[1];
	watsonContext['date'] = timestamps[2];
	watsonContext['timeindication'] = timestamps[3];
	//}
	return watsonContext;
}

function retrieveUsername(watsonContext) {
	var username = '';
	return username;
}

function retrieveTimeStamp() {
	//Day
	var day = new Date().getDay();
	switch (day) {
	    case 0:
	        day = "zondag";
	        break;
	    case 1:
	        day = "maandag";
	        break;
	    case 2:
	        day = "dinsdag";
	        break;
	    case 3:
	        day = "woensdag";
	        break;
	    case 4:
	        day = "donderdag";
	        break;
	    case 5:
	        day = "vrijdag";
	        break;
	    case  6:
	        day = "zaterdag";
	        break;
	}

	//Date
	var date = day + " " + new Date().getDate() + "-" + (new Date().getMonth() + 1)  + "-" + new Date().getFullYear();

	//Official time
	var hours = new Date().getHours();
	var minutes = new Date().getMinutes();
	var officialtime = "";

	if (hours < 10 && minutes < 10) {
		officialtime = "0" + hours + ":0" + minutes;
	}
	else if (hours < 10 && minutes >= 10) {
		officialtime = "0" + hours + ":" + minutes;
	}
	else if (minutes < 10) {
		officialtime = hours + ":" + "0" + minutes;
	}
	else {
		officialtime = hours + ":" + minutes;
	}

	//Time indication
	var timeindication;

	if (hours >= 0 && hours < 6) {
		timeindication = "goede nacht";
	}
	else if (hours >= 6 && hours < 12) {
		timeindication = "goede morgen";
	}
	else if (hours >= 12 && hours < 18) {
		timeindication = "goede middag";
	}
	else {
		timeindication = "goede avond";
	}

	//Spoken numbers
	if (hours > 12) {
		hours = hours - 12;
	}
	var currenttime = "";
	while (currenttime == "") {
		if (minutes == 0) {
			currenttime += (toSpeech(hours));
			currenttime += (" uur");
		}
		else if (minutes < 15) {
			currenttime += (toSpeech(minutes));
			currenttime += (" over ");
			currenttime += (toSpeech(hours));
		}
		else if (minutes == 15) {
			minutes = "kwart over ";
			currenttime += toSpeech(hours);
		}
		else if (minutes < 30) {
			currenttime += (toSpeech(30 - minutes));
			currenttime += (" voor half ");
			currenttime = updateCurrentTime(hours, currenttime);
		}
		else if (minutes == 30) {
			currenttime += ("half ");
			currenttime = updateCurrentTime(hours, currenttime);
		}
		else if (minutes < 45) {
			currenttime += (toSpeech(minutes - 30));
			currenttime += (" over half ");
			currenttime = updateCurrentTime(hours, currenttime);
		}
		else if (minutes == 45) {
			currenttime += ("kwart voor ");
			currenttime = updateCurrentTime(hours, currenttime);
		}
		else {
			currenttime += (toSpeech(60 - minutes));
			currenttime += (" voor ");
			currenttime = updateCurrentTime(hours, currenttime);
		}
	}
	var timearray = [currenttime, officialtime, date, timeindication];
	return timearray;
}

//Reoccuring pattern functionalized
function updateCurrentTime(hours, currenttime) {
	if (hours != 12) {
		currenttime += (toSpeech(hours + 1));
	}
	else {
		currenttime += (toSpeech(1));
	}
	return currenttime;
}

//Spoken time
function toSpeech(number) {
	var toSpeech = {1: "één", 2: "twee", 3: "drie", 4: "vier", 5: "vijf", 6: "zes", 7: "zeven", 8: "acht", 9: "negen", 10: "tien",
	11: "elf", 12: "twaalf", 13: "dertien", 14: "veertien"};
	/*
	15: "vijftien", 16: "zestien", 17: "zeventien", 18: "achttien", 19: "negetien", 20: "twintig",
	21: "éénentwintig", 22: "tweeëntwintig", 23: "drieëntwintig", 24: "vierentwintig", 25: "vijfentwintig", 26: "zesentwintig", 27: "zevenentwintig", 28: "achtentwintig", 29: "negenentwintig", 30: "dertig",
	31: "éénendertig", 32: "tweeënertig", 33: "drieëndertig", 34: "vierendertig", 35: "vijfendertig", 36: "zesendertig", 37: "zevenendertig", 38: "achtendertig", 39: "negenendertig", 40: "veertig",
	41: "éénenveertig", 42: "tweeënveertig", 43: "drieënveertig", 44: "vierenveertig", 45: "vijfenveertig", 46: "zesenveertig", 47: "zevenenveertig", 48: "achtenveertig", 49: "negenenveertig", 50: "vijftig",
	51: "éénenvijftig", 52: "tweeënvijftig", 53: "drieënvijftig", 54: "vierenvijftig", 55: "vijfenvijftig", 56: "zesenvijftig", 57: "zevenenvijftig", 58: "achtenvijftig", 59: "negenenvijftig", 60: "zestig",
	*/
	return toSpeech[number];
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
	var objDiv = document.getElementById("conversation");
	objDiv.scrollTop = objDiv.scrollHeight;
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
