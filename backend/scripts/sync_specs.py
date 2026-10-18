"""
In-place spec sync.

Updates the `specs` field for every existing Product (matched by name) from the
canonical CURATED_PHONES catalog, and mirrors the same specs into the static
frontend fallback (frontend/src/data/phones.json).

This intentionally does NOT touch prices, links, ratings or PriceHistory, so it
is safe to run against a live database.
"""

import os
import sys
import json

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

import django  # noqa: E402
django.setup()

from api.models import Product  # noqa: E402
from update_all_phones import CURATED_PHONES  # noqa: E402


def main():
    specs_by_name = {item["name"]: item["specs"] for item in CURATED_PHONES}

    # 1. Database
    updated = 0
    for product in Product.objects.all():
        new_specs = specs_by_name.get(product.name)
        if new_specs and product.specs != new_specs:
            product.specs = new_specs
            product.save(update_fields=["specs"])
            updated += 1
    print(f"[specs] Updated {updated} product(s) in the database.")

    # 2. Static frontend fallback
    repo_root = os.path.dirname(backend_dir)
    json_path = os.path.join(repo_root, "frontend", "src", "data", "phones.json")
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            phones = json.load(f)
        json_updates = 0
        for item in phones:
            new_specs = specs_by_name.get(item.get("name"))
            if new_specs:
                item["specs"] = new_specs
                json_updates += 1
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(phones, f, indent=2, ensure_ascii=False)
        print(f"[specs] Updated {json_updates} entries in {json_path}")
    else:
        print(f"[specs] phones.json not found at {json_path}")


if __name__ == "__main__":
    main()
