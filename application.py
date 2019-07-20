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
    return render_template('chat.html')

@socketio.on("send message")
def sendmessage(data):
	mes = data["mes"]
	username = data["username"]
	time = datetime.now().strftime('%Y-%m-%d %H:%M')
	
	emit("announce message", {"mes": mes, "username":username,"time":time}, broadcast = True)