from django.utils.text import slugify

from core.building_images import BUILDING_SLUGS_BY_NAME


def normalize_building_name(building_name: str) -> str:
    building_name = building_name.strip().lower()
    if "dcc" in building_name:
        return "Darrin Communications Center"
    if building_name == "87gym":
        return "87 Gymnasium"
    if building_name == "biotk1":
        return "Center for Biotechnology and Interdisciplinary Studies"
    if building_name == "j-rowl":
        return "Jonsson Rowland Science Center"
    if building_name == "jonssn":
        return "Jonsson Engineering Center"
    if building_name == "robisn":
        return "Mueller Robison Pool"
    if building_name == "armory":
        return "Mueller Armory Building"
    if  building_name == "fitnes" :
        return "Mueller Fitness Center"
    if building_name == "carneg":
        return "Carnegie Building"
    if building_name == "low":
        return "Low Center for Industrial Innovation"
    if building_name == "union":
        return "Rensselaer Union"
    if building_name == "eaton":
        return "Amos Eaton Hall"
    if building_name == "darrin":
        return "Darrin Communications Center"
    if building_name == "pitts":
        return "Pittsburgh Building"
    if building_name == "Materials Research Center":
        return "Materials Research Center"
    if building_name == "playhs":
        return "Playhouse"
    if building_name == "sage":
        return "Sage Building"
    if building_name == "lally":
        return "Lally School of Management"
    if building_name == "rcktts":
        return "Ricketts Building"
    if building_name == "ec0001":
        return "East Campus Athletic Village"
    if building_name == "east campus stadium":
        return "East Campus Stadium"
    if building_name == "lower renwyck turf field":
        return "Lower Renwyck Turf Field"
    if building_name == "troy":
        return "Troy Building"
    if building_name == "ned harkness field and track":
        return "Ned Harkness Field and Track"
    if building_name == "west":
        return "West Hall"
    if building_name == "commons":
        return "Commons Dining Hall"
    if building_name == "darrin hass":
        return "Darrin Hass"
    if building_name == "sharp tennis courts":
        return "Sharp Tennis Courts"
    return building_name
   
def normalize_slug(building_name: str) ->str:
    canonical_slug = BUILDING_SLUGS_BY_NAME.get(building_name)
    if canonical_slug:
        return canonical_slug

    return slugify(building_name)
