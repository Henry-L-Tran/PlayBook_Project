import os
import json
from datetime import datetime
from typing import List
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException


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








