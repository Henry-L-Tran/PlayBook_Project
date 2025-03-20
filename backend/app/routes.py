import os
import json
import requests
import time
import threading
from fastapi import FastAPI, HTTPException
from app.users import RegisterUser
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from nba_api.live.nba.endpoints import scoreboard


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

class LoginRequest(BaseModel):
    email: str
    password: str


class CardInfo(BaseModel):
    email: str
    card_type: str
    card_number: str
    expiration_date: str
    cvv: str

class DepositOrWithdraw(BaseModel):
    email: str
    amount: int


# Load Users from JSON File
def loadUsers():
    with open("app/users.json", "r") as file:
        data = json.load(file)

    return data["users"]

# Save Updated Users to JSON File
def saveUsers(users):
    with open("app/users.json", "w") as file:
        json.dump({"users": users}, file, indent = 4)


####### ROUTES #######

# Just a Check Route to Ensure Backend is Running
@app.get("/check")

def sports_check():
    return {"status": "Backend Running"}


# User Login Route
@app.get("/funds/user/{email}")
def get_curr_user(email: str):
    users = loadUsers()

    for user in users:
        if user["email"] == email:
            return user
        
    raise HTTPException(status_code=400, detail="User Not Found")


# Funds/Adding Card Information Route
@app.post("/funds/add_card_info")
def add_card_info(request: CardInfo):
    users = loadUsers()

    # Check if User Exists from Email 
    for user in users:
        if user["email"] == request.email:
            user["payment_info"] = {
                "credit_card": True,
                "card_type": request.card_type,
                "card_number": request.card_number,
                "expiration_date": request.expiration_date,
                "cvv": request.cvv
            }

            # Save Updated User Information to JSON File
            saveUsers(users)
            return {"message": "Card Information Added Successfully"}
        
    raise HTTPException(status_code=400, detail="User Not Found")

# Funds/Deposit Route
@app.post("/funds/deposit")
def deposit(request: DepositOrWithdraw):
    users = loadUsers()

    # Check if User Exists from Email
    for user in users:

        if user["email"] == request.email:
            if not user.get("payment_info") or not any(user["payment_info"].values()):
                return {"message": "No Card Found. Add a Card"}
            
            # Deposit Amount to User Balance and Update JSON File
            user["balance"] = user.get("balance", 0) + request.amount
            saveUsers(users)

            return {"message": "Deposit Successful!", "balance": user["balance"]}

    raise HTTPException(status_code = 400, detail="User Not Found. Deposit Failed")


# Funds/Withdraw Route
@app.post("/funds/withdraw")
def withdraw(request: DepositOrWithdraw):
    users = loadUsers()

    # Check if User Exists from Email
    for user in users:
        if user["email"] == request.email:
            if not user.get("payment_info") or not any(user["payment_info"].values()):
                return {"message": "No Card Found. Add a Card"}
            
            # Withdraw Funds If User Balance is Greater than Withdrawal Amount and Update JSON File
            if user.get("balance", 0) >= request.amount:
                user["balance"] -= request.amount
                saveUsers(users)

                return {"message": "Withdrawal Successful!", "balance": user["balance"]}
            
            else:
                return {"message": "Withdrawal Failed. Insufficient Funds"}
    
    raise HTTPException(status_code = 400, detail="User Not Found. Withdrawal Failed")


# Login Route
@app.post("/login")
def login(request: LoginRequest):
    users = loadUsers()

    for user in users:
        # Checks if Email and Password Match with User in JSON File
        if user["email"] == request.email and user["password"] == request.password:

            # Logs In if Email and Password Match
            return {"message": "Login Successful", "user": user}
        
    raise HTTPException(status_code = 400, detail="Invalid Credentials")
    

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
        "balance": user_data.balance,
        "payment_info": {
            "credit_card": user_data.payment_info.credit_card,
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


# NBA Live Scores Route
@app.get("/nba/scores")
def nba_scores():
    try:
        with open("app/nba_data/live_nba_scores.json", "r") as file:
            data = json.load(file)
            return data
        
    except FileNotFoundError:
        return {"message": "No Scores Found"}


def fetch_nba_live_scores():
    while True:
        try:
            # Fetch NBA Live Scores from NBA API
            scores = scoreboard.ScoreBoard()
            data = scores.get_dict()

            filtered_nba_data = []

            for games in data["scoreboard"]["games"]:
                filtered_nba_data.append({
                    "gameId": games["gameId"],
                    "gameStatus": games["gameStatus"],
                    "gameClock": games["gameClock"],
                    "gameTimeUTC": games["gameTimeUTC"],
                    "homeTeam": {
                        "teamId": games["homeTeam"]["teamId"],
                        "teaName": games["homeTeam"]["teamName"],
                        "teamTriCode": games["homeTeam"]["teamTricode"],
                        "wins": games["homeTeam"]["wins"],
                        "losses": games["homeTeam"]["losses"],
                        "score": games["homeTeam"]["score"],
                        "periods": games["homeTeam"]["periods"],
                    },
                    "awayTeam": {
                        "teamId": games["awayTeam"]["teamId"],
                        "teamName": games["awayTeam"]["teamName"],
                        "teamTriCode": games["awayTeam"]["teamTricode"],
                        "wins": games["awayTeam"]["wins"],
                        "losses": games["awayTeam"]["losses"],
                        "score": games["awayTeam"]["score"],
                        "periods": games["awayTeam"]["periods"],
                    }
                })


            # Save NBA Live Scores to JSON File
            with open("app/nba_data/live_nba_scores.json", "w") as file:
                json.dump(filtered_nba_data, file, indent=4)

        except Exception as e:
            print(e)

        # Fetch NBA Live Scores Every 30 Seconds
        time.sleep(30)

threading.Thread(target=fetch_nba_live_scores, daemon=True).start()

