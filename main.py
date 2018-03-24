import RPi.GPIO as GPIO
import time
import os

GPIO.setmode(GPIO.BOARD)  # Set GPIO pin numbering
GPIO.setwarnings(False)

L1 = 11
L2 = 12
L3 = 15
L4 = 16

steer = 31
drive = 32

GPIO.setup(drive, GPIO.OUT)
GPIO.setup(steer, GPIO.OUT)
GPIO.setup(L1, GPIO.OUT)
GPIO.setup(L2, GPIO.OUT)
GPIO.setup(L3, GPIO.OUT)
GPIO.setup(L4, GPIO.OUT)

def stop():
	GPIO.output(drive, GPIO.LOW)
	GPIO.output(steer, GPIO.LOW)
	GPIO.output(L1, GPIO.LOW)
	GPIO.output(L2, GPIO.LOW)
	GPIO.output(L3, GPIO.LOW)
	GPIO.output(L4, GPIO.LOW)

def forward(t):
	GPIO.output(drive, GPIO.HIGH)
	GPIO.output(L1, GPIO.LOW)
	GPIO.output(L2, GPIO.HIGH)
	GPIO.output(L3, GPIO.LOW)
	GPIO.output(L4, GPIO.HIGH)
	time.sleep(t)
	
def turn_right(deg):
	GPIO.output(steer, GPIO.HIGH)
	GPIO.output(L1, GPIO.LOW)
	GPIO.output(L2, GPIO.HIGH)
	
def turn_left(deg):
	GPIO.output(steer, GPIO.HIGH)
	GPIO.output(L1, GPIO.HIGH)
	GPIO.output(L2, GPIO.LOW)


# main method
cmd = "asdf"
while(cmd != ""):
	cmd = input()
	c, t = cmd.split()
	if c == "d":
		forward(t)
	if c == "r":
		turn_right(t)
	if c == "l":
		turn_left(t)
	stop()
	
	
GPIO.cleanup()