from fastapi import FastAPI, WebSocket
import asyncio
import numpy as np
from fastapi.encoders import jsonable_encoder

app = FastAPI()


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
