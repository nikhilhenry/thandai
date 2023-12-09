from fastapi import FastAPI, WebSocket
import asyncio
import numpy as np
from fastapi.encoders import jsonable_encoder
from time import sleep
import amg8833_i2c

app = FastAPI()

sensor = []

try:
    sensor = amg8833_i2c.AMG8833(addr=0x69)
except:
    sensor = amg8833_i2c.AMG8833(addr=0x68)
finally:
    pass

if sensor == []:
    print("No sensor found. Please check the connections")
    exit(1)


@app.get("/ping")
def ping():
    return {"msg": "pong"}


@app.get("/cam")
def ping():
    data = load_image_data()
    return data


@app.websocket("/cam")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            data = get_sensor_data()
            msg = {"pixels": data, "temp": 25}
            await websocket.send_json(msg)
            await asyncio.sleep(0.5)
        except:
            print("Client disconnected.")
            break


@app.websocket("/cam_test")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            data = load_image_data()
            msg = {"pixels": data, "temp": 25}
            await websocket.send_json(msg)
            await asyncio.sleep(0.5)
        except:
            print("Client disconnected.")
            break


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            await websocket.send_text(f"hi from server")
            await asyncio.sleep(0.5)
        except:
            print("Client disconnected.")
            break


def load_image_data():
    # load image data from csv in ../imgs/
    data = np.loadtxt("../imgs/cam_data.csv", delimiter=",")
    return data.tolist()


def get_sensor_data():
    status, pixels = sensor.read_temp()
    temp = sensor.read_thermistor()
    if status:
        raise Exception("Sensor read error")
    return pixels, temp
