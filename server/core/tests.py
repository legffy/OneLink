from datetime import timedelta

from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from .models import Reservation, Room


class ReservationModelTests(TestCase):
    def test_reservation_clean_rejects_end_before_start(self) -> None:
        room = Room(
            building_id="00000000-0000-0000-0000-000000000001",
            display_name="Room 101",
            raw_name="Room 101",
            room_code="101",
        )
        start_time = timezone.now()
        reservation = Reservation(
            room=room,
            event_name="Invalid Reservation",
            raw_event_name="Invalid Reservation",
            start_time=start_time,
            end_time=start_time - timedelta(hours=1),
        )

        with self.assertRaises(ValidationError):
            reservation.clean()


class BuildingApiTests(TestCase):
    def test_building_list_returns_success(self) -> None:
        client = APIClient()

        response = client.get("/api/buildings/")

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
