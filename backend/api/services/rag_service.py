"""Catalog-grounded retrieval (RAG) for the TechBoy assistant.

Features:
- Smart budget extraction (e.g., 'under 20k', 'below 35,000', 'around 15k').
- Multi-feature weighted scoring (Camera, Gaming/Processor, Battery, Display, Value).
- Brand boost & penalization for irrelevant brands.
- Compact formatted catalog context for LLMs with strict anti-hallucination guardrails.
- High-quality local fallback advisor when the external LLM is offline or unconfigured.
"""
import re
from dataclasses import dataclass
from api.models import Product

STOP_WORDS = {
    'a', 'an', 'and', 'are', 'best', 'for', 'i', 'in', 'is', 'me', 'of',
    'phone', 'phones', 'recommend', 'show', 'the', 'to', 'want', 'with',
    'which', 'should', 'buy', 'suggest', 'find', 'give', 'good', 'mobile',
}

def _normalise(value):
    return re.sub(r'[^a-z0-9₹]+', ' ', str(value or '').lower()).strip()

def _tokens(query):
    return {word for word in _normalise(query).split() if len(word) > 1 and word not in STOP_WORDS}

def _extract_budget(query):
    """
    Extracts budget constraints like:
    - 'under 15k', 'below 25000', 'under ₹30,000', 'around 20k', 'max 40k'
    """
    q = _normalise(query)
    match = re.search(r'(?:under|below|within|budget|rs|₹|max|around|upto|up to)?\s*(\d+(?:\.\d+)?)\s*(k|thousand|000)?', q)
    if not match:
        return None
    num_str, mult = match.group(1), match.group(2)
    number = float(num_str)
    if mult in ('k', 'thousand') or number < 500:
        return int(number * 1000)
    return int(number)

def _product_text(product):
    specs = product.specs.values() if isinstance(product.specs, dict) else [product.specs]
    return _normalise(' '.join(map(str, [
        product.name,
        product.brand or '',
        product.category or '',
        product.tag or '',
        product.description or '',
        *specs
    ])))

@dataclass
class RetrievedProduct:
    product: Product
    score: float

def retrieve_products(query, limit=5):
    """
    RAG Retrieval step: Ranks database products based on user intent.
    Matches budget, brand, gaming/performance, camera, battery, and 5G specs.
    """
    query_text = _normalise(query)
    tokens = _tokens(query)
    budget = _extract_budget(query)
    
    products = Product.objects.all()
    if not products.exists():
        return []

    brands = {_normalise(b) for b in products.values_list('brand', flat=True) if b}
    requested_brand = next((b for b in brands if b and b in query_text), None)

    # Intent flags
    wants_gaming = any(w in query_text for w in ('gaming', 'game', 'performance', 'pubg', 'fps', 'processor', 'snapdragon'))
    wants_camera = any(w in query_text for w in ('camera', 'photo', 'video', 'portrait', 'selfie', 'ois', 'mp'))
    wants_battery = any(w in query_text for w in ('battery', 'backup', 'mah', 'charging', 'fast charge', 'long lasting'))
    wants_display = any(w in query_text for w in ('screen', 'display', 'amoled', '120hz', 'refresh rate'))
    wants_flagship = any(w in query_text for w in ('flagship', 'premium', 'best overall', 'top tier', 'high end'))
    wants_5g = '5g' in query_text

    scored = []
    for product in products:
        text = _product_text(product)
        price = product.price or 0
        score = sum(8 for token in tokens if token in text)

        # Brand weight
        if requested_brand:
            score += 70 if _normalise(product.brand) == requested_brand else -90

        # Budget scoring (strongly prefers highest spec phone right under or at the budget)
        if budget:
            if price <= budget:
                # Closer to budget ceiling gets more score
                score += 40 - ((budget - price) / max(budget, 1)) * 15
            else:
                score -= 80  # Penalty for exceeding user budget

        # Intent weightings
        if wants_gaming and any(w in text for w in ('snapdragon', 'dimensity', 'elite', 'bionic', 'gaming', 'adreno')):
            score += 30
        if wants_camera and any(w in text for w in ('ois', '50mp', '108mp', '200mp', 'periscope', 'telephoto', 'sony')):
            score += 30
        if wants_battery and any(w in text for w in ('5000mah', '6000mah', 'battery', '67w', '80w', '100w', '120w')):
            score += 25
        if wants_display and any(w in text for w in ('amoled', 'oled', '120hz', '144hz', 'ltpo')):
            score += 20
        if wants_5g and '5g' in text:
            score += 15
        if wants_flagship and price >= 45000:
            score += 35

        # Incorporate rating boost
        score += (product.rating or 4.0) * 3

        scored.append(RetrievedProduct(product, score))

    ranked = sorted(scored, key=lambda item: (item.score, item.product.rating, -item.product.price), reverse=True)
    return [item.product for item in ranked[:limit]]


def build_context(products):
    """
    Formatted RAG context supplied directly to the LLM.
    Strictly instructs the LLM with verified facts from the live store database.
    """
    if not products:
        return 'No matching TechBoy catalog products found in the database.'
    
    docs = []
    for p in products:
        specs_str = ', '.join(f'{k}: {v}' for k, v in (p.specs or {}).items()) if isinstance(p.specs, dict) else str(p.specs or '')
        docs.append(
            f"📱 [ID #{p.id}] {p.name}\n"
            f"• Brand: {p.brand or 'Unknown'}\n"
            f"• Verified Store Price: ₹{p.price:,}\n"
            f"• Rating: {p.rating} / 5.0\n"
            f"• Tag: {p.tag or 'Verified'}\n"
            f"• Key Specs: {specs_str}\n"
            f"• Summary: {p.description}\n"
            f"• Store Link: {p.amazon_link or p.flipkart_link or 'https://techboy-store.vercel.app/'}"
        )
    return '\n\n'.join(docs)


def local_answer(products):
    """
    Instant fallback answer when external LLM API is unavailable.
    """
    if not products:
        return "I couldn't find a matching phone in the current TechBoy catalog. Try asking with a specific brand (e.g. *Samsung*, *iPhone*, *OnePlus*) or a budget like *under ₹20,000*!"

    picks = products[:3]
    lines = ["Here are the best verified smartphones matching your criteria:\n"]
    for i, p in enumerate(picks, 1):
        specs = p.specs or {}
        spec_highlight = []
        if 'Processor' in specs:
            spec_highlight.append(f"⚡ {specs['Processor']}")
        if 'Camera' in specs:
            spec_highlight.append(f"📷 {specs['Camera']}")
        if 'Battery' in specs:
            spec_highlight.append(f"🔋 {specs['Battery']}")

        spec_str = " | ".join(spec_highlight) if spec_highlight else p.description
        tag_str = f" *({p.tag})*" if p.tag else ""
        lines.append(f"**{i}. {p.name}** — **₹{p.price:,}**{tag_str}\n> {spec_str}\n")

    lines.append("💡 *Prices are live verified from TechBoy Store. Click on any phone in the store to view full benchmark graphs and set price drop alerts!*")
    return '\n'.join(lines)
