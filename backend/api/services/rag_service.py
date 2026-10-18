"""Catalog-grounded retrieval for the TechBoy assistant.

This deliberately uses a dependency-free hybrid ranker so it works with both
SQLite and Postgres.  It is the retrieval half of RAG: only the small set of
products returned by ``retrieve_products`` is ever supplied to the LLM.
"""
import re
from dataclasses import dataclass

from django.db.models import QuerySet

from api.models import Product


STOP_WORDS = {
    'a', 'an', 'and', 'are', 'best', 'for', 'i', 'in', 'is', 'me', 'of',
    'phone', 'phones', 'recommend', 'show', 'the', 'to', 'want', 'with',
}


def _normalise(value):
    return re.sub(r'[^a-z0-9]+', ' ', str(value or '').lower()).strip()


def _tokens(query):
    return {word for word in _normalise(query).split() if len(word) > 1 and word not in STOP_WORDS}


def _budget(query):
    match = re.search(r'(?:under|below|within|budget|rs|₹)?\s*(\d+(?:\.\d+)?)\s*(k|000)?', _normalise(query))
    if not match:
        return None
    number = float(match.group(1))
    return int(number * 1000) if match.group(2) == 'k' or number < 1000 else int(number)


def _product_text(product):
    specs = product.specs.values() if isinstance(product.specs, dict) else [product.specs]
    return _normalise(' '.join(map(str, [product.name, product.brand, product.category,
                                          product.tag, product.description, *specs])))


@dataclass
class RetrievedProduct:
    product: Product
    score: float


def retrieve_products(query, limit=5):
    """Return catalog products ranked for a shopper query, without an LLM."""
    query_text = _normalise(query)
    tokens = _tokens(query)
    budget = _budget(query)
    products = Product.objects.all()
    brands = {_normalise(brand) for brand in products.values_list('brand', flat=True) if brand}
    requested_brand = next((brand for brand in brands if brand and brand in query_text), None)
    scored = []

    for product in products:
        text = _product_text(product)
        score = sum(7 for token in tokens if token in text)
        if requested_brand:
            score += 60 if _normalise(product.brand) == requested_brand else -80
        if budget:
            # Prefer the best product close to, but not beyond, the stated ceiling.
            score += 35 - (budget - product.price) / max(budget, 1) * 15 if product.price <= budget else -50
        if any(word in query_text for word in ('gaming', 'game', 'performance')) and any(word in text for word in ('snapdragon', 'dimensity', 'gaming', 'elite')):
            score += 22
        if any(word in query_text for word in ('camera', 'photo', 'photography')) and any(word in text for word in ('camera', 'mp', 'ois', 'telephoto')):
            score += 22
        if any(word in query_text for word in ('battery', 'backup', 'charging')) and any(word in text for word in ('battery', 'mah', 'charge')):
            score += 22
        scored.append(RetrievedProduct(product, score))

    return [item.product for item in sorted(scored, key=lambda item: (item.score, item.product.rating, item.product.price), reverse=True)[:limit]]


def build_context(products):
    """A compact, auditable context window for the generation step."""
    if not products:
        return 'No matching TechBoy catalog products were retrieved.'
    documents = []
    for product in products:
        specs = ', '.join(f'{key}: {value}' for key, value in (product.specs or {}).items())
        documents.append(
            f'[Product #{product.id}] {product.name} | Brand: {product.brand or "Unknown"} | '
            f'Price: ₹{product.price:,} | Tag: {product.tag or ""} | Specs: {specs} | '
            f'Description: {product.description}'
        )
    return '\n'.join(documents)


def local_answer(products):
    if not products:
        return "I couldn't find a matching phone in the current TechBoy catalog. Try a brand, budget, or use case."
    picks = products[:3]
    lines = ['Here are the closest catalog matches:']
    lines.extend(f'- **{product.name}** — ₹{product.price:,}: {product.tag or product.description}' for product in picks)
    lines.append('Prices are stored TechBoy catalog prices; check the retailer link for live availability.')
    return '\n'.join(lines)
