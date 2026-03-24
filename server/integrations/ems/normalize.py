def normalize_building_name(building_name: str) -> str:
    building_name = building_name.lower()
    if building_name == "biotk1":
        return "Center for Biotechnology and Interdisciplinary Studies"
    if building_name == "j-rowl":
        return "Jonsson Rowland Science Center"
    if building_name == "jonssn":
        return "Jonsson Engineering Center"
    if building_name == "ath-f":
        return "Ned Harkness Field and Track"
    if building_name == "robisin":
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
    
    return building_name
def normalize_slug(building_name: str) ->str:
    if building_name == "Center for Biotechnology and Interdisciplinary Studies":
        return "CBIS"
    if building_name == "Jonsson Engineering Center":
        return "JEC"
    if building_name == "Jonsson Rowland Science Center":
        return "J-Rowl"
    if building_name == "Mueller Robison Pool":
        return "Pool" 
    if building_name == "Mueller Armory Building":
        return "Basketball courts"
    if building_name == "Mueller Fitness Center":
        return "Fitness Center"
    if building_name == "Carnegie Building":   
        return "Carnegie"
    if building_name == "Low Center for Industrial Innovation":
        return "Low"
    if building_name == "Rensselaer Union":
        return "Union"
    if building_name == "Amos Eaton Hall":
        return "Amos Eaton"
    if building_name == "Darrin Communications Center":
        return "DCC"
    if building_name == "Pittsburgh Building":
        return "Pittsburgh"
    if building_name == "Materials Research Center":
        return "MRC"
    if building_name == "Sage Building":
        return "Sage"
    return building_name
