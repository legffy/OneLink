from __future__ import annotations

from datetime import datetime
import json
from unittest.mock import patch
from zoneinfo import ZoneInfo

from django.test import SimpleTestCase, TestCase

from integrations.ems.client import getGivenDayEvents, parse_ems_datetime
from .models import Building, Reservation, Room


NEW_YORK_TZ = ZoneInfo("America/New_York")


def ny_datetime(year: int, month: int, day: int, hour: int, minute: int = 0) -> datetime:
    return datetime(year, month, day, hour, minute, tzinfo=NEW_YORK_TZ)


class EmsDatetimeParsingTests(SimpleTestCase):
    def test_parse_ems_datetime_treats_naive_values_as_new_york_time(self) -> None:
        parsed = parse_ems_datetime("2026-04-14 18:00:00")

        self.assertEqual(parsed.astimezone(NEW_YORK_TZ).isoformat(), "2026-04-14T18:00:00-04:00")

    @patch("integrations.ems.client.browse_events")
    def test_get_given_day_events_returns_eastern_aware_datetimes(
        self,
        mock_browse_events,
    ) -> None:
        mock_browse_events.return_value = {
            "d": json.dumps(
                {
                    "DailyBookingResults": [
                        {
                            "EventName": "Girls Basketball Practice",
                            "EventStart": "2026-04-14 18:00:00",
                            "EventEnd": "2026-04-14 19:00:00",
                            "Status": "Confirmed",
                            "RoomOverrideDescription": "",
                            "GroupName": "Girls Basketball",
                            "IsAllDayEvent": False,
                            "RequiresCheckIn": False,
                            "CheckInMinutes": 0,
                            "LocationLink": "",
                            "ReservationId": 101,
                            "InternalId": 202,
                            "RoomId": 303,
                            "Building": "ECAV Stadium",
                            "BuildingId": 404,
                            "Location": "stadium",
                            "Room": "Main Gym",
                            "RoomCode": "GYM-1",
                            "RoomType": "Gym",
                            "RoomTypeId": 505,
                            "Floor": 1,
                            "FloorID": 606,
                        }
                    ]
                }
            )
        }

        events = getGivenDayEvents(14, 4, 2026)

        reservation = events["reservations"][0]
        self.assertEqual(
            reservation["start_time"].astimezone(NEW_YORK_TZ).isoformat(),
            "2026-04-14T18:00:00-04:00",
        )
        self.assertEqual(
            reservation["end_time"].astimezone(NEW_YORK_TZ).isoformat(),
            "2026-04-14T19:00:00-04:00",
        )


class BuildingDetailScheduleTests(TestCase):
    def setUp(self) -> None:
        self.building = Building.objects.create(
            name="ECAV Stadium",
            slug="ecav-stadium",
            address="East Campus Athletic Village",
            campus="East Campus Athletic Village",
            code="ECAV",
        )
        self.secondary_building = Building.objects.create(
            name="Mueller Recreation Center",
            slug="mueller-recreation",
            address="1643 15th St, Troy, NY 12180",
            campus="Main Campus",
            code="MUELLER",
        )
        self.main_gym = Room.objects.create(
            building=self.building,
            display_name="Main Gym",
            room_code="GYM-1",
        )
        self.side_court = Room.objects.create(
            building=self.building,
            display_name="Side Court",
            room_code="COURT-2",
        )
        self.secondary_room = Room.objects.create(
            building=self.secondary_building,
            display_name="Fitness Studio",
            room_code="FIT-1",
        )

        Reservation.objects.create(
            room=self.main_gym,
            event_name="Late Practice",
            group_name="Varsity Athletics",
            start_time=ny_datetime(2026, 4, 13, 23, 0),
            end_time=ny_datetime(2026, 4, 14, 1, 0),
            status="Confirmed",
        )
        Reservation.objects.create(
            room=self.side_court,
            event_name="Open Gym Setup",
            start_time=ny_datetime(2026, 4, 14, 9, 0),
            end_time=ny_datetime(2026, 4, 14, 10, 0),
            status="Confirmed",
        )
        Reservation.objects.create(
            room=self.main_gym,
            event_name="Girls Basketball Practice",
            group_name="Girls Basketball",
            start_time=ny_datetime(2026, 4, 14, 18, 0),
            end_time=ny_datetime(2026, 4, 14, 19, 0),
            status="Confirmed",
        )
        Reservation.objects.create(
            room=self.secondary_room,
            event_name="Campus Fitness Orientation",
            start_time=ny_datetime(2026, 4, 20, 12, 0),
            end_time=ny_datetime(2026, 4, 20, 13, 0),
            status="Confirmed",
        )

    def build_url(self, date_param: str) -> str:
        return f"/api/buildings/{self.building.id}/?date={date_param}"

    def test_returns_daily_events_for_valid_date(self) -> None:
        response = self.client.get(self.build_url("2026-04-14"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()

        self.assertEqual(payload["selected_date"], "2026-04-14")
        self.assertEqual(payload["schedule_state"], "available")
        self.assertEqual(payload["schedule_window"], {"start_date": "2026-04-13", "end_date": "2026-04-20"})
        self.assertEqual(len(payload["daily_events"]), 3)
        self.assertEqual(payload["daily_events"][0]["room_name"], "Main Gym")
        self.assertEqual(payload["daily_events"][1]["event_name"], "Open Gym Setup")
        self.assertEqual(payload["daily_events"][2]["event_name"], "Girls Basketball Practice")

    def test_returns_empty_schedule_when_building_has_no_events_for_that_day(self) -> None:
        response = self.client.get(self.build_url("2026-04-16"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()

        self.assertEqual(payload["schedule_state"], "empty")
        self.assertEqual(payload["daily_events"], [])
        self.assertEqual(payload["schedule_window"], {"start_date": "2026-04-13", "end_date": "2026-04-20"})

    def test_returns_out_of_range_for_date_outside_synced_window(self) -> None:
        response = self.client.get(self.build_url("2026-05-01"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()

        self.assertEqual(payload["schedule_state"], "out_of_range")
        self.assertEqual(payload["daily_events"], [])

    def test_rejects_invalid_date_format(self) -> None:
        response = self.client.get(self.build_url("04-14-2026"))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["detail"], "Invalid date. Expected YYYY-MM-DD.")

    def test_rejects_impossible_date(self) -> None:
        response = self.client.get(self.build_url("2026-02-30"))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["detail"], "Invalid date. Expected YYYY-MM-DD.")

    def test_includes_reservation_that_spans_midnight(self) -> None:
        response = self.client.get(self.build_url("2026-04-14"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()

        self.assertEqual(payload["daily_events"][0]["event_name"], "Late Practice")
        self.assertEqual(payload["daily_events"][0]["room_name"], "Main Gym")

    def test_sorts_daily_events_by_start_time_then_room_name(self) -> None:
        Reservation.objects.create(
            room=self.main_gym,
            event_name="Early Warmup",
            start_time=ny_datetime(2026, 4, 14, 9, 0),
            end_time=ny_datetime(2026, 4, 14, 9, 30),
            status="Confirmed",
        )

        response = self.client.get(self.build_url("2026-04-14"))

        self.assertEqual(response.status_code, 200)
        payload = response.json()

        ordered_names = [event["event_name"] for event in payload["daily_events"]]
        self.assertEqual(
            ordered_names,
            ["Late Practice", "Early Warmup", "Open Gym Setup", "Girls Basketball Practice"],
        )


class BuildingDetailScheduleWindowFallbackTests(TestCase):
    def test_returns_empty_state_when_database_has_no_reservations(self) -> None:
        building = Building.objects.create(
            name="Folsom Library",
            slug="folsom-library",
            address="Library plaza",
            campus="Main Campus",
            code="FOLSOM",
        )

        response = self.client.get(f"/api/buildings/{building.id}/")

        self.assertEqual(response.status_code, 200)
        payload = response.json()

        self.assertEqual(payload["schedule_state"], "empty")
        self.assertEqual(payload["daily_events"], [])
        self.assertEqual(payload["schedule_window"], {"start_date": None, "end_date": None})
