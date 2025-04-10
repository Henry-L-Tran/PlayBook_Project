from vlrggapi.api.scrape import Vlr
import json

def main():
    try:
        # Retrieve player stats from given region from past 14 days
        stats = Vlr.vlr_stats("na", "1")
        filtered_players = val_filter_players_teams(stats)
        # Write the result (a Python dictionary) to a JSON file
        with open("backend/app/valorant_data/val_recent_player_stats.json", "w") as file:
            json.dump(filtered_players, file, indent=4)
    except Exception as e:
        print("Error retrieving player stats:", e)

def val_filter_players_teams(player_stats: dict):
    t1_teams_appr = ["100T", "C9", "EG", "FUR", "KRÜ", "LEV", "LOUD", "MIBR", "NRG", "SEN", "G2", "2G",
                    "BBL", "FNC", "FUT", "GX", "KC", "MKOI", "NAVI", "TH", "TL", "VIT", "M8", "APK",
                    "DFM", "DRX", "GEN", "GE", "PRX", "RRQ", "T1", "TLN", "TS", "ZETA", "NS", "BME"
                    "XLG", "BLG", "TE", "AG", "DRG", "NOVA", "TYL", "EDG", "JDG", "WOL", "FPX", "TEC"]
    
    filtered_players = []
    segments = player_stats.get("data", {}).get("segments", [])

    for stats in segments:
        org = stats["org"].lower()

        for team in t1_teams_appr:
            lower_team = team.lower()

            if (org == lower_team):
                 filtered_players.append(stats)
                 break

    return filtered_players

if __name__ == "__main__":
    main()