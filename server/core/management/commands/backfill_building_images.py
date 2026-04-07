from __future__ import annotations

from django.core.management.base import BaseCommand

from core.building_images import get_building_image_url
from core.models import Building


class Command(BaseCommand):
    help = "Populate building.image_url from the configured Supabase public bucket."

    def handle(self, *args, **options):
        updated = 0

        for building in Building.objects.all():
            image_url = get_building_image_url(building.slug)
            if not image_url or building.image_url == image_url:
                continue

            building.image_url = image_url
            building.save(update_fields=["image_url"])
            updated += 1

        self.stdout.write(self.style.SUCCESS(f"Updated {updated} building image URLs."))
