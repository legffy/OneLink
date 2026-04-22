from __future__ import annotations

import os
from pathlib import Path

import requests
from django.core.management.base import BaseCommand, CommandError

from core.building_images import BUILDING_IMAGE_FILENAMES, get_building_image_url
from core.models import Building


class Command(BaseCommand):
    help = "Upload known building images from client/public to Supabase Storage and update building.image_url."

    def handle(self, *args, **options):
        service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()
        if not service_role_key:
            raise CommandError("SUPABASE_SERVICE_ROLE_KEY is required to upload to Supabase Storage.")

        project_url = os.getenv("SUPABASE_URL", "").strip().rstrip("/")
        if not project_url:
            direct_host = os.getenv("SUPABASE_DIRECT_HOST", "").strip()
            if direct_host.startswith("db."):
                project_url = f"https://{direct_host.removeprefix('db.')}"

        if not project_url:
            raise CommandError("SUPABASE_URL or SUPABASE_DIRECT_HOST is required.")

        bucket = os.getenv("SUPABASE_BUILDING_IMAGE_BUCKET", "building-images").strip("/")
        prefix = os.getenv("SUPABASE_BUILDING_IMAGE_PREFIX", "").strip("/")

        repo_root = Path(__file__).resolve().parents[4]
        public_dir = repo_root / "client" / "public"

        if not public_dir.exists():
            raise CommandError(f"Could not find frontend public directory at {public_dir}")

        uploaded = 0
        updated = 0

        for slug, filename in BUILDING_IMAGE_FILENAMES.items():
            file_path = public_dir / filename
            if not file_path.exists():
                self.stdout.write(self.style.WARNING(f"Skipping missing file: {file_path}"))
                continue

            object_path = f"{prefix}/{filename}" if prefix else filename
            upload_url = f"{project_url}/storage/v1/object/{bucket}/{object_path}"
            content_type = "image/png" if file_path.suffix.lower() == ".png" else "image/jpeg"

            with file_path.open("rb") as image_file:
                response = requests.post(
                    upload_url,
                    headers={
                        "Authorization": f"Bearer {service_role_key}",
                        "apikey": service_role_key,
                        "x-upsert": "true",
                        "Content-Type": content_type,
                    },
                    data=image_file.read(),
                    timeout=30,
                )

            response.raise_for_status()
            uploaded += 1

            public_url = get_building_image_url(slug)
            if not public_url:
                self.stdout.write(self.style.WARNING(f"Could not build public URL for slug {slug}"))
                continue

            changed = Building.objects.filter(slug=slug).exclude(image_url=public_url).update(image_url=public_url)
            updated += changed

        self.stdout.write(self.style.SUCCESS(f"Uploaded {uploaded} images and updated {updated} building records."))
