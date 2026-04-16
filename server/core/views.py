from __future__ import annotations

import re
from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo

from django.db.models import Max, Min
from django.utils import timezone
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Building, Group, Room, Reservation
from .serializers import (
    BuildingSerializer,
    DailyEventSerializer,
    GroupSerializer,
    ReservationSerializer,
    RoomSerializer,
    ScheduleWindowSerializer,
)


SCHEDULE_TIMEZONE = ZoneInfo("America/New_York")
DATE_QUERY_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def get_default_schedule_date() -> date:
    return timezone.now().astimezone(SCHEDULE_TIMEZONE).date()


def parse_schedule_date(raw_value: str | None) -> date:
    if not raw_value:
        return get_default_schedule_date()

    if not DATE_QUERY_PATTERN.fullmatch(raw_value):
        raise ValueError("Invalid date format.")

    return date.fromisoformat(raw_value)


def get_schedule_window_bounds() -> tuple[date | None, date | None]:
    bounds = Reservation.objects.aggregate(
        earliest_start=Min("start_time"),
        latest_end=Max("end_time"),
    )

    earliest_start = bounds["earliest_start"]
    latest_end = bounds["latest_end"]
    if earliest_start is None or latest_end is None:
        return None, None

    start_date = timezone.localtime(earliest_start, SCHEDULE_TIMEZONE).date()
    end_date = timezone.localtime(latest_end, SCHEDULE_TIMEZONE).date()
    return start_date, end_date


def build_daily_events(building: Building, selected_date: date) -> list[dict[str, object]]:
    day_start = datetime.combine(selected_date, time.min, tzinfo=SCHEDULE_TIMEZONE)
    next_day = day_start + timedelta(days=1)

    reservations = (
        Reservation.objects.filter(
            room__building=building,
            start_time__lt=next_day,
            end_time__gt=day_start,
        )
        .select_related("room")
        .order_by("start_time", "room__display_name", "id")
    )

    return [
        {
            "id": reservation.id,
            "room_name": reservation.room.display_name,
            "room_code": reservation.room.room_code,
            "event_name": reservation.event_name,
            "group_name": reservation.group_name,
            "start_time": reservation.start_time,
            "end_time": reservation.end_time,
            "is_all_day": reservation.is_all_day,
            "status": reservation.status,
        }
        for reservation in reservations
    ]


class BuildingView(APIView):
    def get(self, request: Request) -> Response:
        buildings = Building.objects.all()
        serializer = BuildingSerializer(buildings, many=True)
        return Response(serializer.data)


class BuildingDetailView(APIView):
    def get(self, request: Request, building_id: str) -> Response:
        try:
            building = Building.objects.get(id=building_id)
        except Building.DoesNotExist:
            return Response({"detail": "Building not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            selected_date = parse_schedule_date(request.query_params.get("date"))
        except ValueError:
            return Response(
                {"detail": "Invalid date. Expected YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        window_start, window_end = get_schedule_window_bounds()
        schedule_window = {
            "start_date": window_start,
            "end_date": window_end,
        }
        schedule_state = "empty"
        daily_events: list[dict[str, object]] = []

        if window_start and window_end and (selected_date < window_start or selected_date > window_end):
            schedule_state = "out_of_range"
        else:
            daily_events = build_daily_events(building, selected_date)
            if daily_events:
                schedule_state = "available"

        payload = {
            **BuildingSerializer(building).data,
            "selected_date": selected_date.isoformat(),
            "schedule_state": schedule_state,
            "schedule_window": ScheduleWindowSerializer(schedule_window).data,
            "daily_events": DailyEventSerializer(daily_events, many=True).data,
        }
        return Response(payload)


class RoomView(APIView):
    def get(self, request: Request) -> Response:
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)


class GroupView(APIView):
    def get(self, request: Request) -> Response:
        groups = Group.objects.all()
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)


class ReservationView(APIView):
    def get(self, request: Request) -> Response:
        reservations = Reservation.objects.all()
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)
