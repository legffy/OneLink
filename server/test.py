from __future__ import annotations

from typing import Any, Literal
import uuid
import requests
import json
from datetime import datetime, timedelta

base_url: str = "https://rpi.emscloudservice.com/web"
browse_url: str = f"{base_url}/BrowseEvents.aspx"
api_url: str = f"{base_url}/AnonymousServersApi.aspx/BrowseEvents"
session: requests.Session = requests.Session()
session.get(browse_url, timeout=20)
  
ResultType  = Literal["Daily", "Weekly", "Monthly"]
def getCurrentEvents():
    time: datetime = datetime.now()
    start_time:datetime = time.replace(hour = 0,minute = 0, second = 0, microsecond =0)
    end_time:datetime = start_time + timedelta(days = 1)
    data:dict[str, Any] = browse_events(str(start_time),str(end_time), "Daily")
    d: Any = data["d"]
    d_obj: dict[str, Any] = json.loads(d)
    dailyResults = d_obj["DailyBookingResults"]
    for i in dailyResults:
        print(i['EventName'],' in ', i["Building"] , ' FROM ' , i['EventStart'], ' TO ' , i['EventEnd'])
        print('Location ', i['Location'], i['Room'])
def getGivenDayEvents(day: int, month: int, year: int):
    time: datetime = datetime.now()
    start_time: datetime = time.replace(year = year, month = month, day = day, hour = 0, minute = 0, second = 0, microsecond = 0 )
    end_time: datetime = start_time + timedelta(days = 1)
    data = json.loads(browse_events(fmt(start_time), fmt(end_time), "Daily")["d"])
    dayResults = data["DailyBookingResults"]
    res = {'reservations':[], 'buildings': [], 'rooms':[]}
    for item in dayResults:
        reservation: dict[str,object]= {'event_name': item['EventName'], 'start_time': item['EventStart'], 'end_time': item['EventEnd'], 'status': item['Status'], 'description': item['RoomOverrideDescription'],
                       'group_name': item['GroupName'],'is_all_day': item['IsAllDayEvent'], 'requires_check_in': item['RequiresCheckIn'], 'check_in_minutes': item['CheckInMinutes'], 
                       'location_link': item['LocationLink'],'external_reservation_id': item['ReservationId'], 'external_event_id': item['InternalId']}
        building_data: dict[str, object] = {
    "name": item["Building"],                      # Human-readable name
    "external_building_id": item["BuildingId"],   # Unique dedupe key
    "code": item["Location"],                     # Likely building code
    "slug": item["Building"].lower().replace(" ", "-"),  # Temporary slug
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
}
        res['buildings'].append(building_data)
        res['reservations'].append(reservation)
        res['rooms'].append(room_data)
    print(res)
def print_list_fields(obj: Any, path: str = "") -> None:
    if isinstance(obj, dict):
        for k, v in obj.items():
            new_path = f"{path}.{k}" if path else k
            if isinstance(v, list):
                print(f"LIST: {new_path}  len={len(v)}")
            else:
                print_list_fields(v, new_path)
def browse_events(start_date: str, end_date: str, result_type: ResultType) -> dict[str, Any]:
  
    anti_xsrf: str | None = session.cookies.get("__AntiXsrfToken")

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

    r2: requests.Response = session.post(api_url, headers=headers, json = payload, timeout=20)
    r2.raise_for_status()
    return r2.json()

def main() -> None:
   

    data: dict[str, Any] = browse_events(
        start_date="2026-02-03 00:00:00",
        end_date="2026-02-04 00:00:00",
        result_type = "Daily",
    )
   # print(data)
    print_list_fields(data['d'])
    d: Any = data["d"]
    d_obj: dict[str, Any] = json.loads(d)
   #print("d keys:", list(d_obj.keys()))
    #print("MonthlyBookingResults len:", len(d_obj.get("MonthlyBookingResults", [])))

    first = d_obj["DailyBookingResults"][0]
    print(first)
    print(str(first.keys()))
    getCurrentEvents()
if __name__ == "__main__":
    main()