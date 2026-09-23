/**
 * Smart Search Engine Utility for TechBoy Store
 * Supports multi-token search, brand/model matching, specs parsing,
 * and price-intent filtering (e.g. "under 20000", "under 30k").
 */

// Parse price query like "under 20000", "under 25k", "below 30000"
export const parsePriceIntent = (query) => {
    if (!query) return null;
    const lower = query.toLowerCase();
    
    // "under 25k" or "under 25000" or "below 30k" or "< 20000"
    const underMatch = lower.match(/(?:under|below|less than|<)\s*₹?\s*(\d+)(k)?/i);
    if (underMatch) {
        let val = parseInt(underMatch[1], 10);
        if (underMatch[2] || val < 500) {
            val = val * 1000;
        }
        return { type: 'maxPrice', value: val };
    }

    // "above 50k" or "above 50000" or "> 30000"
    const aboveMatch = lower.match(/(?:above|over|more than|>)\s*₹?\s*(\d+)(k)?/i);
    if (aboveMatch) {
        let val = parseInt(aboveMatch[1], 10);
        if (aboveMatch[2] || val < 500) {
            val = val * 1000;
        }
        return { type: 'minPrice', value: val };
    }

    return null;
};

/**
 * Intelligent multi-token product matching function
 * @param {Object} product 
 * @param {string} rawQuery 
 * @returns {boolean}
 */
export const matchesSearch = (product, rawQuery) => {
    if (!rawQuery || !rawQuery.trim()) return true;
    if (!product) return false;

    // Check if query has a price intent filter
    const priceIntent = parsePriceIntent(rawQuery);
    if (priceIntent) {
        if (priceIntent.type === 'maxPrice' && product.price > priceIntent.value) {
            return false;
        }
        if (priceIntent.type === 'minPrice' && product.price < priceIntent.value) {
            return false;
        }
    }

    // Clean query by removing price phrases so remaining tokens match product text
    const cleanedQuery = rawQuery
        .toLowerCase()
        .replace(/(?:under|below|less than|above|over|more than|[<>])\s*₹?\s*\d+k?/gi, '')
        .trim();

    if (!cleanedQuery) {
        // Query only had a price constraint (e.g. "under 20000"), and product matched price
        return true;
    }

    // Split query into individual words/tokens
    const tokens = cleanedQuery.split(/\s+/).filter(Boolean);

    // Build comprehensive search corpus for this product
    const name = (product.name || '').toLowerCase();
    const brand = (product.brand || '').toLowerCase();
    const category = (product.category || '').toLowerCase();
    const tag = (product.tag || '').toLowerCase();
    const description = (product.description || '').toLowerCase();

    // Extract specs values (RAM, storage, processor, display, camera, battery)
    let specsText = '';
    if (product.specs) {
        if (typeof product.specs === 'object') {
            specsText = Object.entries(product.specs)
                .map(([k, v]) => `${k} ${v}`)
                .join(' ')
                .toLowerCase();
        } else if (typeof product.specs === 'string') {
            specsText = product.specs.toLowerCase();
        }
    }

    // Combine all attributes
    const corpus = `${brand} ${name} ${category} ${tag} ${specsText} ${description}`;

    // EVERY token must be matched in the product attributes
    return tokens.every(token => {
        // Direct inclusion
        if (corpus.includes(token)) return true;

        // Specific handling for "5g" (e.g., if token is "5g", check name or specs)
        if (token === '5g') {
            return corpus.includes('5g') || name.includes('5g');
        }

        // Specific handling for storage / RAM like "128gb" or "128"
        if (/^\d+gb$/i.test(token)) {
            const num = token.replace(/gb/i, '');
            return corpus.includes(token) || corpus.includes(num);
        }

        return false;
    });
};

/**
 * Filter an array of products using the smart search query
 */
export const filterProducts = (products = [], query = '') => {
    if (!query || !query.trim()) return products;
    return products.filter(p => matchesSearch(p, query));
};

/**
 * Trending and recommended search tags
 */
export const TRENDING_SEARCHES = [
    { label: 'iPhone 16', query: 'iPhone 16' },
    { label: 'Galaxy S24', query: 'Galaxy S24' },
    { label: 'OnePlus 13', query: 'OnePlus 13' },
    { label: '5G Under 20K', query: '5G under 20000' },
    { label: 'Nothing Phone', query: 'Nothing' },
    { label: 'Snapdragon', query: 'Snapdragon' }
];
