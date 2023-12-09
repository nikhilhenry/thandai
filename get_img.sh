#!/bin/bash

path="/home/thandai/code/rpi"

ssh thandai@raspberrypi.local python ${path}/cam_save.py

scp thandai@raspberrypi.local:${path}/cam_data.csv  ./imgs/
