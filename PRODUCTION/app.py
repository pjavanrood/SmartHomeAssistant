#Flask imports
from flask import Flask, request, render_template
from flask_socketio import SocketIO, send, emit
from speech import *

#initializing server and socket server
app = Flask(__name__)
socketio = SocketIO(app)

#creating Speech Recognition Analyzer
speechAnalyzer = SpeechCommand()

if __name__ == '__main__':
    socketio.run(app)

#Main route that renders the template
@app.route('/', methods = ['GET'])
def main():
    return render_template('./webpage.html')


#Audio is sent to this endpooint
@app.route('/audio', methods = ['POST'])
def handleAudio():
    if request.method == 'POST':
        print('Data Received!')
        try:
            audio_file = request.files['audio']

            audio_data = audio_file.read() #Read Bytes

            prediction = speechAnalyzer.getResult(audio_data) #Call method to Analyze the audio file

            if prediction != "INVALID":
                socketio.emit('message', prediction) #Send the result to Pico

            return {
                "prediction": prediction #Send the result to Client
            }
        except:
            return "Error!"


#Handle communication with the pico
@socketio.on('connect')
def handleConncetion():
    print('CONNECTED')

@socketio.on('message')
def handleMessage(msg):
    emit('message', msg, broadcast=True, include_self=False)
    print(msg)
    # send(f'You said{msg}', broadcast=True)
 