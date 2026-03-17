from datetime import datetime

from integrations.ems.client import getCurrentEvents, getGivenDayEvents, browse_events
import requests
from core.models import Building, Reservation, Room

def assign_campus() -> str:
    buildings = Building.objects.all()
    for building in buildings:
        if "ec" in building.name.lower():
            Building.objects.filter(external_building_id=building.external_building_id).update(campus="East Campus Athletic Village")
        else:
            Building.objects.filter(external_building_id=building.external_building_id).update(campus="Main Campus")

def insert_current_events() -> None:
    current_time = datetime.now()
    events = getGivenDayEvents(current_time.day, current_time.month, current_time.year)
    buildings = events["buildings"]
    reservations = events["reservations"]
    rooms = events["rooms"]
    print("Buildings: ", buildings)

    for building in buildings:
        Building.objects.update_or_create(
            external_building_id=building["external_building_id"],
            defaults=building,
        )
    for room in rooms:
        building = Building.objects.get(
            external_building_id=room["external_building_id"]
        )
        del room["external_building_id"]
        Room.objects.update_or_create(
            external_room_id=room["external_room_id"],
            defaults={**room, "building": building},
        )
    for reservation in reservations:
        room = Room.objects.get(
            external_room_id=reservation["external_room_id"]
        )
        del reservation["external_room_id"]
        Reservation.objects.update_or_create(
            external_reservation_id=reservation["external_reservation_id"],
            defaults={
                **reservation,
                "room": room
            }
    )
