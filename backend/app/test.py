from vlrggapi.api.scrape import Vlr
import json

def main():
    try:
        # Retrieve upcoming matches using the aggregated function.
        stats = Vlr.vlr_stats("na", "14")
        # Write the result (a Python dictionary) to a JSON file.
        with open("backend/app/valorant_data/val_recent_player_stats.json", "w") as file:
            json.dump(stats, file, indent=4)
    except Exception as e:
        print("Error retrieving upcoming matches:", e)

if __name__ == "__main__":
    main()