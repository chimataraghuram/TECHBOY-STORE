import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';
import './FilterSidebar.css';

const FilterSidebar = ({
    brands,
    selectedBrands,
    setSelectedBrands,
    maxPrice,
    setMaxPrice,
    highestPrice,
    sortBy,
    setSortBy,
    onClearFilters
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleBrand = (brand) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button className="mobile-filter-toggle jelly-btn mini" onClick={() => setIsOpen(!isOpen)}>
                <Filter size={18} /> {isOpen ? 'Hide Filters' : 'Show Filters'}
            </button>

            <motion.aside 
                className={`filter-sidebar glass-card ${isOpen ? 'open' : ''}`}
            >
                <div className="filter-header">
                    <h3><Filter size={20} /> Filters</h3>
                    <button className="clear-filters-btn" onClick={onClearFilters}>Clear All</button>
                </div>

                <div className="filter-section">
                    <h4>Sort By</h4>
                    <select 
                        className="sort-dropdown"
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="featured">Featured</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                    </select>
                </div>

                <div className="filter-section">
                    <h4>Max Price: ₹{maxPrice.toLocaleString()}</h4>
                    <input 
                        type="range" 
                        className="price-slider"
                        min="5000" 
                        max={highestPrice > 5000 ? highestPrice : 150000} 
                        step="1000"
                        value={maxPrice} 
                        onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    />
                    <div className="price-labels">
                        <span>₹5,000</span>
                        <span>₹{highestPrice.toLocaleString()}</span>
                    </div>
                </div>

                <div className="filter-section">
                    <h4>Brands</h4>
                    <div className="brand-list">
                        {brands.map(brand => (
                            <label key={brand} className="brand-checkbox">
                                <input 
                                    type="checkbox" 
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => toggleBrand(brand)}
                                />
                                <span className="custom-checkbox"></span>
                                {brand}
                            </label>
                        ))}
                    </div>
                </div>
            </motion.aside>
        </>
    );
};

export default FilterSidebar;
