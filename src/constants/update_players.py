"""Update the players json files using the Liquipedia API"""

import json
from collections import Counter
from datetime import datetime
from random import shuffle
from time import sleep

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://liquipedia.net/rocketleague/api.php?action=parse&format=json&page="
HEADERS = {
    "Accept-Encoding": "gzip",
    "User-Agent": "RLEGuessr (https://rleguessr.vercel.app/; romain.richard.IT.engineer@gmail.com)",
}
# https://liquipedia.net/api-terms-of-use states:
# API "action=parse" requests should not exceed 1 request per 30 seconds
# as these are more resource intensive.
RATE_LIMIT_SECONDS = 30
LAST_REQUEST = None
REGIONS = {
    "Europe": "EU",
    "North America": "NA",
    "South America": "SAM",
    "Oceania": "OCE",
    "Asia": "APAC",
    "Middle East": "MENA",
    "Africa": "SSA",
}


def _get_page(page):
    """Get a page using the Liquipedia API"""
    # Ratelimit
    global LAST_REQUEST
    if LAST_REQUEST is not None:
        delay = RATE_LIMIT_SECONDS - (datetime.now() - LAST_REQUEST).total_seconds()
        if delay > 0:
            print(f"{datetime.now()} Sleeping for {int(delay)} seconds")
            sleep(delay)
    LAST_REQUEST = datetime.now()

    print(f"{datetime.now()} Getting page {page}")
    resp = requests.get(f"{BASE_URL}{page}", headers=HEADERS)
    resp.raise_for_status()
    resp_parse = resp.json()["parse"]

    page_id = resp_parse["pageid"]
    page_html = resp_parse["text"]["*"]
    soup = BeautifulSoup(page_html, "html.parser")

    return {"id": page_id, "html": soup}


def _get_rlcs_lans():
    """Get the list of RLCS LANs that have happened"""
    rlcs_lans = []

    page = _get_page("S-Tier_Tournaments")
    # Only select premier (RLCS) tournaments
    for tournament in page["html"].select(
        "div[class='divRow tournament-card-premier tournament-card-premier']"
    ):
        # If the tournament hasn't happened yet, don't include it.
        # The obivous way to check this would be to parse the date column and
        # compare it to the current date. But instead of doing all of that we
        # can also just check the winner column.
        winner_tbd = (
            tournament.select_one("div[class='divCell Placement FirstPlace']")
            .select_one("span[class='team-template-text']")
            .select_one("abbr[title='To Be Determined']")
        )
        if winner_tbd:
            # If the winner of the tournament is TBD, the tournament hasn't
            # happened yet so skip it.
            continue

        # Get the location of the tournament to know if it was online or a LAN
        location = tournament.select_one(
            "div[class='divCell EventDetails-Left-60 Header-Premier']"
        ).text.strip()
        # If it was an online tournament, skip it.
        if location.startswith("Online,"):
            continue

        # It was a LAN that already happened, add it to the list.
        url = (
            tournament.select_one("div[class='divCell Tournament Header-Premier']")
            .select_one("b")
            .select_one("a")
            .get("href")
            .split("/rocketleague/")[-1]
        )
        rlcs_lans.append(url)

    return rlcs_lans


def _get_lan_players(lan):
    """Get the list of players that participated to the LAN"""
    players = []

    page = _get_page(lan)
    children = page["html"].select_one("div[class=mw-parser-output]").children
    for child in children:
        # Some children are just strings, they're not what we're looking for
        if not hasattr(child, "select"):
            continue

        # In https://liquipedia.net/rocketleague/Rocket_League_Championship_Series/Season_3
        # there are 2 teams who played a showmatch. We don't want to include
        # those so we go through the page and stop if we get to the Results.
        if child.select("span[id='Results']"):
            break

        teams = child.select("div[class='teamcard-inner']")
        # Go through each team one by one
        for team in teams:
            # Add the main players
            for tr in team.select_one("table[data-toggle-area-content='1']").select(
                "tr"
            ):
                if tr.select_one("th") and tr.select_one("th").text in "123":
                    url = tr.select("a")[-1].get("href").split("/rocketleague/")[-1]
                    players.append(url)

            # Add the substitute if they played
            subs = team.select_one("table[data-toggle-area-content='2']")
            if subs:
                for tr in subs.select("tr"):
                    if (
                        tr.select_one("th")
                        and tr.select_one("th").text == "S"
                        and not tr.select_one("abbr[title='Did not play']")
                    ):
                        url = tr.select("a")[-1].get("href").split("/rocketleague/")[-1]
                        players.append(url)

    return players


def get_players():
    """Get the list of all the players who participated in an RLCS LAN"""
    players = []
    lans = _get_rlcs_lans()
    for lan in lans:
        players.extend(_get_lan_players(lan))
    # Sorting the players by name so we can get a rough idea of how far
    # into the execution we are when looking at stdout.
    return sorted(Counter(players).items())


def _get_player_info(page, rlcs_lan_appearances):
    """Get the needed information about the player"""
    divs = [
        div.text
        for div in page["html"].select_one("div[class='fo-nttax-infobox']").children
    ]
    info = {
        "id": page["id"],
        "rlcsLanAppearances": rlcs_lan_appearances,
        "name": divs[0].split("\xa0")[-1].split("]")[-1].strip(),
        "team": "None",
    }
    for div in divs:
        if div.startswith("Name:"):
            # In some cases, for example https://liquipedia.net/rocketleague/M7sn,
            # we want to grab the player's romanized name. Based on some quick
            # checking it looks like the romanized name is always below the name
            # and would then overwrite it. But just in case it is swapped one day,
            # only set the player's fullName if it wasn't already set.
            if "fullName" not in info:
                info["fullName"] = div.split("Name:")[1]
        elif div.startswith("Romanized Name:"):
            info["fullName"] = div.split("Romanized Name:")[1]
        elif div.startswith("Nationality:"):
            # Some players have double nationality, we only keep the first one
            info["nationality"] = div.split("\xa0")[1]
        elif div.startswith("Born:"):
            info["DOB"] = datetime.strptime(
                div.split(" (age")[0], "Born:%B %d, %Y"
            ).strftime("%d-%m-%Y")
        elif div.startswith("Region:"):
            info["region"] = REGIONS[div.split("\xa0")[1]]
        elif div.startswith("Team:"):
            info["team"] = div.split("Team:")[1]

    return info


def get_players_info(players):
    players_info = {}

    for url, rlcs_lan_appearances in players:
        # If we've already fecthed the player's page, update the info
        if url in players_info:
            print(f"{datetime.now()} Already got {url}")
            players_info[url]["rlcsLanAppearances"] += rlcs_lan_appearances
            continue

        # Get the player's page
        page = _get_page(url)

        # Sometimes the players names are listed in multiple ways (for example
        # Squishy and SquishyMuffinz). There's only one proper url per player,
        # the others redirect to it.
        # Here we check if we got a redirect and load it if that's the case.
        redirect = page["html"].select_one("div[class='redirectMsg']")
        if redirect:
            url = redirect.select_one("a").get("href").split("/rocketleague/")[-1]
            print(f"{datetime.now()} Redirect -> {url}")

            # If we've already fecthed the player's page, update the info
            if url in players_info:
                print(f"{datetime.now()} Already got {url}")
                players_info[url]["rlcsLanAppearances"] += rlcs_lan_appearances
                continue

            # Get the player's page
            page = _get_page(url)

        players_info[url] = _get_player_info(page, rlcs_lan_appearances)

    return list(players_info.values())


def compute_diff(old_players, new_players):
    """Return the diff of the players"""
    diff = {}

    old_players_dict = {p["name"]: p for p in old_players}
    new_players_dict = {p["name"]: p for p in new_players}

    removed = sorted(
        set(old_players_dict) - set(new_players_dict), key=lambda x: x.lower()
    )
    for name in removed:
        diff[name] = f"[removed] {name}: {dict(sorted(old_players_dict[name].items()))}"

    added = sorted(
        set(new_players_dict) - set(old_players_dict), key=lambda x: x.lower()
    )
    for name in added:
        diff[name] = f"[added]   {name}: {dict(sorted(new_players_dict[name].items()))}"

    changed = sorted(
        set(new_players_dict) & set(old_players_dict), key=lambda x: x.lower()
    )
    for name in changed:
        new_player = new_players_dict[name]
        old_player = old_players_dict[name]
        diff_player = {}
        for key, value in sorted(new_player.items()):
            if value != old_player[key]:
                diff_player[key] = f"{old_player[key]} -> {value}"
        if diff_player:
            diff[name] = f"[changed] {name}: {diff_player}"

    return diff


def create_json_files(players_info):
    """Create the needed json files"""
    players_info.sort(key=lambda x: x["name"].lower())

    # If players_info is the same as what we already had locally, stop the
    # execution now so we don't unnecessarily reshuffle players2.json
    try:
        with open("players.json", "r") as f:
            old = json.load(f)
    except FileNotFoundError:
        pass
    else:
        if players_info == old:
            print(f"{datetime.now()} Local files already up to date, stopping")
            return
        else:
            diff = compute_diff(old, players_info)

    print(f"{datetime.now()} Saving players.json")
    with open("players.json", "w") as f:
        json.dump(players_info, f, indent=2, sort_keys=True)

    shuffle(players_info)
    print(f"{datetime.now()} Saving players2.json")
    with open("players2.json", "w") as f:
        json.dump(players_info, f, indent=2, sort_keys=True)

    print(f"{datetime.now()} Here's what changed:")
    for name in sorted(diff, key=lambda x: x.lower()):
        print(diff[name])


def main():
    players = get_players()
    players_info = get_players_info(players)
    create_json_files(players_info)


if __name__ == "__main__":
    main()
