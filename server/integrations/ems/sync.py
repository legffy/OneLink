from __future__ import annotations

from datetime import date, datetime, timedelta

from django.db import transaction

from integrations.ems.client import getGivenDayEvents
from core.models import Building, Reservation, Room

def determine_campus(name: str, code: str) -> str:
    normalized_name = (name or "").lower()
    normalized_code = (code or "").lower()
    if (
        "ec" in normalized_name
        or "harkness" in normalized_code
        or "stadium" in normalized_code
        or "turf" in normalized_code
    ):
        return "East Campus Athletic Village"
    return "Main Campus"


def sync_day(target_day: date) -> dict[str, int]:
    events = getGivenDayEvents(target_day.day, target_day.month, target_day.year)
    buildings = events["buildings"]
    reservations = events["reservations"]
    rooms = events["rooms"]

    created_counts = {
        "buildings": 0,
        "rooms": 0,
        "reservations": 0,
    }

    with transaction.atomic():
        for building_data in buildings:
            building_defaults = {
                **building_data,
                "address": building_data.get("address", ""),
                "campus": determine_campus(
                    str(building_data.get("name", "")),
                    str(building_data.get("code", "")),
                ),
            }
            _, created = Building.objects.update_or_create(
                external_building_id=building_data["external_building_id"],
                defaults=building_defaults,
            )
            if created:
                created_counts["buildings"] += 1

        for room_data in rooms:
            building = Building.objects.get(
                external_building_id=room_data["external_building_id"]
            )
            room_defaults = {k: v for k, v in room_data.items() if k != "external_building_id"}
            _, created = Room.objects.update_or_create(
                external_room_id=room_data["external_room_id"],
                defaults={**room_defaults, "building": building},
            )
            if created:
                created_counts["rooms"] += 1

        for reservation_data in reservations:
            room = Room.objects.get(
                external_room_id=reservation_data["external_room_id"]
            )
            reservation_defaults = {
                k: v for k, v in reservation_data.items() if k != "external_room_id"
            }
            _, created = Reservation.objects.update_or_create(
                external_reservation_id=reservation_data["external_reservation_id"],
                defaults={**reservation_defaults, "room": room},
            )
            if created:
                created_counts["reservations"] += 1

    return created_counts


def sync_date_range(start_day: date, end_day: date) -> dict[str, int]:
    if end_day < start_day:
        raise ValueError("end_day must be on or after start_day")

    totals = {
        "days": 0,
        "buildings": 0,
        "rooms": 0,
        "reservations": 0,
    }
    current_day = start_day
    while current_day <= end_day:
        day_counts = sync_day(current_day)
        totals["days"] += 1
        totals["buildings"] += day_counts["buildings"]
        totals["rooms"] += day_counts["rooms"]
        totals["reservations"] += day_counts["reservations"]
        current_day += timedelta(days=1)
    return totals


def insert_current_events() -> dict[str, int]:
    return sync_day(datetime.now().date())
