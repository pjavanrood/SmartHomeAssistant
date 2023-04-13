import speech_recognition as sr
import io
import wave
from pydub import AudioSegment
import cohere



class SpeechCommand:
    def __init__(self):
        self.co = cohere.Client('KU5fJoqF5i0Eu3A7QuICkun2V5kiZElrHw4BqXDr') # This is your trial API key

    def getResult(self, audio_data) -> str:
        text = self.processSpeech(audio_data)
        if text != "INVALID":
            prediction = self.processText(text)
            print(f'PREDICTION -> {prediction}')
            return prediction
        else:
            return "INVALID"
            

    
    def processSpeech(self, audio_data) -> str:

        audio_segment = AudioSegment.from_file(io.BytesIO(audio_data))
        audio_data = audio_segment.export(format='wav').read()

        # Create in-memory binary stream
        audio_stream = io.BytesIO(audio_data)

        # Recognize speech from audio data
        recognizer = sr.Recognizer()
        with sr.AudioFile(audio_stream) as source:
            audio = recognizer.record(source)

        # Perform speech recognition
        try:
            text = recognizer.recognize_google(audio)
            print(text)
            return text
        except:
            print("INVALID")
            return "INVALID"

    def processText(self, text) -> str:
        response = self.co.classify(
            model='6fb39aad-01be-4ddc-86ad-43155c4a8366-ft',
            inputs=[text])
        
        prediction = (response.classifications[0]).prediction

        confidence = (response.classifications[0]).confidence

        if confidence < 0.14:
            return "INVALID"
        
        return prediction




    
    






    