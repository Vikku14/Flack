var i;
var chatroom_name;
var li;
document.addEventListener('DOMContentLoaded',() => {

	
	document.querySelector('#typemessage').disabled=true;
	document.querySelector('#button').disabled=true;

	document.querySelector("#typemessage").onkeyup = () => {
	if (document.querySelector("#typemessage").value.length >0)
		document.querySelector("#button").disabled = false;
	else
		document.querySelector("#button").disabled = true;
		
	};




	// chatting stuff

	var socket = io.connect(location.protocol + "//" + document.domain + ":" + location.port);

	socket.on('connect', () => {


	// loads data in webpage using localStorage

			var username = localStorage.getItem('name');
			document.querySelector('#name').innerHTML= username;
				const req = new XMLHttpRequest();
	 			req.open("GET", "/channelname");
	 			req.send();
	 		

	 			req.onload= () => {
	 				const data = JSON.parse(req.responseText);
	 				const loaded_channellist= data.prefetch_channellist;
	 	

				if (loaded_channellist.length >0)
					{

					for (i=0; i < loaded_channellist.length; i++) {
						const li = document.createElement('li');
						li.innerHTML = loaded_channellist[i];
						document.querySelector("#channels").append(li);
						document.getElementsByTagName("li")[i].setAttribute("class","channel_item");
						document.getElementsByTagName("li")[i].setAttribute("id","id_"+li.innerHTML);

						}
				
					}
	document.querySelectorAll('.channel_item').forEach(item =>{
		
			item.setAttribute("id","id_"+item.innerHTML);
			
			item.onclick= function() {
			
				chatroom_name = this.innerHTML;
			
				document.querySelector('#channel_info').innerHTML = "Chat Room: " +chatroom_name;
				document.querySelectorAll('.channel_item').forEach(item =>{
					item.style.background= "#f0f0f0";
				});
				this.style.background = "#a1e6ff";


				const req4 = new XMLHttpRequest;
				req4.open("POST","/lastused");
				const lst = new FormData();
				lst.append('lst',this.id);
				req4.send(lst);


			
				document.querySelector('#typemessage').disabled=false;
		
				// loading AJAX data of selected channel 

				const req5 = new XMLHttpRequest();
	 			req5.open("POST", "/channeldata");

	 			const title = new FormData();
	 			title.append('title', this.innerHTML);
	        
	 			req5.send(title);
	 			req5.onload= () => {
	 				const data = JSON.parse(req5.responseText);
	 				document.querySelector("#right_mid_part").innerHTML= "";
	 				if (data.success)
	 				{
	 					for (var tuple=0; tuple < (data.chatdetail).length; tuple++)
	 					{	
	 					
		 					const div = document.createElement('div');
							const span = document.createElement('span');
							const code = document.createElement('code');


							div.setAttribute("class","chat_div");
							span.setAttribute("class","chat_span");
							code.setAttribute("class","add_info text-secondary");


							span.innerHTML = data.chatdetail[tuple][1]+"<br>";
							code.innerHTML = data.chatdetail[tuple][3] + ";&nbsp"+ data.chatdetail[tuple][0];


							document.querySelector("#right_mid_part").append(div);	
							document.querySelectorAll(".chat_div").forEach(button =>{
								button.append(span);
								button.append(code);

							});
						}
	 				}
	 				else
	 				{
	 					const code = document.createElement('code');
	 					code.setAttribute("class"," notyet h5 text-secondary");
	 					code.innerHTML = "No Messages Yet.";
	 					document.querySelector("#right_mid_part").append(code);	
	 				}



	 					// update scrollbar

		var element = document.querySelector("#right_mid_part");
    	element.scrollTop = element.scrollHeight;
 				
 			}

			}


		});
				
	 		}


	

			// remember the last channel used


				const req2 = new XMLHttpRequest();
	 			req2.open("GET", "/lastused");
	 			req2.send();


	 			req2.onload = () => {
	 			const data = JSON.parse(req2.responseText);
	 			

				if (data.lastused !== ''){
				var last = document.querySelector("#"+data.lastused);

				last.style.background = "#a1e6ff";
				
				// sending AJAX request

				const req3 = new XMLHttpRequest();
	 			req3.open("POST", "/channeldata");

	 			const title = new FormData();
	 			title.append('title', last.innerHTML);
	        
	 			req3.send(title);


	 			req3.onload= () => {
	 				const data = JSON.parse(req3.responseText);
	 				document.querySelector("#right_mid_part").innerHTML= "";
	 				
	 				if (data.success)
	 				{
	 					for (var tuple=0; tuple < (data.chatdetail).length; tuple++)
	 					{	
		 					const div = document.createElement('div');
							const span = document.createElement('span');
							const code = document.createElement('code');


							div.setAttribute("class","chat_div");
							span.setAttribute("class","chat_span");
							code.setAttribute("class","add_info text-secondary");


							span.innerHTML = data.chatdetail[tuple][1]+"<br>";
							code.innerHTML = data.chatdetail[tuple][3] + ";&nbsp"+ data.chatdetail[tuple][0];


							document.querySelector("#right_mid_part").append(div);	
							document.querySelectorAll(".chat_div").forEach(button =>{
								button.append(span);
								button.append(code);

							});
						}
	 				}
	 				else
	 				{
	 					const code = document.createElement('code');
	 					code.setAttribute("class"," notyet h5 text-secondary");
	 					code.innerHTML = "No Messages Yet.";
	 					document.querySelector("#right_mid_part").append(code);	
	 				}
 				
 			}

				document.querySelector('#channel_info').innerHTML = "Chat Room: " +last.innerHTML;
				document.querySelector('#typemessage').disabled=false;

		}
	}





	// add channel to list

			document.querySelector('#channel').onclick= () => {
			const ch= prompt("Enter Channel Name");
			if((ch !== null) && (ch.length > 0)){

				const request = new XMLHttpRequest();
	 			request.open("POST", "/channelname");
	 			const title = new FormData();
	 			title.append('title', ch);
	 			request.send(title);

	 			request.onload= () => {
	 				const data = JSON.parse(request.responseText);
	 				li = document.createElement('li');
	 				const loaded_channellist = data.prefetch_channellist;
					li.innerHTML = loaded_channellist[loaded_channellist.length-1];
					document.querySelector("#channels").append(li);
					li.setAttribute("class","channel_item");
					li.setAttribute("id","id_"+ch);

	 	

	 		document.querySelectorAll('.channel_item').forEach(item =>{

			item.setAttribute("id","id_"+item.innerHTML);
			
			item.onclick= function() {
			
				chatroom_name = this.innerHTML;
			
				document.querySelector('#channel_info').innerHTML = "Chat Room: " +chatroom_name;
				document.querySelectorAll('.channel_item').forEach(item =>{
					item.style.background= "#f0f0f0";
				});
				this.style.background = "#a1e6ff";


				const req4 = new XMLHttpRequest;
				req4.open("POST","/lastused");
				const lst = new FormData();
				lst.append('lst',this.id);
				req4.send(lst);


			
				document.querySelector('#typemessage').disabled=false;
		
				// loading AJAX data of selected channel 

				const req5 = new XMLHttpRequest();
	 			req5.open("POST", "/channeldata");

	 			const title = new FormData();
	 			title.append('title', this.innerHTML);
	        
	 			req5.send(title);
	 			req5.onload= () => {
	 				const data = JSON.parse(req5.responseText);
	 				document.querySelector("#right_mid_part").innerHTML= "";
	 				if (data.success)
	 				{
	 					for (var tuple=0; tuple < (data.chatdetail).length; tuple++)
	 					{	
		 					const div = document.createElement('div');
							const span = document.createElement('span');
							const code = document.createElement('code');


							div.setAttribute("class","chat_div");
							span.setAttribute("class","chat_span");
							code.setAttribute("class","add_info text-secondary");


							span.innerHTML = data.chatdetail[tuple][1]+"<br>";
							code.innerHTML = data.chatdetail[tuple][3] + ";&nbsp"+ data.chatdetail[tuple][0];


							document.querySelector("#right_mid_part").append(div);	
							document.querySelectorAll(".chat_div").forEach(button =>{
								button.append(span);
								button.append(code);

							});
						}
	 				}
	 				else
	 				{
	 					const code = document.createElement('code');
	 					code.setAttribute("class"," notyet h5 text-secondary");
	 					code.innerHTML = "No Messages Yet.";
	 					document.querySelector("#right_mid_part").append(code);	
	 				}
 				
 			}

			}


		});

	 				
	 			}


	 		
	}



};






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
if (!localStorage.getItem('lastused')) 
	localStorage.setItem('lastused','');




