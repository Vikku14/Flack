var storedNames=[];
var i;
var chatroom_name
document.addEventListener('DOMContentLoaded',() => {

	
	document.querySelector('#typemessage').disabled=true;
	document.querySelector('#button').disabled=true;

	document.querySelector("#typemessage").onkeyup = () => {
	if (document.querySelector("#typemessage").value.length >0)
		document.querySelector("#button").disabled = false;
	else
		document.querySelector("#button").disabled = true;
		
	};
	// loads data in webpage using localStorage
	var username = localStorage.getItem('name');
	document.querySelector('#name').innerHTML= username;
	storedNames = JSON.parse(localStorage.getItem("channel_list"));

	if (storedNames.length >0)
		{

		for (i=0; i < storedNames.length; i++) {
			const li = document.createElement('li');
			li.innerHTML = storedNames[i];
			document.querySelector("#channels").append(li);
			document.getElementsByTagName("li")[i].setAttribute("class","channel_item");
		}
	
	}

	// add channel to list

	document.querySelector('#channel').onclick= () => {
	const ch= prompt("Enter Channel Name");
	if((ch !== null) && (ch.length > 0) && !(storedNames.includes(ch))){
		storedNames.push(ch);
		const li = document.createElement('li');
		li.innerHTML = ch;
		document.querySelector("#channels").append(li);
		li.setAttribute("class","channel_item");
		localStorage.setItem("channel_list", JSON.stringify(storedNames));
	}
	else if (channel_list.includes(ch)) {
		alert(`"${ch}" is already a channel.\n Try That Out.`)
	}
};

	// chatting stuff

	var socket = io.connect(location.protocol + "//" + document.domain + ":" + location.port);

	socket.on('connect', () => {
			document.querySelectorAll('.channel_item').forEach(item =>{
			item.onclick= function() {
			chatroom_name = this.innerHTML;
			document.querySelector('#channel_info').innerHTML = "Chat Room: " +chatroom_name;
			document.querySelectorAll('.channel_item').forEach(item =>{
				item.style.background= "#f0f0f0";
			});
			this.style.background = "#a1e6ff";
			document.querySelector('#typemessage').disabled=false;
			}


		});

			document.querySelector("#form").onsubmit = ()=> {
			var mes = document.querySelector("#typemessage").value;
			document.querySelector("#typemessage").value = '';


			socket.emit("send message", {"chatroom_name":chatroom_name,"mes": mes, "username":username});
			return false;
		}	
	});

	// broadcasting message

	socket.on('announce message',data => {
		const div = document.createElement('div');
		const span = document.createElement('span');
		const code = document.createElement('code');


		div.setAttribute("class","chat_div");
		span.setAttribute("class","chat_span");
		code.setAttribute("class","add_info text-secondary");


		span.innerHTML = data.mes+"<br>";
		code.innerHTML = data.time + ";&nbsp"+ data.username;


		document.querySelector("#right_mid_part").append(div);	
		document.querySelectorAll(".chat_div").forEach(button =>{
			button.append(span);
			button.append(code);

		});
		// update scrollbar

		var element = document.querySelector("#right_mid_part");
    	element.scrollTop = element.scrollHeight;

	});


});


// deals with localStorage

if (!localStorage.getItem('name')) 
	localStorage.setItem('name',prompt("Enter ChatName"));
if (!localStorage.getItem('channel_list')) 
	localStorage.setItem('channel_list',prompt("Create First Channel"));




