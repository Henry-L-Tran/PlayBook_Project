import os
import json
import requests
from fastapi import FastAPI, HTTPException
from app.models import RegisterUser
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

# Load Users from JSON File
def loadUsers():
    with open("app/users.json", "r") as file:
        users = json.load(file)

    return users

# Save Updated Users to JSON File
def saveUsers(users):
    with open("apps/users.json", "w") as file:
        json.dump(users, file, indent = 4)


# Register Route
@app.get("/register")
def register(user_data: RegisterUser):
    users = loadUsers()

    for user in users:
        if user["email"] == user_data.email:
            raise HTTPException(status_code = 400, detail="Email already exists")
        
    # Create New User Object
    new_user = {
        "firstName": user_data.first_name,
        "lastName": user_data.last_name,
        "email": user_data.email,
        "password": user_data.password,
        "address": user_data.address,
        "birthday": user_data.birthday,
        "payment_info": {
            "credit_card": user_data.payment_info.credit_card,
            "bank_account": user_data.payment_info.bank_account,
            "card_type": user_data.payment_info.card_type,
            "card_number": user_data.payment_info.card_number,
            "expiration_date": user_data.payment_info.expiration_date,
            "cvv": user_data.payment_info.cvv
        }
    }

    # Append New User to Users List and Save to JSON File
    users.append(new_user)
    saveUsers(users)

    return {"status": "User Registered"}



@app.get("/check")

def sports_check():
    return {"status": "Backend Running"}

