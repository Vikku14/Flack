import json
import os
from datetime import datetime
from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit

total_data=dict()
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


@app.route("/channeldata", methods=["post"])
def channeldata():
	title = request.form.get("title")
	if title in total_data: 
		return jsonify({"success":True,
			"username":total_data[title][0], 
			"mes":total_data[title][1],
			"date":total_data[title][2],
			"time":total_data[title][3]
			})
	else:
		return jsonify({"success":False
			})


@app.route("/")
def index():
    return render_template('index.html')

@app.route("/chats")
def chats():
	print(total_data)
	return render_template('chat.html', total_data=total_data)




@socketio.on("send message")
def sendmessage(data):
	now = datetime.now()
	total_data[data["chatroom_name"]] = [ data["username"], data["mes"],
		 now.strftime('%d-%m-%Y'), now.strftime( '%H:%M') ]

	username = total_data[data["chatroom_name"]][0];
	mes = total_data[data["chatroom_name"]][1];
	date = total_data[data["chatroom_name"]][2];
	time = total_data[data["chatroom_name"]][3];

	emit("announce message", {"date":date,
			"mes": mes,
		 	"username":username,
			"time":time},
			 broadcast = True)
