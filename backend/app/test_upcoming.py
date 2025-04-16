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

def main():
    try:
        # Retrieve match results and filter them
        player_stats = Vlr.vlr_stats("all", "30")
        # Write the result (a Python dictionary) to a JSON file
        with open("app/valorant_data/val_recent_player_stats.json", "w") as file:
            json.dump(player_stats, file, indent=4)
    except Exception as e:
        print("Error retrieving live matches:", e)

    

if __name__ == "__main__":
    main()
