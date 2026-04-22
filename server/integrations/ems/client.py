from __future__ import annotations

from datetime import datetime, timedelta
import json
from typing import Any, Literal
import uuid
from zoneinfo import ZoneInfo

import requests

from .normalize import normalize_building_name, normalize_slug


EMS_TIMEZONE = ZoneInfo("America/New_York")
EMS_DATETIME_FORMATS: tuple[str, ...] = (
    "%Y-%m-%d %H:%M:%S",
    "%Y-%m-%d %H:%M",
    "%Y-%m-%dT%H:%M:%S",
    "%Y-%m-%dT%H:%M:%S.%f",
    "%m/%d/%Y %I:%M:%S %p",
    "%m/%d/%Y %I:%M %p",
    "%m/%d/%Y %H:%M:%S",
    "%m/%d/%Y %H:%M",
)


def fmt(dt: datetime) -> str:
    return dt.astimezone(EMS_TIMEZONE).strftime("%Y-%m-%d %H:%M:%S")


def parse_ems_datetime(value: object) -> datetime:
    raw_value = str(value).strip()
    if not raw_value:
        raise ValueError("EMS datetime value was empty.")

    iso_candidate = raw_value.replace("Z", "+00:00")
    try:
        parsed = datetime.fromisoformat(iso_candidate)
    except ValueError:
        parsed = None

    if parsed is None:
        for fmt_pattern in EMS_DATETIME_FORMATS:
            try:
                parsed = datetime.strptime(raw_value, fmt_pattern)
                break
            except ValueError:
                continue

    if parsed is None:
        raise ValueError(f"Unsupported EMS datetime format: {raw_value!r}")

    if parsed.tzinfo is None:
        return parsed.replace(tzinfo=EMS_TIMEZONE)

    return parsed.astimezone(EMS_TIMEZONE)


base_url: str = "https://rpi.emscloudservice.com/web"
browse_url: str = f"{base_url}/BrowseEvents.aspx"
api_url: str = f"{base_url}/AnonymousServersApi.aspx/BrowseEvents"
session: requests.Session | None = None


def get_session() -> requests.Session:
    global session

    if session is None:
        session = requests.Session()
        session.get(browse_url, timeout=20)

    return session

ResultType = Literal["Daily", "Weekly", "Monthly"]


def _initialize_session() -> None:
    if session.cookies.get("__AntiXsrfToken") is None:
        session.get(browse_url, timeout=20)


def getCurrentEvents():
    time: datetime = datetime.now(EMS_TIMEZONE)
    start_time: datetime = time.replace(hour=0, minute=0, second=0, microsecond=0)
    end_time: datetime = start_time + timedelta(days=1)
    data: dict[str, Any] = browse_events(str(start_time), str(end_time), "Daily")
    d: Any = data["d"]
    d_obj: dict[str, Any] = json.loads(d)
    dailyResults = d_obj["DailyBookingResults"]
    for i in dailyResults:
        print(
            i["EventName"],
            " in ",
            i["Building"],
            " FROM ",
            i["EventStart"],
            " TO ",
            i["EventEnd"],
        )
        print("Location ", i["Location"], i["Room"])


def getGivenDayEvents(day: int, month: int, year: int):
    time: datetime = datetime.now(EMS_TIMEZONE)
    start_time: datetime = time.replace(
        year=year, month=month, day=day, hour=0, minute=0, second=0, microsecond=0
    )
    end_time: datetime = start_time + timedelta(days=1)
    data = json.loads(browse_events(fmt(start_time), fmt(end_time), "Daily")["d"])
    dayResults = data["DailyBookingResults"]
    res = {"reservations": [], "buildings": [], "rooms": []}
    for item in dayResults:
        building_name = ""  # Default to empty string if not found
        if item["Building"] =="ATH-STC" or item["Building"]  == "ec0001" or item["Building"] == "ATH-F" or "ls" in item["Building"].lower() or "dcc" in item["Building"].lower():
            code = item["Location"].lower()
            building = item["Building"].lower()
            if "harkness" in code:
                building_name = "Ned Harkness Field and Track"
            elif "stadium" in code:
                building_name = "East Campus Stadium"
            elif "lower renwyck turf" in code:
                building_name = "Lower Renwyck Turf Field"
            elif "ls" in code or "ls" in building:
                building_name = "commons"
            elif "dcc" in code or "dcc" in building:
                if "hass" in code or "hass" in building:
                    building_name = "Darrin hass"
                else:
                    building_name = "Darrin Communications Center"
            elif "stc" in code:
                    building_name = "Sharp Tennis Courts"
            else:
                building_name = "East Campus Athletic Village"
        building_name = normalize_building_name(building_name if building_name != "" else item["Building"])

        slug = normalize_slug(building_name)
        reservation_data: dict[str, object] = {
            "event_name": item["EventName"],
            "start_time": parse_ems_datetime(item["EventStart"]),
            "end_time": parse_ems_datetime(item["EventEnd"]),
            "status": item["Status"],
            "description": item["RoomOverrideDescription"],
            "group_name": item["GroupName"],
            "is_all_day": item["IsAllDayEvent"],
            "requires_check_in": item["RequiresCheckIn"],
            "check_in_minutes": item["CheckInMinutes"],
            "location_link": item["LocationLink"],
            "external_reservation_id": item["ReservationId"],
            "external_event_id": item["InternalId"],
            "external_room_id": item["RoomId"],
        }
        building_data: dict[str, object] =  {
                "name": building_name,  # Human-readable name
                "external_building_id": item["BuildingId"],  # Unique dedupe key
                "code": item["Location"],  # Likely building code
                "slug": slug,  #Slug
                "raw_name": item[  # The raw name from EMS, for debugging
                    "Building"
                ],  
            }
        

        room_data: dict[str, object] = {
            "display_name": item["Room"],
            "external_room_id": item["RoomId"],
            "room_code": item["RoomCode"],
            "room_type": item["RoomType"],
            "room_type_id": item["RoomTypeId"],
            "floor": item["Floor"],
            "floor_id": item["FloorID"],
            "is_active": True,
            "external_building_id": item["BuildingId"],
            "building_slug": slug,
        }
        res["buildings"].append(building_data)
        res["reservations"].append(reservation_data)
        res["rooms"].append(room_data)

    return res


def print_list_fields(obj: Any, path: str = "") -> None:
    if isinstance(obj, dict):
        for k, v in obj.items():
            new_path = f"{path}.{k}" if path else k
            if isinstance(v, list):
                print(f"LIST: {new_path}  len={len(v)}")
            else:
                print_list_fields(v, new_path)


def browse_events(
    start_date: str, end_date: str, result_type: ResultType
) -> dict[str, Any]:
    active_session = get_session()

    anti_xsrf: str | None = active_session.cookies.get("__AntiXsrfToken")

    dea_csrftoken: str = str(uuid.uuid4())

    headers: dict[str, str] = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Content-Type": "application/json; charset=UTF-8",
        "Origin": "https://rpi.emscloudservice.com",
        "Referer": browse_url,
        "X-Requested-With": "XMLHttpRequest",
    }

    if anti_xsrf is not None:
        headers["X-CSRF-Token"] = anti_xsrf

    headers["dea_csrftoken"] = dea_csrftoken

    payload: dict[str, object] = {
        "filterData": {
            "filters": [
                {"filterName": "StartDate", "value": start_date, "filterType": 3},
                {"filterName": "EndDate", "value": end_date, "filterType": 3},
                {"filterName": "TimeZone", "value": "102", "filterType": 2},
                {"filterName": "RollupEventsToReservation", "value": "false"},
                {"filterName": "ResultType", "value": result_type},
            ]
        }
    }

    r2: requests.Response = active_session.post(
        api_url, headers=headers, json=payload, timeout=20
    )
    r2.raise_for_status()
    return r2.json()


def main() -> None:
    getGivenDayEvents(3, 2, 2026)


if __name__ == "__main__":
    main()
