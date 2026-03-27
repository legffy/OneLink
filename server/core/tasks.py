from __future__ import annotations

from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from integrations.ems.sync import sync_date_range


@shared_task
def sync_today_events() -> dict[str, int]:
    today = timezone.localdate()
    return sync_date_range(today, today)


@shared_task
def sync_week_events() -> dict[str, int]:
    today = timezone.localdate()
    return sync_date_range(today + timedelta(days=1), today + timedelta(days=7))


@shared_task
def sync_future_month_events() -> dict[str, int]:
    today = timezone.localdate()
    return sync_date_range(today + timedelta(days=8), today + timedelta(days=90))


@shared_task
def full_refresh() -> dict[str, int]:
    today = timezone.localdate()
    return sync_date_range(today, today + timedelta(days=365))
