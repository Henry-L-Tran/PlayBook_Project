from vlrggapi.api.scrape import Vlr
import json

def main():
    try:
        # Retrieve upcoming matches using the aggregated function.
        live_Scores = Vlr.vlr_live_score()
        # Write the result (a Python dictionary) to a JSON file.
        with open("backend/app/valorant_data/val_live_scores.json", "w") as file:
            json.dump(live_Scores, file, indent=4)
    except Exception as e:
        print("Error retrieving upcoming matches:", e)

if __name__ == "__main__":
    main()