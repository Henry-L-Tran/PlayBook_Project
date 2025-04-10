import os
import json
import requests
import time
import threading
import pandas as pd
from fastapi import FastAPI, HTTPException
from app.users import RegisterUser
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from nba_api.live.nba.endpoints import scoreboard
from nba_api.stats.endpoints import boxscoretraditionalv2
from nba_api.stats.static import players
from nba_api.stats.endpoints import LeagueDashPlayerStats
from app import lineups
from vlrggapi.api.scrape import Vlr

app = FastAPI()
app.include_router(lineups.router)


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

##### Models #####

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


##### Methods #####

# Load Users from JSON File
def loadUsers():
    with open("app/users.json", "r") as file:
        data = json.load(file)

    return data["users"]

# Save Updated Users to JSON File
def saveUsers(users):
    with open("app/users.json", "w") as file:
        json.dump({"users": users}, file, indent = 4)


##### Routes #####

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

            gameDate = data["scoreboard"].get("gameDate", "N/A")
            filtered_nba_data = {
                "gameDate": gameDate,
                "gameData": []
            }

            for gameData in data["scoreboard"]["games"]:
                filtered_nba_data["gameData"].append({
                    "gameId": gameData["gameId"],
                    "gameStatus": gameData["gameStatus"],
                    "gameStatusText": gameData["gameStatusText"],
                    "gameClock": gameData["gameClock"],
                    "homeTeam": {
                        "teamId": gameData["homeTeam"]["teamId"],
                        "teamName": gameData["homeTeam"]["teamName"],
                        "teamTriCode": gameData["homeTeam"]["teamTricode"],
                        "wins": gameData["homeTeam"]["wins"],
                        "losses": gameData["homeTeam"]["losses"],
                        "score": gameData["homeTeam"]["score"],
                        "periods": gameData["homeTeam"]["periods"],
                    },
                    "awayTeam": {
                        "teamId": gameData["awayTeam"]["teamId"],
                        "teamName": gameData["awayTeam"]["teamName"],
                        "teamTriCode": gameData["awayTeam"]["teamTricode"],
                        "wins": gameData["awayTeam"]["wins"],
                        "losses": gameData["awayTeam"]["losses"],
                        "score": gameData["awayTeam"]["score"],
                        "periods": gameData["awayTeam"]["periods"],
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



# NBA Live Player Stats Route
@app.get("/nba/player_live_stats")
def nba_player_stats():
    try:
        with open("app/nba_data/live_player_data.json", "r") as file:
            data = json.load(file)
        return data
    
    except FileNotFoundError:
        return {"message": "No Live Player Stats Found"}
    

def fetch_player_live_stats():
    while True:
        try:
            games = scoreboard.ScoreBoard().get_dict()["scoreboard"]["games"]

            # Trying to Fetch Game IDs for Games that are In Progress or Completed
            game_ids = [game["gameId"] for game in games if game["gameStatus"] in (2, 3)]

            filtered_player_stats = []

            for game_id in game_ids:
                try:
                    boxscore = boxscoretraditionalv2.BoxScoreTraditionalV2(game_id=game_id)

                    # Using Normalized Dict to Avoid Matching Header w/ Values 
                    playerStats = boxscore.get_normalized_dict()["PlayerStats"]

                    for player in playerStats:
                        filtered_player_stats.append({
                            "gameId": game_id,
                            "playerId": player["PLAYER_ID"],
                            "playerName": player["PLAYER_NAME"],
                            "playerPosition": player["START_POSITION"],
                            "teamId": player["TEAM_ID"],
                            "teamTriCode": player["TEAM_ABBREVIATION"],
                            "points": player["PTS"],
                            "rebounds": player["REB"],
                            "assists": player["AST"],
                            "3ptMade": player["FG3M"],
                            "steals": player["STL"],
                            "blocks": player["BLK"],
                            "turnovers": player["TO"],
                        })

                    # Fetch Individual Player Stats Every 1.5 Seconds
                    time.sleep(1.5)

                except Exception as e:
                    print("Error: ", e)

            with open("app/nba_data/live_player_data.json", "w") as file:
                json.dump({"games": filtered_player_stats}, file, indent=4)

        except Exception as e:
            print("Error: ", e)

        # Refreshes All Player Stats in JSON File Every 30 Seconds
        time.sleep(30)

threading.Thread(target=fetch_player_live_stats, daemon=True).start()


# NBA Player Season Stats Route
@app.get("/nba/player_season_stats")
def nba_player_season_stats():
    try:
        with open("app/nba_data/player_season_data.json", "r") as file:
            data = json.load(file)
        return data
    
    except FileNotFoundError:
        return {"message": "No Player Season Stats Found"}
    

def fetch_player_season_stats():
    try:
        player_total_stats = LeagueDashPlayerStats(season="2024-25")

        # Gets the Main Stats Table
        stats = player_total_stats.get_data_frames()[0]

        # I'm Just Doing Players with More Than 20 Games Played for Filtering
        stats = stats[stats["GP"] > 20]

        # Players with More Than 14 Minutes For Filtering
        stats = stats[stats['MIN'] > 14]

        # If the Player Has All NULL Stats I'm Excluding Them
        stat_cols = ["PTS", "REB", "AST", "FG3M", "STL", "BLK", "TOV"]
        stats = stats[(stats[stat_cols] != 0).any(axis=1)]

        filtered_data = []

        # Dividing Totals by Games Played for Averages
        for index, row in stats.iterrows():

            # Avoiding Division by Zero
            games_played = row["GP"]
            if games_played == 0:
                games_played = 1

            filtered_data.append({
                "playerId": row["PLAYER_ID"],
                "playerName": row["PLAYER_NAME"],
                "teamTriCode": row["TEAM_ABBREVIATION"],
                "playerPicture": fetch_player_pictures(row["PLAYER_ID"]),
                "points": round(row["PTS"] / games_played, 1),
                "rebounds": round(row["REB"] / games_played, 1),
                "assists": round(row["AST"] / games_played, 1),
                "3ptMade": round(row["FG3M"] / games_played, 1),
                "steals": round(row["STL"] / games_played, 1),
                "blocks": round(row["BLK"] / games_played, 1),
                "turnovers": round(row["TOV"] / games_played, 1),
                "minutes": round(row["MIN"] / games_played, 1),
                "gamesPlayed": row["GP"]
            })

        with open("app/nba_data/player_season_data.json", "w") as file:
            json.dump({"players": filtered_data}, file, indent=4)

    except Exception as e:
        print("Error: ", e)

threading.Thread(target=fetch_player_season_stats, daemon=True).start()


# NBA Players' Pictures for Player Props
def fetch_player_pictures(player_id):
    return f"https://cdn.nba.com/headshots/nba/latest/1040x760/{player_id}.png"

# NBA Live Scores Route
@app.get("/nba/scores")
def nba_scores():
    try:
        with open("app/nba_data/live_nba_scores.json", "r") as file:
            data = json.load(file)
            return data
        
    except FileNotFoundError:
        return {"message": "No Scores Found"}

# Get VALORANT upcoming matches from API
def fetch_val_upcoming_matches():
    try:
        # Retrieve upcoming matches
        upcoming_matches = Vlr.vlr_upcoming_matches()
        filtered_matches = val_filter_matches(upcoming_matches)
        # Convert the result (a Python dictionary) to a JSON formatted string
        with open("backend/app/valorant_data/val_upcoming_matches.json", "w") as file:
                json.dump(filtered_matches, file, indent=4)
    except Exception as e:
        print("Error retrieving upcoming matches:", e)

# Get VALORANT current live matches from API
def fetch_val_live_matches():
    try:
        # Retrieve live matches
        live_Scores = Vlr.vlr_live_score()
        filtered_matches = val_filter_matches(live_Scores)
        # Write the result (a Python dictionary) to a JSON file
        with open("backend/app/valorant_data/val_live_scores.json", "w") as file:
            json.dump(filtered_matches, file, indent=4)
    except Exception as e:
        print("Error retrieving live matches:", e)

    # Update the score every 30 seconds
    time.sleep(30)

# Filter only tier 1 (Riot Partnered) teams matches
def val_filter_matches(matches: dict):
    t1_teams = ["100 Thieves", "Cloud9", "Evil Geniuses", "FURIA", "KRÜ Esports", "Leviatán", "LOUD", "MIBR", "NRG Esports", "Sentinels", "G2 Esports", "2Game Esports",
                "BBL Esports", "FNATIC", "FUT Esports", "GIANTX", "Karmine Corp", "KOI", "Natus Vincere", "Team Heretics", "Team Liquid", "Team Vitality", "Gentle Mates", "Apeks",
                "DetonatioN FocusMe", "DRX", "Gen.G", "Global Esports", "Paper Rex", "Rex Regum Qeon", "T1", "TALON", "Team Secret", "ZETA DIVISION", "Nongshim RedForce", "BOOM Esports"
                "Xi Lai Gaming", "Bilibili Gaming", "Trace Esports", "All Gamers", "Dragon Ranger Gaming", "Nova Esports", "TYLOO", "EDward Gaming", "JDG Esports", "Wolves Esports", "FunPlus Phoenix", "Titan Esports Club"]
    
    filtered_matches = []
    segments = matches.get("data", {}).get("segments", [])

    for game in segments:
        team1 = game["team1"].lower()
        team2 = game["team2"].lower()

        for team in t1_teams:
            lower_team = team.lower()

            if (team1 == lower_team or team2 == lower_team):
                 filtered_matches.append(game)
                 break

    return filtered_matches

# Get VALORANT player stats from given region from past 14 days from API
def fetch_val_recent_player_stats(region: str):
    try:
        # Retrieve player stats from given region from past 14 days
        stats = Vlr.vlr_stats(region, "14")
        # Write the result (a Python dictionary) to a JSON file
        with open("backend/app/valorant_data/val_recent_player_stats.json", "w") as file:
            json.dump(stats, file, indent=4)
    except Exception as e:
        print("Error retrieving player stats:", e)

# Fetch team names and logos from live matches
def fetch_team_logos():
    try:
        with open("backend/app/valorant_data/val_live_scores.json", "r") as file:
            data = json.load(file)
            logos = []

            get_segments = data.get("data", {}).get("segments", [])

            for game in get_segments:
                logos.append(
                    {
                        "team 1": game["team1"],
                        "team 2": game["team2"],
                        "team1_logo": game["team1_logo"],
                        "team2_logo": game["team2_logo"]
                    }
                )
            
            segments = {"segments": logos}
            data = {"data": segments}

            with open("backend/app/valorant_data/val_live_game_logos.json", "w") as file:
                json.dump(data, file, indent=4)
        
    except FileNotFoundError:
        return {"message": "No Scores Found"}
    
# VALORANT Live Scores Route
@app.get("/VALROANT/matches")
def val_matches():
    try:
        with open("backend/app/valorant_data/val_upcoming_matches.json", "r") as file:
            data = json.load(file)
            return data
        
    except FileNotFoundError:
        return {"message": "No Macthes Found"}

# VALORANT Live Scores Route
@app.get("/VALROANT/scores")
def val_live_scores():
    try:
        with open("backend/app/valorant_data/val_live_scores.json", "r") as file:
            data = json.load(file)
            return data
        
    except FileNotFoundError:
        return {"message": "No Scores Found"}
    
# VALORANT Player Stats Route
@app.get("/VALROANT/player_stats")
def val_player_stats():
    try:
        with open("backend/app/valorant_data/val_recent_player_stats.json", "r") as file:
            data = json.load(file)
            return data
        
    except FileNotFoundError:
        return {"message": "No Stats Found"}




