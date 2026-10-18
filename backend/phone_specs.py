"""
TechBoy Store — full specification enrichment.

Every phone starts from a compact 6-key spec dict
(Processor, Display, Camera, Battery, RAM, Storage). This module expands it
into a complete, modern spec sheet with GPU, cameras, video, software,
build, weight, connectivity and colours.

Used by:
  - backend/update_all_phones.py   (canonical catalog generator)
  - backend/scripts/update_live_deals.py (live deal refresh)
  - backend/scripts/sync_specs.py  (in-place DB/JSON sync)
"""

import re

# ── GPU lookup: matched by substring of the processor string ──────────────
# Ordered most-specific first.
GPU_MAP = [
    ("snapdragon 8 elite gen 2", "Adreno 840"),
    ("snapdragon 8 elite",       "Adreno 830"),
    ("snapdragon 8s gen 3",      "Adreno 735"),
    ("snapdragon 8 gen 3",       "Adreno 750"),
    ("snapdragon 7s gen 3",      "Adreno 810"),
    ("snapdragon 7 gen 3",       "Adreno 720"),
    ("exynos 2600",              "Xclipse 960"),
    ("exynos 1580",              "Xclipse 540"),
    ("exynos 1480",              "Xclipse 530"),
    ("exynos 1380",              "Mali-G68 MP5"),
    ("dimensity 9300",           "Immortalis-G720 MC12"),
    ("dimensity 9200",           "Immortalis-G715 MC11"),
    ("dimensity 7200 pro",       "Mali-G610 MC4"),
    ("dimensity 7200",           "Mali-G610 MC4"),
    ("dimensity 7025",           "IMG BXM-8-256"),
    ("dimensity 6300",           "Mali-G57 MC2"),
    ("dimensity 6100",           "Mali-G57 MC2"),
    ("helio g99",                "Mali-G57 MC2"),
    ("helio g91",                "Mali-G52 MC2"),
    ("helio g88",                "Mali-G52 MC2"),
    ("helio g81",                "Mali-G52 MC2"),
    ("tensor g4",                "Mali-G715 MC7"),
    ("a19 pro",                  "Apple 6-core GPU"),
    ("a18 pro",                  "Apple 6-core GPU"),
    ("a17 pro",                  "Apple 6-core GPU"),
    ("a19",                      "Apple 5-core GPU"),
    ("a18",                      "Apple 5-core GPU"),
    ("a16",                      "Apple 5-core GPU"),
]

# ── Software by brand ─────────────────────────────────────────────────────
BRAND_SOFTWARE = {
    "apple":   ("iOS 19", "5+ years of iOS updates"),
    "samsung": ("One UI 7 (Android 15)", "4 OS upgrades + 5 years security"),
    "google":  ("Android 15", "7 years of OS + security updates"),
    "xiaomi":  ("HyperOS 2 (Android 15)", "3 OS upgrades + 4 years security"),
    "poco":    ("HyperOS 2 (Android 15)", "3 OS upgrades + 4 years security"),
    "redmi":   ("HyperOS 2 (Android 15)", "3 OS upgrades + 4 years security"),
    "realme":  ("realme UI 6 (Android 15)", "2 OS upgrades + 3 years security"),
    "oneplus": ("OxygenOS 15 (Android 15)", "4 OS upgrades + 6 years security"),
    "nothing": ("Nothing OS 3 (Android 15)", "3 OS upgrades + 4 years security"),
    "vivo":    ("Funtouch OS 15 (Android 15)", "3 OS upgrades + 4 years security"),
    "iqoo":    ("Funtouch OS 15 (Android 15)", "3 OS upgrades + 4 years security"),
    "tecno":   ("HiOS 14 (Android 14)", "2 OS upgrades + 3 years security"),
    "infinix": ("XOS 14 (Android 14)", "2 OS upgrades + 3 years security"),
}

# ── Per-phone extras (everything not derivable from the base 6 keys) ──────
EXTRAS = {
    "Tecno Spark 30C": {
        "selfie": "8MP AI", "video": "1080p @ 30fps",
        "build": "Plastic frame · IP54 · Panda glass", "weight": "187 g",
        "colors": "Magic Skin Green, Titanium Grey",
    },
    "Redmi 13C 5G": {
        "selfie": "5MP", "video": "1080p @ 30fps",
        "build": "Plastic frame · Splash resistant", "weight": "192 g",
        "colors": "Startrail Green, Startrail Silver, Stardust Black",
    },
    "Samsung Galaxy M07": {
        "selfie": "8MP", "video": "1080p @ 30fps",
        "build": "Plastic frame · IP54", "weight": "191 g",
        "colors": "Black, Light Blue, Green",
    },
    "Realme C75": {
        "selfie": "8MP", "video": "1080p @ 30fps",
        "build": "Plastic frame · IP69 military-grade", "weight": "196 g",
        "colors": "Lightning Gold, Storm Black",
    },
    "Infinix Hot 50i": {
        "selfie": "8MP", "video": "1080p @ 30fps",
        "build": "Plastic frame · IP54", "weight": "184 g",
        "colors": "Titanium Grey, Sleek Black, Sage Green, Dreamy Purple",
    },
    "iQOO Z9 5G": {
        "selfie": "16MP", "video": "4K @ 30fps, 1080p @ 60fps",
        "build": "Plastic frame · IP64 · Panda glass", "weight": "188 g",
        "colors": "Brushed Green, Graphene Blue",
    },
    "Redmi Note 14 5G": {
        "selfie": "16MP", "video": "4K @ 30fps, 1080p @ 60fps",
        "build": "Plastic frame · IP64 · Gorilla Glass 5", "weight": "190 g",
        "colors": "Midnight Black, Ocean Blue, Coral Green",
    },
    "Samsung Galaxy A26 5G": {
        "selfie": "13MP", "video": "4K @ 30fps",
        "build": "Plastic frame · IP67 · Gorilla Glass Victus+", "weight": "200 g",
        "colors": "Black, Mint, Peach Pink, White",
    },
    "Nothing Phone (3a)": {
        "selfie": "32MP", "video": "4K @ 30fps",
        "build": "Glass back · IP64 · Panda glass", "weight": "201 g",
        "colors": "Black, White, Blue",
    },
    "vivo T5x 5G": {
        "selfie": "16MP", "video": "1080p @ 30fps",
        "build": "Plastic frame · IP64", "weight": "199 g",
        "colors": "Sonic Black, Star Grey",
    },
    "iQOO Neo 10R": {
        "selfie": "16MP", "video": "4K @ 30fps, 1080p @ 60fps",
        "build": "Plastic frame · IP65 · Schott glass", "weight": "198 g",
        "colors": "Raging Blue, Moonknight Titanium",
    },
    "Google Pixel 9a": {
        "selfie": "13MP", "video": "4K @ 60fps",
        "build": "Aluminium frame · IP68 · Gorilla Glass 3", "weight": "186 g",
        "colors": "Obsidian, Porcelain, Iris, Peony",
    },
    "Nothing Phone (3a) Pro": {
        "selfie": "32MP", "video": "4K @ 30fps",
        "build": "Glass back · IP64 · Panda glass", "weight": "211 g",
        "colors": "Black, Grey",
    },
    "Realme GT 7T": {
        "selfie": "32MP", "video": "4K @ 60fps",
        "build": "Plastic frame · IP69 · Crystal glass", "weight": "196 g",
        "colors": "Racing Yellow, Storm Black",
    },
    "POCO F7 5G": {
        "selfie": "20MP", "video": "4K @ 60fps",
        "build": "Aluminium frame · IP68 · Gorilla Glass 7i", "weight": "215 g",
        "colors": "Black, White, Green",
    },
    "OnePlus Nord CE 5": {
        "selfie": "16MP", "video": "4K @ 30fps",
        "build": "Plastic frame · IP65 · Reinforced glass", "weight": "196 g",
        "colors": "Nano Silver, Pastel Pink",
    },
    "POCO X8 Pro Max": {
        "selfie": "20MP", "video": "4K @ 60fps",
        "build": "Aluminium frame · IP68 · Gorilla Glass Victus", "weight": "213 g",
        "colors": "Black, Silver, Blue",
    },
    "vivo V70 FE": {
        "selfie": "50MP", "video": "4K @ 30fps",
        "build": "Glass back · IP68 · Schott glass", "weight": "197 g",
        "colors": "Titanium Black, Moonlight White, Lavender",
    },
    "Samsung Galaxy A37 5G": {
        "selfie": "13MP", "video": "4K @ 30fps",
        "build": "Aluminium frame · IP68 · Gorilla Glass Victus+", "weight": "192 g",
        "colors": "Awesome Navy, Awesome Grey, Awesome Lilac",
    },
    "OnePlus Nord 6": {
        "selfie": "32MP", "video": "4K @ 60fps",
        "build": "Aluminium frame · IP65 · Gorilla Glass 7i", "weight": "200 g",
        "colors": "Infinite Black, Glacier Blue",
    },
    "Realme GT 7 Pro": {
        "selfie": "16MP", "video": "4K @ 60fps, 8K @ 24fps",
        "build": "Aluminium frame · IP69 · Crystal glass", "weight": "222 g",
        "colors": "Mars Orange, Galaxy Grey",
    },
    "iQOO 13 5G": {
        "selfie": "32MP", "video": "8K @ 30fps, 4K @ 60fps",
        "build": "Aluminium frame · IP69 · Schott glass", "weight": "213 g",
        "colors": "Legend, Nardo Grey, Alpha",
    },
    "vivo V70": {
        "selfie": "50MP", "video": "4K @ 60fps",
        "build": "Aluminium frame · IP69 · Schott glass", "weight": "198 g",
        "colors": "Aurora Blue, Moonlight White, Titanium Grey",
    },
    "Samsung Galaxy A57 5G": {
        "selfie": "12MP", "video": "4K @ 60fps",
        "build": "Aluminium frame · IP68 · Gorilla Glass Victus+", "weight": "198 g",
        "colors": "Awesome Navy, Awesome Grey, Awesome Lilac",
    },
    "OnePlus 13R": {
        "selfie": "16MP", "video": "4K @ 60fps",
        "build": "Aluminium frame · IP65 · Gorilla Glass 7i", "weight": "206 g",
        "colors": "Astral Trail, Nebula Noir",
    },
    "OnePlus 13": {
        "selfie": "32MP", "video": "8K @ 30fps, 4K @ 60fps Dolby Vision",
        "build": "Aluminium frame · IP69 · Ceramic Guard", "weight": "210 g",
        "colors": "Midnight Ocean, Black Eclipse, Arctic Dawn",
    },
    "Google Pixel 9 Pro": {
        "selfie": "42MP", "video": "8K @ 30fps, 4K @ 60fps",
        "build": "Aluminium frame · IP68 · Gorilla Glass Victus 2", "weight": "199 g",
        "colors": "Obsidian, Porcelain, Hazel, Rose Quartz",
    },
    "Samsung Galaxy S25": {
        "selfie": "12MP", "video": "8K @ 30fps, 4K @ 60fps",
        "build": "Titanium frame · IP68 · Gorilla Glass Victus 2", "weight": "162 g",
        "colors": "Icy Blue, Navy, Mint, Silver Shadow",
    },
    "Apple iPhone 15": {
        "selfie": "12MP TrueDepth", "video": "4K @ 60fps Dolby Vision, Cinematic mode",
        "build": "Aluminium frame · IP68 · Ceramic Shield", "weight": "171 g",
        "colors": "Black, Blue, Green, Yellow, Pink",
    },
    "Samsung Galaxy S26+": {
        "selfie": "12MP", "video": "8K @ 30fps, 4K @ 60fps",
        "build": "Titanium frame · IP69 · Gorilla Glass Victus 3", "weight": "190 g",
        "colors": "Ice Blue, Black, Silver",
    },
    "Apple iPhone 17": {
        "selfie": "18MP Center Stage", "video": "4K @ 60fps Dolby Vision, Cinematic mode",
        "build": "Aluminium frame · IP68 · Ceramic Shield 2", "weight": "177 g",
        "colors": "Black, Lavender, Sage, Mist Blue",
    },
    "Samsung Galaxy S26": {
        "selfie": "12MP", "video": "8K @ 30fps, 4K @ 60fps",
        "build": "Titanium frame · IP69 · Gorilla Glass Victus 3", "weight": "168 g",
        "colors": "Ice Blue, Black, Silver",
    },
    "Apple iPhone 16": {
        "selfie": "12MP TrueDepth", "video": "4K @ 60fps Dolby Vision, Spatial video",
        "build": "Aluminium frame · IP68 · Ceramic Shield 2", "weight": "170 g",
        "colors": "Ultramarine, Teal, Pink, White, Black",
    },
    "Apple iPhone 15 Pro Max": {
        "selfie": "12MP TrueDepth", "video": "4K @ 60fps ProRes, Log, Cinematic",
        "build": "Titanium frame · IP68 · Ceramic Shield", "weight": "221 g",
        "colors": "Natural, Blue, White, Black Titanium",
    },
    "Samsung Galaxy S26 Ultra": {
        "selfie": "12MP", "video": "8K @ 30fps, 4K @ 120fps",
        "build": "Titanium frame · IP69 · Gorilla Armor 2", "weight": "218 g",
        "colors": "Titanium Silver, Black, White, Jade Green",
    },
    "Apple iPhone 17 Pro Max": {
        "selfie": "18MP Center Stage", "video": "4K @ 120fps ProRes, Log, ProRAW",
        "build": "Titanium frame · IP68 · Ceramic Shield 2", "weight": "233 g",
        "colors": "Cosmic Orange, Deep Blue, Silver",
    },
    "Samsung Galaxy Z Fold 7": {
        "selfie": "10MP + 4MP under-display", "video": "8K @ 30fps, 4K @ 60fps",
        "build": "Titanium hinge · IP48 · Gorilla Glass Ceramic 2", "weight": "215 g",
        "colors": "Blue Shadow, Silver Shadow, Jet Black",
    },
    "Samsung Galaxy Z Flip 7": {
        "selfie": "10MP", "video": "4K @ 60fps",
        "build": "Aluminium frame · IP48 · Gorilla Glass Victus 2", "weight": "188 g",
        "colors": "Blue Shadow, Mint, Jet Black, Coral Red",
    },
    "Apple iPhone 17 Pro": {
        "selfie": "18MP Center Stage", "video": "4K @ 120fps ProRes, Log, ProRAW",
        "build": "Titanium frame · IP68 · Ceramic Shield 2", "weight": "199 g",
        "colors": "Cosmic Orange, Deep Blue, Silver",
    },
    "Apple iPhone 16 Pro Max": {
        "selfie": "12MP TrueDepth", "video": "4K @ 120fps ProRes, Log, Cinematic",
        "build": "Titanium frame · IP68 · Ceramic Shield 2", "weight": "227 g",
        "colors": "Desert Titanium, Natural, Black, White",
    },
}

SELFIE_DEFAULT = "8MP"
VIDEO_DEFAULT = "1080p @ 30fps"
BUILD_DEFAULT = "Glass front · Aluminium frame"
WEIGHT_DEFAULT = "—"


def _gpu_for(processor: str) -> str:
    p = (processor or "").lower()
    for token, gpu in GPU_MAP:
        if token in p:
            return gpu
    return "Integrated GPU"


def _software_for(brand: str):
    return BRAND_SOFTWARE.get((brand or "").lower(), ("Android 15", "3 years of security updates"))


def _split_battery(battery: str):
    """'5000mAh 18W' -> ('5000mAh', '18W'); keeps any trailing wireless info."""
    text = (battery or "").strip()
    m = re.match(r"^([\d,.]+\s*mAh)\b\s*(.*)$", text, flags=re.IGNORECASE)
    if not m:
        return (text or "—", "Fast charging")
    capacity = m.group(1).strip()
    charging = m.group(2).strip()
    return (capacity, charging or "Fast charging")


def _connectivity_for(price: int) -> str:
    if price >= 60000:
        return "5G · Wi-Fi 7 · Bluetooth 5.4 · NFC · USB-C 3.2 · Dual-band GPS"
    if price >= 25000:
        return "5G · Wi-Fi 6 · Bluetooth 5.3 · NFC · USB-C · GPS"
    return "5G · Wi-Fi 5 · Bluetooth 5.2 · USB-C · GPS"


def enrich_specs(name: str, brand: str, price, base_specs: dict) -> dict:
    """Expand a compact spec dict into a full, ordered spec sheet."""
    base = base_specs or {}
    extras = EXTRAS.get(name, {})
    processor = base.get("Processor", "—")
    battery_capacity, charging = _split_battery(base.get("Battery", ""))
    os_name, updates = _software_for(brand)
    try:
        price_val = int(price or 0)
    except (TypeError, ValueError):
        price_val = 0

    return {
        "Processor": processor,
        "GPU": _gpu_for(processor),
        "Display": base.get("Display", "—"),
        "Rear Camera": base.get("Camera", "—"),
        "Selfie Camera": extras.get("selfie", SELFIE_DEFAULT),
        "Video": extras.get("video", VIDEO_DEFAULT),
        "RAM": base.get("RAM", "—"),
        "Storage": base.get("Storage", "—"),
        "Battery": battery_capacity,
        "Charging": charging,
        "Operating System": os_name,
        "Software Updates": updates,
        "Build": extras.get("build", BUILD_DEFAULT),
        "Weight": extras.get("weight", WEIGHT_DEFAULT),
        "Connectivity": _connectivity_for(price_val),
        "Colors": extras.get("colors", "—"),
    }
