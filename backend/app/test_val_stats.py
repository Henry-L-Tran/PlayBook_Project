from vlrggapi.api.scrape import Vlr
import json

def main():
    try:
        # Retrieve player stats from given region from past 14 days
        stats = Vlr.vlr_stats("eu", "1")
        # Write the result (a Python dictionary) to a JSON file
        with open("backend/app/valorant_data/val_recent_player_stats.json", "w") as file:
            json.dump(stats, file, indent=4)
    except Exception as e:
        print("Error retrieving player stats:", e)

if __name__ == "__main__":
    main()