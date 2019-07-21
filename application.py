import os
from datetime import datetime
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

total_data=dict()
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template('index.html')

@app.route("/chats")
def chats():
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