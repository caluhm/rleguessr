"""Update the players json files using the Liquipedia API"""

import json
import logging
from collections import Counter
from datetime import datetime
from random import shuffle
from re import match
from time import sleep

import requests
import requests_cache
from bs4 import BeautifulSoup

# We often have to run the script multiple times because something changed
# in the Liquipedia pages. As a result it takes hours to fully complete.
# By adding a cache, the first run will still take a couple of hours but
# the subsequent ones will take a few seconds.
# Setting the cache to expire after a week should be enough to finish updating
# the script.
REQUEST_CACHE_DURATION = 7 * 24 * 60 * 60
REQUEST_TIMEOUT = 10

BASE_URL = "https://liquipedia.net/rocketleague/api.php?action=parse&format=json&page="
HEADERS = {
    "Accept-Encoding": "gzip",
    "User-Agent": "RLEGuessr (https://rleguessr.vercel.app/; romain.richard.IT.engineer@gmail.com)",
}
# https://liquipedia.net/api-terms-of-use states:
# API "action=parse" requests should not exceed 1 request per 30 seconds
# as these are more resource intensive.
RATE_LIMIT_SECONDS = 30
# When the last request to the Liquipedia API was made.
LAST_REQUEST_TIME = None
# On Liquipedia the regions are listed with their full names but we want their
# code names.
REGIONS = {
    "Europe": "EU",
    "North America": "NA",
    "South America": "SAM",
    "Oceania": "OCE",
    "Asia": "APAC",
    # Catalysm's region is listed as Asia-Pacific for some reason
    "Asia-Pacific": "APAC",
    "Middle East": "MENA",
    # Dralii's region is MENA
    "MENA": "MENA",
    "Africa": "SSA",
}
# Required player fields
REQUIRED_FIELDS = set(
    [
        "DOB",
        "fullName",
        "id",
        "name",
        "nationality",
        "region",
        "rlcsLanAppearances",
        "team",
    ]
)

# TODO: Some players have multiple teams, how to pick the best one?
# For most cases, picking the first team in the list gives you the expected result.
# But not always, for example for GarrettG his first team is NRG not G.A.S.
# It's also not clear if we should stick with players belonging to a single team.
# Say the player to be found is GarrettG and someone enters an NRG player,
# shouldn't the team field be correct? Right now it wouldn't be because a player
# can only be in one team and that would be G.A.S. for GarrettG.
PLAYERS_WITH_MULTIPLE_TEAMS = {
    "GarrettG": "G.A.S.",
    "Gyro.": "Unreal Nightmare",
    "Hockser": "The Boys",
    "Kronovi": "The Demunz",
    "noly": "M80",
    "RelatingWave": "Strictly Business",
    "Rezears": "Kaydop Corp",
    "SquishyMuffinz": "G.A.S.",
    "tehqoz": "Five Fears",
    "Yukeo": "dmy",
}


LOG = logging.getLogger(__name__)


class ColorFormatter(logging.Formatter):
    """https://stackoverflow.com/a/56944256"""

    grey = "\x1b[38;20m"
    yellow = "\x1b[33;20m"
    red = "\x1b[31;20m"
    bold_red = "\x1b[31;1m"
    reset = "\x1b[0m"
    format_ = "%(asctime)s [%(levelname)s] %(message)s"

    colors = {
        logging.DEBUG: grey,
        logging.INFO: grey,
        logging.WARNING: yellow,
        logging.ERROR: red,
        logging.CRITICAL: bold_red,
    }

    def format(self, record):
        color = self.colors.get(record.levelno)
        formatter = logging.Formatter(color + self.format_ + self.reset)
        return formatter.format(record)


def _get_page(page):
    """Get a page using the Liquipedia API"""
    # Ratelimit
    global LAST_REQUEST_TIME
    if LAST_REQUEST_TIME is not None:
        delay = (
            RATE_LIMIT_SECONDS - (datetime.now() - LAST_REQUEST_TIME).total_seconds()
        )
        if delay > 0:
            LOG.debug(f"Sleeping for {int(delay)} seconds")
            sleep(delay)

    LOG.info(f"Getting page {page}")
    resp = requests.get(f"{BASE_URL}{page}", headers=HEADERS, timeout=REQUEST_TIMEOUT)
    resp.raise_for_status()

    # If we hit the cache, we don't need to update LAST_REQUEST_TIME
    if not hasattr(resp, "from_cache") or not resp.from_cache:
        LAST_REQUEST_TIME = datetime.now()

    resp_parse = resp.json()["parse"]
    page_id = resp_parse["pageid"]
    page_html = resp_parse["text"]["*"]
    soup = BeautifulSoup(page_html, "html.parser")

    return {"id": page_id, "html": soup}


def _get_rlcs_tournaments():
    """Get the list of RLCS tournaments that have happened"""
    rlcs_tournaments = []

    page = _get_page("S-Tier_Tournaments")
    # Only select premier (RLCS) tournaments.
    # This ignores tournaments like the Esports World Cup/Gamers 8, the FIFAe
    # World Cup, CRL, ...
    for tournament in page["html"].select("tr[class*='table2__row--highlighted']"):
        # If the tournament hasn't happened yet, don't include it.
        # The obvious way to check this would be to parse the date column and
        # compare it to the current date. But instead of doing all of that we
        # can also just check the winner column.
        # It's not perfect because if we were to run the script while a LAN is
        # going on then we'd ignore it. But since we run the script so rarely
        # this is easy to avoid, just wait for the end of the LAN.

        # The last 2 columns are the winner and the runner-up. We could use
        # either but might as well go with the winner.
        winner_known = (
            tournament.select("td")[-2]
            # If the winner is known, there will be a link to the team's page
            .select_one("a")
        )
        if not winner_known:
            # If the winner of the tournament is unknown, the tournament hasn't
            # happened yet so skip it.
            continue

        # Get the url of the tournament
        url = (
            tournament.select("td")[1]
            .select_one("a")
            .get("href")
            .split("/rocketleague/")[-1]
        )
        # If it was a 1v1 tournament, ignore it.
        # It would be nice to have a better way to check for 1v1 LANs vs 3v3 ones.
        # Maybe the format of the page will get updated later on.
        if "1v1" in url:
            continue
        # The Kick-Off Weekend Showmatch is listed as a regular tournament so
        # we need to skip it.
        if "Showmatch" in url:
            continue
        # Same thing for the Bracket Rivalry Showmatch
        if "Bracket_Rivalry" in url:
            continue

        # The tournament already happened and wasn't 1v1, add it to the list.
        rlcs_tournaments.append(url)

    return rlcs_tournaments


def _get_tournament_players(tournament):
    """Get the list of players that participated to the tournament if it was a LAN"""
    page = _get_page(tournament)

    # Get the location of the tournament to know if it was online or a LAN.
    # This isn't the cleanest. We have a function that's supposed to return
    # the list of players that participated in a tournament but we only do that
    # if it was a LAN. Ideally this function would only be called for LANs, but
    # we now need to load the tournament page to know if it was a LAN or not.
    # Since we need to load that exact same page to get the list of players, it
    # makes sense to check if it was a LAN here so we don't load the page twice.
    divs = list(page["html"].select_one("div[class='fo-nttax-infobox']").children)
    for div in divs:
        div_text = div.text
        if div_text.startswith("Type:"):
            tournament_type = div_text.split("Type:")[1]
            if tournament_type == "Online":
                # It's not a LAN, don't get the list of players who participated
                LOG.info("Not a LAN, skipping")
                return []

    players = []
    # Ideally we'd select all the divs that correspond to a team and parse
    # those, but unfortunately some of those shouldn't be parsed (showmatch
    # participants, former participants) and there's nothing inside the div
    # itself telling us that we shouldn't parse them. Instead we have to rely
    # on reading the page from top to bottom and stopping when necessary.
    # Which is why we do that loop over all the children.
    children = page["html"].select_one("div[class*=mw-parser-output]").children
    for child in children:
        # Some children are just strings, they're not what we're looking for
        if not hasattr(child, "select"):
            continue

        # In https://liquipedia.net/rocketleague/Rocket_League_Championship_Series/2024
        # a team forfeited their spot but are still listed as participants.
        # Same in https://liquipedia.net/rocketleague/Rocket_League_Championship_Series/2021-22/Winter
        # where a team couldn't make it because of visa issues.
        #
        # The only difference between actual participants and former
        # participants is that there's text above the team saying that they're
        # former participants. This is not a great way of dealing with this
        # special case (what if one day a team calls themselves "Former
        # Participants"? what if a child contains both actual participants
        # and former participants?) but I don't see a better solution right now.
        if "Former Participants" in child.text:
            continue

        teams = child.select("div[class=team-participant-roster]")
        # Go through each team one by one
        for team in teams:
            for person in team.select("div[class*=team-participant-card__member]"):
                if not person.select("div[class*=team-participant-card__member-name]"):
                    # We're in the inner-div, we've already parsed the outer-div
                    # for this person so we skip it.
                    # This is not just to save time but also because the outer-div
                    # has the optional role that we need to differentiate
                    # between players and staff.
                    continue

                # Coaches have "Coach" listed as a role next to their names.
                # Substitues who didn't play have "DNP" listed as a role.
                # But regular players don't have any role listed.
                # So if such a role is listed, don't add the person's name to
                # the list of players.
                if not person.select(
                    "div[class=team-participant-card__member-role-right]"
                ):
                    url = person.select_one("a").get("href").split("/rocketleague/")[-1]
                    players.append(url)

        # In https://liquipedia.net/rocketleague/Rocket_League_Championship_Series/Season_3
        # there are 2 teams who played a showmatch. We don't want to include
        # those so we go through the page and stop if we get to the Results.
        # In https://liquipedia.net/rocketleague/Rocket_League_Championship_Series/2024/Major_2
        # the results are in the same child as the teams, so checking for this
        # after checking for the teams.
        if child.select("h2[id=Results]"):
            break

    # On some pages (mainly Rocket_League_Championship_Series/2026/Paris_Major
    # and Rocket_League_Championship_Series/2026/Boston_Major), players are
    # counted twice. Leading the script to believe they attended way more LANs.
    players = list(set(players))

    LOG.info(f"{len(players)} players attended that LAN")
    LOG.debug(players)

    # For safety in case in the future the current code isn't able to extract
    # the players from the page.
    assert players
    return players


def get_players():
    """Get the list of all the players who participated in an RLCS LAN"""
    players = []
    tournaments = _get_rlcs_tournaments()
    for tournament in tournaments:
        players.extend(_get_tournament_players(tournament))

    # Sorting the players by name so we can get a rough idea of how far
    # into the execution we are when looking at stdout.
    return sorted(Counter(players).items())


def _get_player_info(page, rlcs_lan_appearances):
    """Get the needed information about the player"""
    is_in_multiple_teams = False
    divs = list(page["html"].select_one("div[class='fo-nttax-infobox']").children)
    info = {
        "id": page["id"],
        "rlcsLanAppearances": rlcs_lan_appearances,
        "name": divs[0].text.split("\xa0")[-1].split("]")[-1].strip(),
        "team": "None",
    }
    for div in divs:
        div_text = div.text
        if div_text.startswith("Name:"):
            # In some cases, for example https://liquipedia.net/rocketleague/M7sn,
            # we want to grab the player's romanized name. Based on some quick
            # checking it looks like the romanized name is always below the name
            # and would then overwrite it. But just in case it is swapped one day,
            # only set the player's fullName if it wasn't already set.
            if "fullName" not in info:
                info["fullName"] = div_text.split("Name:")[1]
        elif div_text.startswith("Romanized Name:"):
            info["fullName"] = div_text.split("Romanized Name:")[1]
        elif div_text.startswith("Nationality:"):
            # Some players have double nationality, we only keep the first one
            info["nationality"] = div_text.split("\xa0")[1]
        elif div_text.startswith("Born:"):
            # As of 2025-05-19, https://liquipedia.net/rocketleague/Dralii
            # DOB contains Canada.
            r = match(
                r"Born:((?P<month>\w+)\s+(?P<day>\d+),\s+)?(?P<year>\d+)", div_text
            )
            if not r:
                LOG.warning(f"{info['name']} missing proper DOB: '{div_text}'")
            else:
                year = r.group("year")
                month = r.group("month")
                day = r.group("day")
                if day and month:
                    dob = f"{day}-{month}-{year}"
                    dob_format_in = "%d-%B-%Y"
                    dob_format_out = "%d-%m-%Y"
                else:
                    # As of 2024-09-23, https://liquipedia.net/rocketleague/Mesho
                    # doesn't have a proper DOB, only a year.
                    dob = year
                    dob_format_in = "%Y"
                    dob_format_out = "%Y"
                info["DOB"] = datetime.strptime(dob, dob_format_in).strftime(
                    dob_format_out
                )
        elif div_text.startswith("Region:"):
            info["region"] = REGIONS[div_text.split(maxsplit=1)[1]]
        elif div_text.startswith("Team:"):
            info["team"] = div_text.split("Team:")[1]
        elif div_text.startswith("Teams:"):
            is_in_multiple_teams = True
            # If the player is part of multiple teams, use the override for now.
            # Note for dev: can't rely on div_text to find the correct team
            # programmatically, need to use div.
            if info["name"] in PLAYERS_WITH_MULTIPLE_TEAMS:
                hardcoded_team = PLAYERS_WITH_MULTIPLE_TEAMS[info["name"]]
                # Make sure that the hardcoded team is in the list of teams we
                # got from Liquipedia. This is to ensure that we'll keep the
                # list of hardcoded teams up to date in the future.
                if hardcoded_team in div_text:
                    LOG.info(
                        f"{info['name']} has multiple teams: {div_text}. "
                        f"Using the hardcoded team {hardcoded_team}"
                    )
                    info["team"] = hardcoded_team
                else:
                    LOG.error(
                        f"{info['name']}'s hardcoded team is wrong, "
                        f"{hardcoded_team} is not in {div_text}. "
                        "Update PLAYERS_WITH_MULTIPLE_TEAMS."
                    )
            else:
                LOG.error(
                    f"{info['name']} doesn't have a hardcoded team, can't choose from {div_text}."
                    "Update PLAYERS_WITH_MULTIPLE_TEAMS."
                )

    # If a player is no longer in multiple teams, we should remove him from
    # PLAYERS_WITH_MULTIPLE_TEAMS.
    if info["name"] in PLAYERS_WITH_MULTIPLE_TEAMS and not is_in_multiple_teams:
        LOG.warning(
            f"{info['name']} doesn't need to have a hardcoded team anymore. "
            "Update PLAYERS_WITH_MULTIPLE_TEAMS."
        )

    missing_fields = REQUIRED_FIELDS - set(info.keys())
    if missing_fields:
        # We weren't able to get some of the fields, most likely Liquipedia is
        # missing the information we need (for example it is missing the DOB
        # for quite a few players).
        # Continue the execution but print a message warning about the missing
        # data.
        LOG.warning(f"{info['name']} missing {missing_fields} field(s)")
        # TODO: Ignore players that are missing DOB?

    return info


def get_players_info(players):
    """Get the needed information about the players"""
    players_info = {}

    for url, rlcs_lan_appearances in players:
        # If we've already fetched the player's page, update the info
        if url in players_info:
            LOG.debug(f"Already got {url}")
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
            LOG.debug(f"Redirect -> {url}")

            # If we've already fetched the player's page, update the info
            if url in players_info:
                LOG.debug(f"Already got {url}")
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
            if value != old_player.get(key):
                diff_player[key] = f"{old_player.get(key)} -> {value}"
        if diff_player:
            diff[name] = f"[changed] {name}: {diff_player}"

    return diff


def create_json_files(players_info):
    """Create the needed json files"""
    players_info.sort(key=lambda x: x["name"].lower())

    old = []
    try:
        with open("players.json", "r", encoding="utf-8") as f:
            old = json.load(f)
    except FileNotFoundError:
        pass
    else:
        # If players_info is the same as what we already had locally (meaning
        # there have been no updates since the last time we ran the script),
        # stop the execution now so we don't unnecessarily reshuffle players2.json
        if players_info == old:
            LOG.info("Local files already up to date, stopping")
            return

    diff = compute_diff(old, players_info)

    LOG.info("Saving players.json")
    with open("players.json", "w", encoding="utf-8") as f:
        json.dump(players_info, f, indent=2, sort_keys=True)

    shuffle(players_info)
    LOG.info("Saving players2.json")
    with open("players2.json", "w", encoding="utf-8") as f:
        json.dump(players_info, f, indent=2, sort_keys=True)

    LOG.info("Here's what changed:")
    for name in sorted(diff, key=lambda x: x.lower()):
        print(diff[name])


def main():
    """Main function"""
    # Set up logging
    handler = logging.StreamHandler()
    handler.setFormatter(ColorFormatter())
    LOG.addHandler(handler)
    LOG.setLevel(logging.INFO)

    requests_cache.install_cache(expire_after=REQUEST_CACHE_DURATION)

    players = get_players()
    players_info = get_players_info(players)
    create_json_files(players_info)


if __name__ == "__main__":
    main()
