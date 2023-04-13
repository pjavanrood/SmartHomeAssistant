import socketio
import argparse
import serial

#INITIALIZE SERIAL COMMUNICATION
parser = argparse.ArgumentParser()
parser.add_argument("port", type=str, help="Serial port of the board", nargs=1)
args = parser.parse_args()
port = args.port

channel = serial.Serial(args.port[0])
channel.timeout = 0.05

#INITIALIZE SERVER COMMUNICATION
sio = socketio.Client()

@sio.event
def connect():
    print("Connected to Server!")

@sio.event
def connect_error():
    print("The connection failed!")



def handle_message(message):
    print(message)
    channel.write(str(message).encode())
    channel.write(b"\r\n")


@sio.on('message')
def on_message(message):
    print('Received message:', message)
    handle_message(message)


#Check if Pico is sending intruder alert
def check_intruder():
    read_val = channel.read_all()
    if read_val != b'':
        read_val = str(read_val)
        print(read_val)
        intruder_alert = (read_val.find('{INTRUDER}', 0) > 0)
        if(intruder_alert):
            sio.emit('message', 'INTRUDER')
        safe_alert =   (read_val.find('{SAFE}', 0) > 0) 
        if(safe_alert):
            sio.emit('message', 'SAFE')
        #print(f'{read_val} -> {intruder_alert}')



sio.connect('http://cpen291-5.ece.ubc.ca/')
#sio.connect('http://127.0.0.1:5000/')

while(True):
    check_intruder()