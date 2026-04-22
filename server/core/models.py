from __future__ import annotations

import uuid
from django.db import models

from django.core.exceptions import ValidationError


class Building(models.Model):
    id: models.UUIDField = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name: models.CharField = models.CharField(max_length=255)
    raw_name: models.CharField = models.CharField(max_length=255, blank=True)
    slug: models.SlugField = models.SlugField(max_length=255, unique=True)

    address: models.CharField = models.CharField(max_length=255)
    campus: models.CharField = models.CharField(max_length=255, db_index=True)

    latitude: models.DecimalField = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude: models.DecimalField = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    building_type: models.CharField = models.CharField(max_length=255, blank=True)

    floors: models.IntegerField = models.IntegerField(default=0)

    external_building_id: models.BigIntegerField = models.BigIntegerField(unique=True, null=True, blank=True)
    code: models.CharField = models.CharField(max_length=255, null=True, blank=True, unique=True)

    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)
    description: models.TextField = models.TextField(blank=True)
    image_url: models.URLField = models.URLField(blank=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.code or self.slug})"


class BuildingHours(models.Model):
    id: models.UUIDField = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    building: models.ForeignKey = models.ForeignKey(
        Building,
        on_delete=models.CASCADE,
        related_name="hours",
    )

    # 0=Mon ... 6=Sun (or use IntegerChoices)
    day_of_week: models.SmallIntegerField = models.SmallIntegerField()
    open_time: models.TimeField = models.TimeField()
    close_time: models.TimeField = models.TimeField()
    timezone: models.CharField = models.CharField(max_length=255, default="America/New_York")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["building", "day_of_week"], name="uniq_building_day_hours"),
        ]

    def __str__(self) -> str:
        return f"{self.building} day={self.day_of_week}"


class Room(models.Model):
    id: models.UUIDField = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    building: models.ForeignKey = models.ForeignKey(
        Building,
        on_delete=models.CASCADE,
        related_name="rooms",
    )

    floor: models.IntegerField = models.IntegerField(null=True, blank=True)
    capacity: models.IntegerField = models.IntegerField(default=0)

    room_type: models.CharField = models.CharField(max_length=255, blank=True)
    room_type_id: models.IntegerField = models.IntegerField(null=True, blank=True)

    room_code: models.CharField = models.CharField(max_length=255, blank=True)
    display_name: models.CharField = models.CharField(max_length=255)
    raw_name: models.CharField = models.CharField(max_length=255, blank=True)

    floor_id: models.IntegerField = models.IntegerField(null=True, blank=True)

    is_active: models.BooleanField = models.BooleanField(default=True)

    external_room_id: models.BigIntegerField = models.BigIntegerField(unique=True, null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["building", "floor"]),
        ]
        constraints = [
            models.UniqueConstraint(fields=["building", "room_code"], name="uniq_roomcode_per_building"),
        ]

    def __str__(self) -> str:
        return f"{self.display_name} ({self.building})"


class Group(models.Model):
    id: models.UUIDField = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name: models.CharField = models.CharField(max_length=255)
    raw_name: models.CharField = models.CharField(max_length=255, blank=True)
    slug: models.SlugField = models.SlugField(max_length=255, unique=True)
    visible: models.BooleanField = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name


class Reservation(models.Model):
    id: models.UUIDField = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    room: models.ForeignKey = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="reservations",
    )

    group: models.ForeignKey = models.ForeignKey(
        Group,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reservations",
    )

    start_time: models.DateTimeField = models.DateTimeField(db_index=True)
    end_time: models.DateTimeField = models.DateTimeField(db_index=True)

    status: models.CharField = models.CharField(max_length=255, blank=True, null=True)
    description: models.TextField = models.TextField(blank=True, null=True)

    external_reservation_id: models.BigIntegerField = models.BigIntegerField(null=True, blank=True)
    external_event_id: models.BigIntegerField = models.BigIntegerField(null=True, blank=True)

    event_name: models.CharField = models.CharField(max_length=255)
    group_name: models.CharField = models.CharField(max_length=255, null=True, blank=True)
    raw_event_name: models.CharField = models.CharField(max_length=255, blank=True)

    status_id: models.SmallIntegerField = models.SmallIntegerField(null=True, blank=True)
    status_type_id: models.SmallIntegerField = models.SmallIntegerField(null=True, blank=True)

    is_all_day: models.BooleanField = models.BooleanField(default=False)
    requires_check_in: models.BooleanField = models.BooleanField(default=False)
    check_in_minutes: models.SmallIntegerField = models.SmallIntegerField(default=0)

    location_link: models.TextField = models.TextField(blank=True)

    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["room", "start_time"]),
            models.Index(fields=["start_time", "end_time"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields = ["external_reservation_id", "room"],
                name = "uniq_reservation_per_room",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.event_name} @ {self.room}"
    def clean(self) -> None:
        if self.end_time <= self.start_time:
            raise ValidationError("end_time must be after start_time")