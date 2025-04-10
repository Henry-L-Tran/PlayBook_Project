from vlrggapi.api.scrape import Vlr
import json

def main():
    try:
        # Retrieve live matches
        live_Scores = Vlr.vlr_live_score()
        filtered_matches = filter(live_Scores)
        # Write the result (a Python dictionary) to a JSON file
        with open("backend/app/valorant_data/val_live_scores.json", "w") as file:
            json.dump(filtered_matches, file, indent=4)
    except Exception as e:
        print("Error retrieving live matches:", e)

def filter(matches: dict):
    t1_teams = ["100 Thieves", "Cloud9", "Evil Geniuses", "FURIA", "KRÜ Esports", "Leviatán", "LOUD", "MIBR", "NRG Esports", "Sentinels", "G2 Esports", "2Game Esports",
                "BBL Esports", "FNATIC", "FUT Esports", "GIANTX", "Karmine Corp", "KOI", "Natus Vincere", "Team Heretics", "Team Liquid", "Team Vitality", "Gentle Mates", "Apeks",
                "DetonatioN FocusMe", "DRX", "Gen.G", "Global Esports", "Paper Rex", "Rex Regum Qeon", "T1", "TALON", "Team Secret", "ZETA DIVISION", "Nongshim RedForce", "BOOM Esports"]
    
    filtered_matches = []
    segments = matches.get("data", {}).get("segments", [])

    for game in segments:
        team1 = game["team1"]
        team2 = game["team2"]

        for team in t1_teams:
            if (team1 == team or team2 == team):
                 filtered_matches.append(game)
                 break

    return filtered_matches



if __name__ == "__main__":
    main()