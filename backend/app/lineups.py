import os
import json
import threading
import time
from datetime import datetime
from typing import List
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from nba_api.live.nba.endpoints import scoreboard


router = APIRouter()


##### Models #####

class LineupEntry(BaseModel):
    player_id: int
    player_name: str
    team_tri_code: str
    player_picture: str
    line_category: str
    projected_line: float
    users_pick: str

class SubmitLineup(BaseModel):
    email: str
    category: str
    entry_id: str
    entry_type: str
    entry_amount: float
    potential_payout: float
    entries: List[LineupEntry]



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


# Fetch Lineups from JSON File
def fetch_lineups():
    filepath = os.path.join(os.path.dirname(__file__), "lineups.json")
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r") as file:
        content = file.read().strip()
        return json.loads(content) if content else []


# Save Lineups to JSON File
def save_lineups(lineups):
    filepath = os.path.join(os.path.dirname(__file__), "lineups.json")
    with open(filepath, "w") as file:
        json.dump(lineups, file, indent=4)


# User Payout Function
def user_payout(email: str, payout: float):
    users = loadUsers()
    for user in users:
        if user["email"] == email:

            # Check Statement
            print(f"Paying {payout} to {email}")
            
            user["balance"] = user.get("balance", 0) + payout
            break
    saveUsers(users)


##### Routes #####
@router.post("/lineups/submit")
def submit_lineup(lineup_data: SubmitLineup):

    # Checks if the Lineup Has 2-6 Entries and Not All From the Same Team
    if len(lineup_data.entries) < 2 or len(lineup_data.entries) > 6:
        raise HTTPException(status_code=400, detail="Lineup must have at least 2 entries and at most 6 entries")

    team = set(player.team_tri_code for player in lineup_data.entries)
    if len(team) == 1:
        raise HTTPException(status_code=400, detail="Lineups cannnot just contain players from the same team")

    # Builds the New Lineup 
    new_lineup = {
        "email": lineup_data.email,
        "category": lineup_data.category,
        "entry_id": lineup_data.entry_id,
        "entry_type": lineup_data.entry_type,
        "entry_amount": lineup_data.entry_amount,
        "potential_payout": lineup_data.potential_payout,
        "entries": [entry.dict() for entry in lineup_data.entries],
        "time": datetime.utcnow().isoformat()
    }

    lineups = fetch_lineups()
    lineups.append(new_lineup)
    save_lineups(lineups)

    return {"message": "Lineup submitted successfully!"}

# Fetch All Lineups from a User
@router.get("/lineups/user/{email}")
def fetch_user_lineups(email: str):
    lineups = fetch_lineups()
    
    return {"lineups": [lineup for lineup in lineups if lineup["email"] == email]}


# Fetch and Updates All Live Stats From the User's Lineups Automatically
def fetch_user_live_lineup_data():
    while True:
        lineups = fetch_lineups()

        live_stats = {}
        try:
            with open("app/nba_data/live_player_data.json", "r") as file:
                data = json.load(file)
                for player in data["games"]:
                    live_stats[player["playerId"]] = player
        except:
            pass

        # Loads NBA Game Status to See if Game is Final or Not
        game_status = {}
        try:
            games = scoreboard.ScoreBoard().get_dict()["scoreboard"]["games"]
            for game in games:
                game_status[game["homeTeam"]["teamTricode"]] = game["gameStatus"]
                game_status[game["awayTeam"]["teamTricode"]] = game["gameStatus"]
        except Exception as e:
            print("Error fetching game status:", e)
            

        updated_lineups = []
        for lineup in lineups:
            games_final = True

            # The User's Number of Lines That They Hit
            hitLines = 0

            # Checks if the User's Lineup is Still Active or Not
            for entry in lineup["entries"]:
                player_id = entry["player_id"]
                line = entry["projected_line"]
                category = entry["line_category"]
                pick = entry["users_pick"]

                live_player = live_stats.get(player_id)
                if not live_player:
                    entry["live_value"] = "N/A"
                    entry["status"] = "pending"
                    games_final = False
                    continue

                # Checks if the Game is Final or Not
                team_tri_code = entry["team_tri_code"]
                if game_status.get(team_tri_code, 0) != 3:
                    games_final = False
                

                # Gets the Live Player Stats For Lineups Update
                if category == "PTS":
                    value = live_player["points"]
                elif category == "REB":
                    value = live_player["rebounds"]
                elif category == "AST":
                    value = live_player["assists"]
                elif category == "3PM":
                    value = live_player["3ptMade"]
                elif category == "BLKS + STLS":
                    value = live_player["blocks"] + live_player["steals"]
                elif category == "TO":
                    value = live_player["turnovers"]
                elif category == "PTS + REB":
                    value = live_player["points"] + live_player["rebounds"]
                elif category == "PTS + AST":
                    value = live_player["points"] + live_player["assists"]
                elif category == "REB + AST":
                    value = live_player["rebounds"] + live_player["assists"]
                elif category == "PTS + REB + AST":
                    value = live_player["points"] + live_player["rebounds"] + live_player["assists"]
                else:
                    value = 0

                entry["live_value"] = value

                # Checks if the User's Line Hits or Not
                if pick == "Over" and value > line:
                    entry["status"] = "hit"
                    hitLines += 1
                elif pick == "Under" and value < line:
                    entry["status"] = "hit"
                    hitLines += 1
                else:
                    entry["status"] = "miss"

            # Determines the Lineup Result
            if games_final:
                if lineup.get("result") is None or lineup["result"] == "IN PROGRESS":
                    if lineup["entry_type"] == "Power Play":
                        if hitLines == len(lineup["entries"]):
                            lineup["result"] = "WON"
                            user_payout(lineup["email"], lineup["potential_payout"])
                        else:
                            lineup["result"] = "LOST"
                    elif lineup["entry_type"] == "Flex Play":
                        if hitLines >= 2:
                            lineup["result"] = f"WON ({hitLines} of {len(lineup["entries"])})"
                            user_payout(lineup["email"], lineup["potential_payout"])
                        else:
                            lineup["result"] = "LOST"
                    else:
                        lineup["result"] = "LOST"

            updated_lineups.append(lineup)
            print("Game Status:", game_status)
        
        save_lineups(lineups)

        # 30 Second Delay Between Each Fetch
        time.sleep(30)

threading.Thread(target=fetch_user_live_lineup_data, daemon=True).start()











