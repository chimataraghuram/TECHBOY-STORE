self.onmessage = function(e) {
    const { products, debouncedSearch, selectedRange, selectedBrands, minPrice, maxPrice, sortBy } = e.data;
    
    let filteredProducts = [...(products || [])];
    const term = (debouncedSearch || "").toLowerCase().trim();

    // 1. Search & Category
    if (term) {
        filteredProducts = filteredProducts.filter(p => 
            (p.name && p.name.toLowerCase().includes(term)) || 
            (p.category && p.category.toLowerCase().includes(term)) ||
            (p.tag && p.tag.toLowerCase().includes(term)) ||
            (p.description && p.description.toLowerCase().includes(term))
        );
    } else if (selectedRange) {
        filteredProducts = filteredProducts.filter(p => p.category === selectedRange);
    }

    // 2. Brands
    if (selectedBrands && selectedBrands.length > 0) {
        filteredProducts = filteredProducts.filter(p => p.brand && selectedBrands.includes(p.brand));
    }

    // 3. Price
    if (minPrice !== undefined && maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);
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
