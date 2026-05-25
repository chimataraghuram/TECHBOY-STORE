import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 900);
            if (window.innerWidth >= 900) {
                setIsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleBrand = (brand) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };

    const sidebarContent = (
        <div className="sidebar-inner-content">
            <div className="filter-header">
                <h3><Filter size={20} /> Filters</h3>
                <div className="filter-header-actions">
                    <button className="clear-filters-btn" onClick={onClearFilters}>Clear All</button>
                    {isMobile && (
                        <button className="close-sidebar-btn" onClick={() => setIsOpen(false)}>
                            <X size={18} />
                        </button>
                    )}
                </div>
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

            {(() => {
                const maxLimit = highestPrice > 5000 ? highestPrice : 150000;
                const percentage = ((maxPrice - 5000) / (maxLimit - 5000)) * 100;
                return (
                    <div className="filter-section">
                        <div className="price-header-wrapper">
                            <h4>Max Price</h4>
                            <div className="price-input-wrapper">
                                <span className="currency-symbol">₹</span>
                                <input 
                                    type="number"
                                    className="price-glow-input"
                                    min="5000"
                                    max={maxLimit}
                                    value={maxPrice === 0 ? '' : maxPrice}
                                    onChange={(e) => {
                                        let val = parseInt(e.target.value);
                                        if (isNaN(val)) val = 0;
                                        setMaxPrice(val);
                                    }}
                                    onBlur={() => {
                                        if (!maxPrice || maxPrice < 5000) setMaxPrice(5000);
                                        else if (maxPrice > maxLimit) setMaxPrice(maxLimit);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="slider-wrapper">
                            <input 
                                type="range" 
                                className="price-slider neon-slider"
                                min="5000" 
                                max={maxLimit} 
                                step="1000"
                                value={maxPrice || 5000} 
                                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                                style={{ 
                                    background: `linear-gradient(90deg, var(--accent-primary) ${percentage}%, rgba(255, 255, 255, 0.08) ${percentage}%)` 
                                }}
                            />
                        </div>
                        <div className="price-labels">
                            <span>₹5,000</span>
                            <span>₹{maxLimit.toLocaleString()}</span>
                        </div>
                        <div className="price-quick-picks">
                            {[15000, 30000, 50000, 80000].map(tier => (
                                tier < maxLimit && (
                                    <button 
                                        key={tier}
                                        className={`price-pill ${maxPrice === tier ? 'active' : ''}`}
                                        onClick={() => setMaxPrice(tier)}
                                    >
                                        {tier / 1000}k
                                    </button>
                                )
                            ))}
                            <button 
                                className={`price-pill ${maxPrice === maxLimit ? 'active' : ''}`}
                                onClick={() => setMaxPrice(maxLimit)}
                            >
                                Max
                            </button>
                        </div>
                    </div>
                );
            })()}

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
        </div>
    );

    return (
        <>
            {/* Mobile Toggle Button */}
            {isMobile && (
                <button className="mobile-filter-toggle jelly-btn mini" onClick={() => setIsOpen(true)}>
                    <Filter size={18} /> Show Filters
                </button>
            )}

            {/* Desktop View */}
            {!isMobile && (
                <aside className="filter-sidebar glass-card">
                    {sidebarContent}
                </aside>
            )}

            {/* Mobile View with Drawer Overlay */}
            {isMobile && (
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop Blur Overlay */}
                            <motion.div 
                                className="filter-drawer-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                            />

                            {/* Sliding Sidebar Panel */}
                            <motion.aside 
                                className="filter-sidebar-drawer glass-card"
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            >
                                {sidebarContent}
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>
            )}
        </>
    );
};

export default FilterSidebar;
