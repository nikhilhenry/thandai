# Script to save IR camera sensor values to a CSV file from AMG8833

import time, sys

sys.path.append("../")
# load AMG8833 module
import amg8833_i2c
import numpy as np


# Intilisation of sensor

t0 = time.time()
sensor = []
while (time.time() - t0) < 1:  # wait 1sec for sensor to start
    try:
        # AD0 = GND, addr = 0x68 | AD0 = 5V, addr = 0x69
        sensor = amg8833_i2c.AMG8833(addr=0x69)  # start AMG8833
    except:
        sensor = amg8833_i2c.AMG8833(addr=0x68)
    finally:
        pass
time.sleep(0.1)  # wait for sensor to settle

# If no device is found, exit the script
if sensor == []:
    print("No AMG8833 Found - Check the Wiring")
    sys.exit()


pix_to_read = 64  # read all 64 pixels

status, pixels = sensor.read_temp(pix_to_read)  # read pixels with status

if status:
    print(f"Failed to capture img:{status}")

T_thermistor = sensor.read_thermistor()  # read thermistor temp

# save pixels to CSV file
np.savetxt("ir_camera_{0:2.2f}".format(T_thermistor), pixels, delimiter=",")
