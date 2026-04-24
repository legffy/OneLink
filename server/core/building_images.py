from __future__ import annotations

import os
from urllib.parse import quote


BUILDING_IMAGE_FILENAMES: dict[str, str] = {
    "darrin-communications-center": "darrin.png",
    "low-center": "low.jpg",
    "pittsburgh-building": "pittsburgh.jpg",
    "folsom-library": "folsom_library.jpg",
    "mueller-recreation": "mueller.jpg",
    "87-gym": "87.jpg",
    "ecav-stadium": "ecav.jpg",
    "mueller-armory-building": "rpi-armory.jpg",
    "playhouse": "playhouse.jpg",
    "center-for-biotechnology-and-interdisciplinary-studies": "cbis.jpg",
    "j-rowl": "jrowl.jpg",
    "lally": "lally.jpg",
    "troy": "troy.jpg",
    "harkness": "harkness.jpg",
    "west": "west.jpg",
    "commons": "commons.webp",
    "dcc-hass": "darrin.png",
    "sharp": "sharp.jpg",
    "robison": "robison.webp",
    "ricketts-building": "ricketts.jpg",
    "jec":"jonsson.jpg",
    "rensselaer-union": "union.jpg",
    "lower-renwyck-turf-field": "renwyck.webp",
    "amos-eaton-hall":"eaton.jpg",
    "sage-building":"sage_lab.jpg"
}

BUILDING_SLUGS_BY_NAME: dict[str, str] = {
    "Darrin Communications Center": "darrin-communications-center",
    "Low Center": "low-center",
    "Low Center for Industrial Innovation": "low-center",
    "Russell Sage Laboratory": "russell-sage-laboratory",
    "Pittsburgh Building": "pittsburgh-building",
    "Folsom Library": "folsom-library",
    "Mueller Recreation Center": "mueller-recreation",
    "87 Gym": "87-gym",
    "87 Gymnasium": "87-gym",
    "ECAV Stadium": "ecav-stadium",
    "East Campus Stadium": "ecav-stadium",
    "East Campus Athletic Village": "ecav-stadium",
    "Mueller Armory Building": "mueller-armory-building",
    "Playhouse": "playhouse",
    "Center for Biotechnology and Interdisciplinary Studies": "center-for-biotechnology-and-interdisciplinary-studies",
    "Sage Building": "sage-building",
    "Jonsson Rowland Science Center": "j-rowl",
    "Lally School of Management": "lally",
    "Troy Building": "troy",
    "Ned Harkness Field and Track": "harkness",
    "West Hall": "west",
    "Commons Dining Hall": "commons",
    "Darrin Hass": "dcc-hass",
    "Sharp Tennis Courts": "sharp",
    "Mueller Robison Pool": "robison",
    "Ricketts Building": "ricketts-building",
    "Jonsson Engineering Center": "jec",
    "Rensselaer Union": "rensselaer-union",
    "Lower Renwyck Turf Field": "lower-renwyck-turf-field",
    "Amos Eaton Hall":"amos-eaton-hall"
}


def get_supabase_project_url() -> str:
    configured_url = os.getenv("SUPABASE_URL", "").strip().rstrip("/")
    if configured_url:
        return configured_url

    direct_host = os.getenv("SUPABASE_DIRECT_HOST", "").strip()
    if direct_host.startswith("db."):
        return f"https://{direct_host.removeprefix('db.')}"

    session_user = os.getenv("SUPABASE_SESSION_USER", "").strip()
    if "." in session_user:
        project_ref = session_user.split(".", 1)[1]
        return f"https://{project_ref}.supabase.co"

    return ""


def get_building_image_url(slug: str) -> str:
    filename = BUILDING_IMAGE_FILENAMES.get(slug)
    if not filename:
        return ""

    project_url = get_supabase_project_url()
    if not project_url:
        return ""

    bucket = os.getenv("SUPABASE_BUILDING_IMAGE_BUCKET", "building-images").strip("/")
    prefix = os.getenv("SUPABASE_BUILDING_IMAGE_PREFIX", "").strip("/")
    object_path = f"{prefix}/{filename}" if prefix else filename

    return f"{project_url}/storage/v1/object/public/{bucket}/{quote(object_path)}"
