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
    matchup: str = "N/A"

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



# Payout Multiplier Function
def payout_multiplier(entry_type: str, total_legs: int, hit_legs: int) -> float:
    
    # Power Play Payouts
    if entry_type == "Power Play":
        if hit_legs == total_legs:
            if total_legs == 2:
                return 3
            elif total_legs == 3:
                return 5
            elif total_legs == 4:
                return 10
            elif total_legs == 5:
                return 20
            elif total_legs == 6:
                return 37.5
            
    # Flex Play Payouts
    elif entry_type == "Flex Play":
        if total_legs == 3:
            if hit_legs == 3:
                return 2.5
            elif hit_legs == 2:
                return 1
        elif total_legs == 4:
            if hit_legs == 4:
                return 5
            elif hit_legs == 3:
                return 1.5
        elif total_legs == 5:
            if hit_legs == 5:
                return 10
            elif hit_legs == 4:
                return 2
            elif hit_legs == 3:
                return 0.4
        elif total_legs == 6:
            if hit_legs == 6:
                return 25
            elif hit_legs == 5:
                return 2
            elif hit_legs == 4:
                return 0.4
            
    return 0
        

# User Payout Function
def user_payout(email: str, payout: float, user_win: bool):
    users = loadUsers()
    for user in users:
        if user["email"] == email:

            # Check Statement
            print(f"Paying {payout} to {email}")
            
            user["balance"] = user.get("balance", 0) + payout

            if user_win is True:
                user["wins"] = user.get("wins", 0) + 1
            elif user_win is False:
                user["losses"] = user.get("losses", 0) + 1
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

    # Checks if the User Exists in the Database
    users = loadUsers()
    user = next((user for user in users if user["email"] == lineup_data.email), None)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Checks if the User Has Enough Balance to Place the Bet
    if float(user["balance"]) < float(lineup_data.entry_amount):
        print("Insufficient balance")
        raise HTTPException(status_code=400, detail="Insufficient balance")
        
    
    # Deducts the Entry Amount from the User's Balance
    user["balance"] = round(float(user["balance"]) - float(lineup_data.entry_amount), 2)
    saveUsers(users)

    try:
        with open("app/nba_data/live_nba_scores.json", "r") as file:
            live_scores = json.load(file)
    except:
        live_scores = {"gameData": []}

    # Freezing the Lineup Matchup Data When Parlay is Placed
    def freeze_matchups_data(team_tri_code):
        for game in live_scores.get("gameData", []):
            if game["homeTeam"]["teamTriCode"] == team_tri_code or game["awayTeam"]["teamTriCode"] == team_tri_code:
                 return f'{game["awayTeam"]["teamTriCode"]} @ {game["homeTeam"]["teamTriCode"]}'
        return "N/A"
    
    frozen_entries = []

    for entry in lineup_data.entries:
        entry_dict = entry.dict()
        entry_dict["matchup"] = freeze_matchups_data(entry.team_tri_code)
        frozen_entries.append(entry_dict)

    # Builds the New Lineup 
    new_lineup = {
        "email": lineup_data.email,
        "category": lineup_data.category,
        "entry_id": lineup_data.entry_id,
        "entry_type": lineup_data.entry_type,
        "entry_amount": lineup_data.entry_amount,
        "potential_payout": lineup_data.potential_payout,
        "entries": frozen_entries,
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
                home = game.get("homeTeam", {})
                away = game.get("awayTeam", {})
                home_code = home.get("teamTricode") or home.get("teamTriCode")
                away_code = away.get("teamTricode") or away.get("teamTriCode")
                if home_code:
                    game_status[home_code] = game.get("gameStatus", 0)
                if away_code:
                    game_status[away_code] = game.get("gameStatus", 0)
        except Exception as e:
            print("Error fetching game status:", e)

        if not game_status:
            try:
                with open("app/nba_data/live_player_data.json", "r") as f:
                    player_data = json.load(f).get("games", [])
                    for player in player_data:
                        if player.get("playerPlayed"):
                            player_id = player.get("playerId")
                            status = player.get("gameStatus")
                            if player_id and status:
                                game_status[player_id] = status
            except Exception as e:
                print("Fallback player status load failed:", e)

            
        # Updates the User's Lineups
        updated_lineups = []
        for lineup in lineups:
            if lineup.get("evaluated") is True:
                updated_lineups.append(lineup)
                continue
                
            games_final = True

            # The User's Number of Legs That They Hit
            hit_legs = 0

            # Checks if the User's Lineup is Still Active or Not
            for entry in lineup["entries"]:
                player_id = entry["player_id"]
                line = entry["projected_line"]
                category = entry["line_category"]
                pick = entry["users_pick"]

                # If No Live Stats For the Player, Set Status to Pending, and Live Value to N/A
                live_player = live_stats.get(player_id)
                if not live_player:
                    entry["live_value"] = None
                    entry["status"] = "pending"
                    games_final = False
                    continue

                # If the Game is Final and Player Has Not Played, Set Status to DNP
                if live_player.get("playerPlayed") is False and live_player.get("gameStatus") == 3:
                    entry["live_value"] = "DNP"
                    entry["status"] = "DNP"
                    continue

                # Leaves the Entry as Pending if the Player Has Not Played and the Game is Not Final
                if live_player.get("playerPlayed") is False and live_player.get("gameStatus") != 3:
                    entry["live_value"] = None
                    entry["status"] = "pending"
                    games_final = False
                    continue

                team_code = entry["team_tri_code"]
                if game_status.get(team_code, 0) != 3:
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


                # If No Live Stats For the Player, Set Status to Pending, and Games Final to False
                if value is None:
                    entry["status"] = "pending"
                    games_final = False
                    continue

                # Checks if the User's Line Hits or Not
                if pick == "Over" and value > line:
                    entry["status"] = "hit"
                    hit_legs += 1
                elif pick == "Under" and value < line:
                    entry["status"] = "hit"
                    hit_legs += 1
                else:
                    entry["status"] = "miss"

            # Determines the Lineup Result
            if games_final:
                if lineup.get("result") is None or lineup["result"] == "IN PROGRESS":
                    
                    # If DNP, Parlay is Reduced to the Number of Valid Legs
                    valid_legs = [entry for entry in lineup["entries"] if entry["status"] != "DNP"]
                    total_legs = len(valid_legs)
                    hit_legs = len([entry for entry in valid_legs if entry["status"] == "hit"])
                    
                    # Refunds User w/ DNP Functionality (Gives User Back Their Entry Amount)
                    if (lineup["entry_type"] == "Power Play" and total_legs < 1) or (lineup["entry_type"] == "Flex Play" and total_legs <= 2):
                        lineup["result"] = "REFUNDED"
                        lineup["actual_payout"] = lineup["entry_amount"]
                        user_payout(lineup["email"], lineup["entry_amount"], user_win = None)
                    else:
                        multiplier = payout_multiplier(lineup["entry_type"], total_legs, hit_legs)

                        if multiplier > 0:
                            payout = round(lineup["entry_amount"] * multiplier, 2)
                            lineup["result"] = "WON"
                            lineup["actual_payout"] = payout
                            user_payout(lineup["email"], payout, user_win = True)
                        elif multiplier == 0:
                            lineup["result"] = "LOST"
                            lineup["actual_payout"] = 0
                            user_payout(lineup["email"], 0, user_win = False)

                # The Lineup Is Finalized, and The Live Data is Saved/Frozen
                lineup["evaluated"] = True

            updated_lineups.append(lineup)
            print("Game Status:", game_status)
        
        save_lineups(lineups)

        # 30 Second Delay Between Each Fetch
        time.sleep(30)

threading.Thread(target=fetch_user_live_lineup_data, daemon=True).start()











