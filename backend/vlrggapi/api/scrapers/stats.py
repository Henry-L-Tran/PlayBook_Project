import requests
from selectolax.parser import HTMLParser

from vlrggapi.utils.utils import headers


def vlr_stats(region: str, timespan: str):
    base_url = f"https://www.vlr.gg/stats/?event_group_id=74&event_id=all&region={region}&min_rounds=&min_rating=&agent=all&map_id=all&timespan=all"
    url = (
        f"{base_url}&timespan=all"
        if timespan.lower() == "all"
        else f"{base_url}&timespan={timespan}d"
    )

    resp = requests.get(url, headers=headers)
    html = HTMLParser(resp.text)
    status = resp.status_code

    t1_teams = ["100 Thieves", "Cloud9", "Evil Geniuses", "FURIA", "KRÜ Esports", "Leviatán", "LOUD", "MIBR", "NRG Esports", "Sentinels", "G2 Esports", "2Game Esports",
                "BBL Esports", "FNATIC", "FUT Esports", "GIANTX", "Karmine Corp", "KOI", "Natus Vincere", "Team Heretics", "Team Liquid", "Team Vitality", "Gentle Mates", "Apeks",
                "DetonatioN FocusMe", "DRX", "Gen.G", "Global Esports", "Paper Rex", "Rex Regum Qeon", "T1", "TALON", "Team Secret", "ZETA DIVISION", "Nongshim RedForce", "BOOM Esports",
                "Xi Lai Gaming", "Bilibili Gaming", "Trace Esports", "All Gamers", "Dragon Ranger Gaming", "Nova Esports", "TYLOO", "EDward Gaming", "JDG Esports", "Wolves Esports", "FunPlus Phoenix", "Titan Esports Club"]

    t1_teams_appr = ["100T", "C9", "EG", "FUR", "KRÜ", "LEV", "LOUD", "MIBR", "NRG", "SEN", "G2", "2G",
                     "BBL", "FNC", "FUT", "GX", "KC", "MKOI", "NAVI", "TH", "TL", "VIT", "M8", "APK",
                     "DFM", "DRX", "GEN", "GE", "PRX", "RRQ", "T1", "TLN", "TS", "ZETA", "NS", "BME",
                     "XLG", "BLG", "TE", "AG", "DRG", "NOVA", "TYL", "EDG", "JDG", "WOL", "FPX", "TEC"]
    
    full_org = {}
    counter = 0

    for teams in t1_teams:
        full_org[t1_teams_appr[counter]] = teams
        counter += 1

    result = []
    for item in html.css("tbody tr"):
        player = item.text().replace("\t", "").replace("\n", " ").strip().split()
        player_name = player[0]
        org = player[1] if len(player) > 1 else "N/A"
        full_org_name = ""
        
        for team in t1_teams_appr:
            if org == team:
                full_org_name = full_org[org]
        
        if full_org_name == "":
            full_org_name = "N/A"

        color_sq = [stats.text() for stats in item.css("td.mod-color-sq")]

        result.append(
            {
                "player": player_name,
                "org": full_org_name,
                "average_kills_map": 20 * float(color_sq[5]),
                "line": 20 * float(color_sq[5]) * 2,
            }
        )

    segments = {"status": status, "segments": result}
    data = {"data": segments}

    if status != 200:
        raise Exception("API response: {}".format(status))
    return data
