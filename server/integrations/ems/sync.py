from __future__ import annotations

from datetime import date, datetime, timedelta

from django.db import transaction
from django.utils.text import slugify

from core.building_images import get_building_image_url
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


def get_or_create_building(building_data: dict[str, object]) -> tuple[Building, bool]:
    raw_slug = building_data.get("slug")
    slug = slugify(str(raw_slug)) if raw_slug else ""
    
    external_building_id = building_data.get("external_building_id")
    code = building_data.get("code")

    building_defaults = {
        **building_data,
        "slug": slug,
        "address": building_data.get("address") or "",
        "campus": determine_campus(
            str(building_data.get("name", "")),
            str(building_data.get("code", "")),
        ),
    }

    if slug:
        existing_building = Building.objects.filter(slug=slug).first()
        if existing_building:
            return existing_building, False

        if external_building_id:
            existing_building = Building.objects.filter(
                external_building_id=external_building_id
            ).first()
            if existing_building:
                return existing_building, False

        if code:
            existing_building = Building.objects.filter(code=code).first()
            if existing_building:
                return existing_building, False

        return Building.objects.get_or_create(slug=slug, defaults=building_defaults)

    return Building.objects.get_or_create(
        external_building_id=external_building_id,
        defaults=building_defaults,
    )


def unique_building_value_is_available(
    building: Building,
    field_name: str,
    value: object,
) -> bool:
    return not Building.objects.exclude(id=building.id).filter(
        **{field_name: value}
    ).exists()


def update_building(building: Building, building_data: dict[str, object]) -> bool:
    raw_slug = building_data.get("slug")
    slug = slugify(str(raw_slug)) if raw_slug else ""
    building_defaults = {
        **building_data,
        "slug": slug or building.slug,
        "address": building_data.get("address") or "",
        "campus": determine_campus(
            str(building_data.get("name", "")),
            str(building_data.get("code", "")),
        ),
    }

    updated = False
    for key, value in building_defaults.items():
        if value in (None, ""):
            continue
        if key in ("external_building_id", "code"):
            current_value = getattr(building, key)
            if current_value not in (None, "", value):
                continue
            if current_value in (None, "") and not unique_building_value_is_available(
                building, key, value
            ):
                continue
        if getattr(building, key, None) != value:
            setattr(building, key, value)
            updated = True

    if building.slug:
        image_url = get_building_image_url(building.slug)
        if building.image_url != image_url:
            building.image_url = image_url
            updated = True

    return updated


def get_building_for_room(room_data):
    ext_id = room_data.get("external_building_id")

    building = Building.objects.filter(external_building_id=ext_id).first()
    if building:
        return building

    # emergency create
    return Building.objects.create(
        external_building_id=ext_id,
        name=room_data.get("building_slug", "unknown"),
        slug=slugify(str(room_data.get("building_slug", "")))
    )

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
            obj, created = get_or_create_building(building_data)
            updated = update_building(obj, building_data)

            if updated:
                obj.save()

            if created:
                created_counts["buildings"] += 1
        for room_data in rooms:
            building = get_building_for_room(room_data)
            room_defaults = {
                k: v
                for k, v in room_data.items()
                if k not in ("external_building_id", "building_slug")
            }
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
                room = room, 
                defaults=reservation_defaults,
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
