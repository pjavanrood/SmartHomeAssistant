from flask import Flask, request, render_template, jsonify

import threading
from speech import *

app = Flask(__name__)

speechAnalyzer = SpeechCommand()

if(__name__ == '__main__'):
    app.run(host="localhost", port=1234, debug=True)


@app.route('/', methods = ['GET'])
def main():
    return render_template('./webpage.html')


@app.route('/audio', methods = ['POST'])
def handleAudio():
    if request.method == 'POST':
        print('Data Received!')

        audio_file = request.files['audio']

        audio_data = audio_file.read()

        prediction = speechAnalyzer.getResult(audio_data)

        return {
            "prediction": prediction
        }
        


@app.route('/VM', methods = ['POST'])
def handleVM():
    return "Hello"