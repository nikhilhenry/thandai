from typing import Union

from fastapi import FastAPI

app = FastAPI()


@app.get("/ping")
def ping():
    return {"msg":"pong"}

