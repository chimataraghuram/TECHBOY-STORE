self.onmessage = function(e) {
    const { products, debouncedSearch, selectedRange, selectedBrands, minPrice, maxPrice, sortBy } = e.data;
    
    let filteredProducts = [...(products || [])];
    let term = (debouncedSearch || "").toLowerCase().trim();

    // -- AI SMART PARSING --
    let dynamicMaxPrice = maxPrice;
    let requiredKeywords = [];

    // Parse budget constraints (e.g., "under 40k", "below 30000")
    const budgetMatch = term.match(/(?:under|below|less than|max)\s*(\d+)(k|000)?/i);
    if (budgetMatch) {
        let val = parseInt(budgetMatch[1], 10);
        if (budgetMatch[2] === 'k' || budgetMatch[2] === 'K') val *= 1000;
        else if (val < 1000) val *= 1000; // assume someone typing "under 40" means 40k
        
        dynamicMaxPrice = Math.min(val, dynamicMaxPrice || Infinity);
        
        // Remove the budget string from term so we don't try to search for the literal text "under 40k"
        term = term.replace(budgetMatch[0], '').trim();
    }

    // Parse intent keywords
    const intents = ['gaming', 'camera', 'battery', 'display', 'fast'];
    intents.forEach(intent => {
        if (term.includes(intent)) {
            requiredKeywords.push(intent);
            term = term.replace(intent, '').trim();
        }
    });
    
    // Remove fluff words
    term = term.replace(/phones?/gi, '').replace(/mobiles?/gi, '').trim();

    // 1. Search & Category
    if (term) {
        filteredProducts = filteredProducts.filter(p => 
            (p.name && p.name.toLowerCase().includes(term)) || 
            (p.category && p.category.toLowerCase().includes(term)) ||
            (p.tag && p.tag.toLowerCase().includes(term)) ||
            (p.description && p.description.toLowerCase().includes(term))
        );
    } else if (selectedRange && selectedRange !== "All") {
        filteredProducts = filteredProducts.filter(p => p.category === selectedRange);
    }

    // Apply Intents
    if (requiredKeywords.length > 0) {
        filteredProducts = filteredProducts.filter(p => {
            const desc = (p.description || "").toLowerCase();
            return requiredKeywords.every(kw => {
                if (kw === 'gaming') return desc.includes('bionic') || desc.includes('snapdragon') || desc.includes('dimensity') || desc.includes('tensor');
                if (kw === 'camera') return desc.includes('mp') || desc.includes('camera') || desc.includes('lens');
                if (kw === 'battery') return desc.includes('mah') || desc.includes('battery');
                if (kw === 'display') return desc.includes('hz') || desc.includes('amoled') || desc.includes('oled') || desc.includes('nits');
                if (kw === 'fast') return desc.includes('fast') || desc.includes('watt') || desc.includes('w charging');
                return desc.includes(kw);
            });
        });
    }

    // 2. Brands
    if (selectedBrands && selectedBrands.length > 0) {
        filteredProducts = filteredProducts.filter(p => p.brand && selectedBrands.includes(p.brand));
    }

    // 3. Price
    if (minPrice !== undefined && dynamicMaxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= minPrice && p.price <= dynamicMaxPrice);
    }

    // 4. Sort
    if (sortBy === 'price_asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
        filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    self.postMessage({ filteredProducts });
};
