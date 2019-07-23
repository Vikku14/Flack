import json
import os
from datetime import datetime
from collections import defaultdict
from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit

total_data=defaultdict(list)
prefetch_channellist = list()
i=0
last_used_id=''

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

@app.route("/lastused", methods=["post", "get"])
def lastused():
	global last_used_id
	if request.method == "POST":
		lst= request.form.get("lst");
		last_used_id= lst
	# print(last_used_id)
	return jsonify({"lastused":last_used_id})
	

@app.route("/channeldata", methods=["post"])
def channeldata():
	title = request.form.get("title")
	if title in total_data: 
		return jsonify({"success":True,
			"chatdetail":total_data[title]
			})
	else:
		return jsonify({"success":False
			})

@app.route("/channelname",methods=["GET","POST"])
def channelname():
	print("entered channelname")
	if request.method == "POST":
		title = request.form.get("title")
		prefetch_channellist.append(title)
		print(prefetch_channellist)
	return jsonify({"success":True,
		"prefetch_channellist":prefetch_channellist
		})

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/chats")
def chats():
	# print(total_data)
	return render_template('chat.html')




@socketio.on("send message")
def sendmessage(data):
	global i
	now = datetime.now()
	instance = tuple( (data["username"], data["mes"],
		 now.strftime('%d-%m-%Y'), now.strftime( '%H:%M')) )
	if data["chatroom_name"] not in total_data:
		i=0
	
	total_data[data["chatroom_name"]].append(instance)
	username = total_data[data["chatroom_name"]][i][0];
	mes = total_data[data["chatroom_name"]][i][1];
	date = total_data[data["chatroom_name"]][i][2];
	time = total_data[data["chatroom_name"]][i][3];
	i += 1
	emit("announce message", {"date":date,
			"mes": mes,
		 	"username":username,
			"time":time},
			 broadcast = True)
