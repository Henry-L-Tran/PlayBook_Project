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
        reg_pattern = r"vlr\.gg/(\d{6})/" # Regex pattern to get match_id

        # Get match results and filter them to tier 1 matches
        matches = Vlr.vlr_live_score()
        filtered_matches = val_filter_matches(matches)
        match_results = []

        # Loop through all matches
        for match in filtered_matches:
            # Grab match_id from vlr link
            match_page = match["match_page"]
            match_id_temp = re.search(reg_pattern, match_page)
            match_id = match_id_temp.group(1)
            print("MatchID: ", match_id)
            
            # Get players from each team
            team1_player_data = valdata._get_basic_players(match_id, match["team1"], True)
            team2_player_data = valdata._get_basic_players(match_id, match["team2"], False)

            match_results.append(
                {
                    "match_id": match_id,


                    "teama": match["team1"],
                    "player1a": team1_player_data[0].name,
                    "player2a": team1_player_data[1].name,
                    "player3a": team1_player_data[2].name,
                    "player4a": team1_player_data[3].name,
                    "player5a": team1_player_data[4].name,


                    "teamb": match["team2"],
                    "player1b": team2_player_data[0].name,
                    "player2b": team2_player_data[1].name,
                    "player3b": team2_player_data[2].name,
                    "player4b": team2_player_data[3].name,
                    "player5b": team2_player_data[4].name,
                }
            )

        with open("backend/app/valorant_data/val_live_players.json", "w") as file:
            json.dump(match_results, file, indent=4)

    except Exception as e:
        print("Error retrieving match results:", e)

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
