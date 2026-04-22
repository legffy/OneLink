from __future__ import annotations

from django.core.management.base import BaseCommand, CommandError

from core.building_images import get_building_image_url
from core.models import Building
from integrations.ems.normalize import normalize_slug


class Command(BaseCommand):
    help = "Backfill canonical building slugs and matching image URLs."

    def handle(self, *args, **options):
        buildings = list(Building.objects.all().order_by("created_at", "name", "id"))
        seen_slugs: dict[str, str] = {}

        for building in buildings:
            new_slug = normalize_slug(building.name)
            if not new_slug:
                raise CommandError(f"Could not generate slug for building {building.name!r}")

            existing_owner = seen_slugs.get(new_slug)
            if existing_owner and existing_owner != str(building.id):
                raise CommandError(
                    f"Slug collision detected for {building.name!r}: {new_slug!r} is already assigned."
                )

            duplicate = Building.objects.exclude(id=building.id).filter(slug=new_slug).first()
            if duplicate and duplicate.id != building.id:
                raise CommandError(
                    f"Slug collision with existing row: {building.name!r} and {duplicate.name!r} -> {new_slug!r}"
                )

            seen_slugs[new_slug] = str(building.id)

        updated = 0

        for building in buildings:
            new_slug = normalize_slug(building.name)
            new_image_url = get_building_image_url(new_slug)
            changed_fields: list[str] = []

            if building.slug != new_slug:
                building.slug = new_slug
                changed_fields.append("slug")

            if new_image_url and building.image_url != new_image_url:
                building.image_url = new_image_url
                changed_fields.append("image_url")

            if changed_fields:
                building.save(update_fields=changed_fields)
                updated += 1

        self.stdout.write(self.style.SUCCESS(f"Updated {updated} building records."))
