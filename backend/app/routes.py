import os
import json
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    # React Frontend
    "http://localhost:5173",

    # Alternative localhost Address for Frontend
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,

    # Specifies the Frontend Origins Allowed to Access the Backend
    allow_origins=origins,
    allow_credentials=True,

    # Allow All HTTP Methods (GET, POST, etc.)
    allow_methods=["*"],
    # Allow All Headers
    allow_headers=["*"],
)

@app.get("/sports/nba")

def sports_check():
    return {"status": "Backend Running"}

