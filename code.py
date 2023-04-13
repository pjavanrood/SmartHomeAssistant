import supervisor
import board
import digitalio
import time
import pwmio
from adafruit_motor import servo
from pulseio import PulseIn
import sys
import usb_cdc


#SONAR
class Sonar:
    def __init__(self):
        self.trigPin = digitalio.DigitalInOut(board.GP13)
        self.trigPin.direction = digitalio.Direction.OUTPUT

        self._timeout = 0.1

        self.echoPin = PulseIn(board.GP12)
        self.echoPin.pause()
        self.echoPin.clear()

    def getDistance(self) -> float:
        self.echoPin.clear()
        self.trigPin.value = True
        time.sleep(0.00001)
        self.trigPin.value = False

        pulselen = None
        timestamp = time.monotonic()

        self.echoPin.resume()
        while not self.echoPin:
            if (time.monotonic() - timestamp) > self._timeout:
                self.echoPin.pause()
                return self.getDistance()
        self.echoPin.pause()
        pulselen = self.echoPin[0]

        if pulselen >= 100000:
            return self.getDistance()

        dist = pulselen * 0.0343 / 2

        if dist < 1:
            return self.getDistance()

        return dist
################################################################


#Initializing LED + SERVO
led = digitalio.DigitalInOut(board.LED)
led.direction = digitalio.Direction.OUTPUT
led.value = False

led_red = digitalio.DigitalInOut(board.GP21)
led_red.direction = digitalio.Direction.OUTPUT

led_blue = digitalio.DigitalInOut(board.GP19)
led_blue.direction = digitalio.Direction.OUTPUT

led_green = digitalio.DigitalInOut(board.GP20)
led_green.direction = digitalio.Direction.OUTPUT

pwm = pwmio.PWMOut(board.GP15, duty_cycle=0, frequency=440)
door = servo.Servo(pwm)
door.angle = 0

sonar = Sonar()
################################################################

def change_door(status):

    if status == 'open':
        door.angle = 90

    elif status == 'close':
        door.angle = 0

    return

def change_LED(value):
    #print(f'--->{value}')
    if value == "on":
        led.value = True
        led_red.value = True
        led_green.value = True
        led_blue.value = True

    elif value == "off":
        led.value = False
        led_red.value = False
        led_green.value = False
        led_blue.value = False

    elif value == "red":
        led.value = True
        led_red.value = True
        led_green.value = False
        led_blue.value = False

    elif value == "green":
        led.value = True
        led_red.value = False
        led_green.value = True
        led_blue.value = False

    elif value == "blue":
        led.value = True
        led_red.value = False
        led_green.value = False
        led_blue.value = True

    else:
        led.value = False
        led_red.value = False
        led_green.value = False
        led_blue.value = False

def check_intruder():
#    print('{INTRUDER}')
    #blink(5)
    #print('{SAFE}')
    #blink(5)
    dist = sonar.getDistance()
    if dist < 4.00:
        print('{INTRUDER}')
    else:
        print('{SAFE}')


print("listening...")

def blink(x):
    for i in range(x):
        led.value = True
        time.sleep(0.5)
        led.value = False
        time.sleep(0.5)

def handle_LED(value):
    if value == "on":
        led.value = True

    elif value == "off":
        led.value = False

    else:
        led.value = False

    change_LED(value)

def handle_Servo(value):
#    if value == "open":
#        blink(3)

#    elif value == "close":
#        blink(4)

    change_door(value)


def handle_input(value):
    result = value.split(" ")

    if len(result) != 2:
        return

    if result[0] == "Light":
        handle_LED(result[1])

    elif result[0] == "Door":
        handle_Servo(result[1])

    else:
        return



#blink(5)
poll_no = 0
POLL_MAX = 5000
while True:
    if poll_no == POLL_MAX:
        try:
            check_intruder()
        except:
            poll_no = 0
        poll_no = 0
    else:
        poll_no += 1

    if supervisor.runtime.serial_bytes_available:
        print("--------POLLING-------")
        value = input().strip()
        if value == "":
            continue

        handle_input(value)


