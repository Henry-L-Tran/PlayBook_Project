import os
import json
import requests
from fastapi import FastAPI, HTTPException
from app.users import RegisterUser
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    # React Frontend
    "http://localhost:5173",
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
        data = json.load(file)

    return data["users"]

# Save Updated Users to JSON File
def saveUsers(users):
    with open("app/users.json", "w") as file:
        json.dump({"users": users}, file, indent = 4)


# Register Route
@app.post("/register")
def register(user_data: RegisterUser):
    users = loadUsers()

    # Check if Email Already Exists (Account Already Registered)
    for user in users:
        if user["email"] == user_data.email:
            raise HTTPException(status_code = 400, detail="Email already exists")
        
    # Create New User Object
    new_user = {
        "first_name": user_data.first_name,
        "last_name": user_data.last_name,
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

    return {"message": "User Registered"}



# Just a Check Route to Ensure Backend is Running
@app.get("/check")

def sports_check():
    return {"status": "Backend Running"}

