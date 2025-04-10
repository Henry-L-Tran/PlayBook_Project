from vlrggapi.api.scrape import Vlr
import json

def main():
    try:
        # Retrieve upcoming matches
        upcoming_matches = Vlr.vlr_upcoming_matches()
        filtered_matches = filter(upcoming_matches)
        # Convert the result (a Python dictionary) to a JSON formatted string
        with open("backend/app/valorant_data/val_upcoming_matches.json", "w") as file:
                json.dump(filtered_matches, file, indent=4)
    except Exception as e:
        print("Error retrieving upcoming matches:", e)

def filter(matches: dict):
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