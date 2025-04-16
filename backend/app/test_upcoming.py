import os
import sys

# Determine the path to the parent directory
current_dir = os.path.dirname(__file__)
parent_dir = os.path.abspath(os.path.join(current_dir, '..'))

# Insert the parent directory at the beginning of sys.path if it's not already included
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from vlrggapi.api.scrape import Vlr
import json
from valorantproapi import data as valdata
import re

# Get VALORANT upcoming matches from API
def main():
    try:
        # Retrieve match results and filter them
        player_stats = Vlr.vlr_stats("all", "30")
        # Write the result (a Python dictionary) to a JSON file
        with open("backend/app/valorant_data/val_recent_player_stats.json", "w") as file:
            json.dump(player_stats, file, indent=4)
    except Exception as e:
        print("Error retrieving live matches:", e)

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

    

if __name__ == "__main__":
    main()
