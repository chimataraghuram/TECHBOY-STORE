import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import './FilterSidebar.css';

const FilterSidebar = ({
    brands,
    selectedBrands,
    setSelectedBrands,
    minPrice,
    setMinPrice,
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
                
                // Safe fallbacks if props are somehow undefined
                const currentMin = minPrice || 0;
                const currentMax = maxPrice || maxLimit;
                
                // Calculate percentages for track fill
                const minPercent = (currentMin / maxLimit) * 100;
                const maxPercent = (currentMax / maxLimit) * 100;
                
                // Smart hints logic
                const getSmartHints = () => {
                    if (currentMax < 25000) return ["✓ Best budget smartphones", "✓ Reliable daily drivers", "✓ Excellent battery life"];
                    if (currentMax < 45000) return ["✓ Mid-range killers", "✓ Great camera systems", "✓ Smooth 120Hz displays"];
                    if (currentMax <= 80000) return ["✓ Premium segment", "✓ Flagship performance", "✓ High-end photography"];
                    return ["✓ Ultimate flagships", "✓ Best-in-class cameras", "✓ No-compromise experience"];
                };

                const handleQuickPick = (min, max) => {
                    if (setMinPrice) setMinPrice(min);
                    setMaxPrice(max);
                };

                return (
                    <div className="filter-section">
                        <h4>Budget Range</h4>
                        
                        <div className="budget-inputs">
                            <div className="budget-input-group">
                                <span className="budget-label">Min</span>
                                <div className="price-input-wrapper">
                                    <span className="currency-symbol">₹</span>
                                    <input 
                                        type="number"
                                        className="price-glow-input"
                                        min="0"
                                        max={currentMax}
                                        value={currentMin === 0 ? '' : currentMin}
                                        onChange={(e) => {
                                            if (setMinPrice) {
                                                let val = parseInt(e.target.value);
                                                if (isNaN(val)) val = 0;
                                                setMinPrice(val);
                                            }
                                        }}
                                        onBlur={() => {
                                            if (setMinPrice) {
                                                if (currentMin > currentMax) setMinPrice(currentMax);
                                                else if (currentMin < 0) setMinPrice(0);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            
                            <div className="budget-input-group">
                                <span className="budget-label">Max</span>
                                <div className="price-input-wrapper">
                                    <span className="currency-symbol">₹</span>
                                    <input 
                                        type="number"
                                        className="price-glow-input"
                                        min={currentMin}
                                        max={maxLimit}
                                        value={currentMax === 0 ? '' : currentMax}
                                        onChange={(e) => {
                                            let val = parseInt(e.target.value);
                                            if (isNaN(val)) val = 0;
                                            setMaxPrice(val);
                                        }}
                                        onBlur={() => {
                                            if (!currentMax || currentMax < currentMin) setMaxPrice(currentMin);
                                            else if (currentMax > maxLimit) setMaxPrice(maxLimit);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="slider-wrapper">
                            <div className="slider-track-bg"></div>
                            <div 
                                className="slider-track-fill" 
                                style={{ 
                                    left: `${minPercent}%`, 
                                    width: `${maxPercent - minPercent}%` 
                                }}
                            ></div>
                            
                            <input 
                                type="range" 
                                className="neon-slider"
                                min="0" 
                                max={maxLimit} 
                                step="1000"
                                value={currentMin} 
                                onChange={(e) => {
                                    if (setMinPrice) {
                                        const val = parseInt(e.target.value);
                                        if (val <= currentMax) setMinPrice(val);
                                    }
                                }}
                            />
                            
                            <input 
                                type="range" 
                                className="neon-slider"
                                min="0" 
                                max={maxLimit} 
                                step="1000"
                                value={currentMax} 
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (val >= currentMin) setMaxPrice(val);
                                }}
                            />
                        </div>
                        
                        <div className="price-labels">
                            <span>₹0</span>
                            <span>₹{maxLimit.toLocaleString()}</span>
                        </div>
                        
                        <div className="price-quick-picks">
                            <button className={`price-pill ${currentMax === 15000 ? 'active' : ''}`} onClick={() => handleQuickPick(0, 15000)}>Under 15K</button>
                            <button className={`price-pill ${currentMax === 25000 ? 'active' : ''}`} onClick={() => handleQuickPick(0, 25000)}>Under 25K</button>
                            <button className={`price-pill ${currentMax === 40000 ? 'active' : ''}`} onClick={() => handleQuickPick(0, 40000)}>Under 40K</button>
                            <button className={`price-pill ${(currentMin >= 40000 && currentMax <= 80000 && currentMax !== maxLimit) ? 'active' : ''}`} onClick={() => handleQuickPick(40000, 80000)}>Premium</button>
                            <button className={`price-pill ${currentMin >= 80000 ? 'active' : ''}`} onClick={() => handleQuickPick(80000, maxLimit)}>Flagship</button>
                        </div>
                        
                        <div className="smart-hints">
                            <ul>
                                {getSmartHints().map((hint, i) => (
                                    <li key={i}>{hint}</li>
                                ))}
                            </ul>
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
