#!/bin/bash

path="/home/thandai/code/rpi"

ssh thandai@raspberrypi.local python ${path}/cam_save.py

num_imgs=`ls -1 imgs/ | wc -l`
new_num_imgs=`expr $num_imgs + 1`

scp thandai@raspberrypi.local:${path}/cam_data.csv  ./imgs/

mv ./imgs/cam_data.csv ./imgs/cam_data_${new_num_imgs}.csv


