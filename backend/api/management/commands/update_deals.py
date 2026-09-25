import os
from django.core.management.base import BaseCommand
from scripts.update_live_deals import update_all_deals

class Command(BaseCommand):
    help = 'Automatically fetches live market deals, updates prices, logs price history graphs, and refreshes store links'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Starting automated TechBoy deals & graph updater..."))
        result = update_all_deals()
        self.stdout.write(self.style.SUCCESS(f"Deals update completed: {result}"))
