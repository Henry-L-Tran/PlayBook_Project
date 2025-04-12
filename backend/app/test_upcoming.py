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
        reg_pattern = r"^/(\d{6})/" # Regex pattern to get match_id

        # Get match results and filter them to tier 1 matches
        matches = Vlr.vlr_match_results()
        filtered_matches = val_filter_matches(matches)
        match_results = []

        player_attrs = ['player_1', 'player_2', 'player_3', 'player_4', 'player_5']

        # Loop through all matches
        for match in filtered_matches:
            # Grab match_id from vlr link
            match_page = match["match_page"]
            match_id_temp = re.search(reg_pattern, match_page)
            match_id = match_id_temp.group(1)
            
            # Grab stats from first 2 maps
            match_map_1 = valdata.Round(valdata.Match(match_id).rounds[0], match_id)
            match_map_2 = valdata.Round(valdata.Match(match_id).rounds[1], match_id)

            team1_players = {}
            team2_players = {}

            # Assign initial kills for both teams
            for attr in player_attrs:
                # Dynamically get the player object from team A using getatt.
                player_a = getattr(match_map_1.team_a, attr)
                key_a = player_a.name.lower()
                team1_players[key_a] = int(player_a.kills)

                # Similarly for team B.
                player_b = getattr(match_map_1.team_b, attr)
                key_b = player_b.name.lower()
                team2_players[key_b] = int(player_b.kills)

            # Add to the kills already recorded.
            for attr in player_attrs:
                player_a = getattr(match_map_2.team_a, attr)
                key_a = player_a.name.lower()
                team1_players[key_a] += int(player_a.kills)

                player_b = getattr(match_map_2.team_b, attr)
                key_b = player_b.name.lower()
                team2_players[key_b] += int(player_b.kills)

            match_results.append(
                {
                    "match_id": match_id,


                    "teama": match["team1"],
                    "player1a": match_map_1.team_a.player_1.name,
                    "player1a_kills": team1_players.get(match_map_1.team_a.player_1.name.lower()),

                    "player2a": match_map_1.team_a.player_2.name,
                    "player2a_kills": team1_players.get(match_map_1.team_a.player_2.name.lower()),

                    "player3a": match_map_1.team_a.player_3.name,
                    "player3a_kills": team1_players.get(match_map_1.team_a.player_3.name.lower()),

                    "player4a": match_map_1.team_a.player_4.name,
                    "player4a_kills": team1_players.get(match_map_1.team_a.player_4.name.lower()),

                    "player5a": match_map_1.team_a.player_5.name,
                    "player5a_kills": team1_players.get(match_map_1.team_a.player_5.name.lower()),


                    "teamb": match["team2"],
                    "player1b": match_map_1.team_b.player_1.name,
                    "player1b_kills": team2_players.get(match_map_1.team_b.player_1.name.lower()),

                    "player2b": match_map_1.team_b.player_2.name,
                    "player2b_kills": team2_players.get(match_map_1.team_b.player_2.name.lower()),

                    "player3b": match_map_1.team_b.player_3.name,
                    "player3b_kills": team2_players.get(match_map_1.team_b.player_3.name.lower()),

                    "player4b": match_map_1.team_b.player_4.name,
                    "player4b_kills": team2_players.get(match_map_1.team_b.player_4.name.lower()),

                    "player5b": match_map_1.team_b.player_5.name,
                    "player5b_kills": team2_players.get(match_map_1.team_b.player_5.name.lower()),
                }
            )

            with open("app/valorant_data/val_player_kills.json", "w") as file:
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
