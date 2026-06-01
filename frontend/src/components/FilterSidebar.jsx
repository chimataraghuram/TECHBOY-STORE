import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
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
                        <h4>Your Budget</h4>
                        
                        <div className="budget-inputs" style={{ display: 'flex', width: '100%' }}>
                            <div className="budget-input-group" style={{ width: '100%' }}>
                                <span className="budget-label" style={{ marginBottom: '8px' }}>Your Target Budget</span>
                                <div className="price-input-wrapper">
                                    <span className="currency-symbol">₹</span>
                                    <input 
                                        type="number"
                                        className="price-glow-input"
                                        placeholder="e.g. 20000"
                                        min="0"
                                        max={maxLimit}
                                        value={currentMax === maxLimit ? '' : currentMax}
                                        onChange={(e) => {
                                            let val = parseInt(e.target.value);
                                            if (isNaN(val) || val <= 0) {
                                                setMaxPrice(maxLimit);
                                            } else {
                                                setMaxPrice(val);
                                            }
                                            if (setMinPrice) setMinPrice(0); // Lock min price to 0
                                        }}
                                        style={{ width: '100%', fontSize: '1.1rem', padding: '12px 12px 12px 32px' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="price-quick-picks" style={{ marginTop: '16px', marginBottom: '8px' }}>
                            <button className={`price-pill ${currentMax === 10000 ? 'active' : ''}`} onClick={() => handleQuickPick(0, 10000)}>10K</button>
                            <button className={`price-pill ${currentMax === 20000 ? 'active' : ''}`} onClick={() => handleQuickPick(0, 20000)}>20K</button>
                            <button className={`price-pill ${currentMax === 30000 ? 'active' : ''}`} onClick={() => handleQuickPick(0, 30000)}>30K</button>
                            <button className={`price-pill ${currentMax === 50000 ? 'active' : ''}`} onClick={() => handleQuickPick(0, 50000)}>50K</button>
                            <button className={`price-pill ${currentMin >= 50000 ? 'active' : ''}`} onClick={() => handleQuickPick(50000, maxLimit)}>Flagships</button>
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
                            <m.div 
                                className="filter-drawer-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                            />

                            {/* Sliding Sidebar Panel */}
                            <m.aside 
                                className="filter-sidebar-drawer glass-card"
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            >
                                {sidebarContent}
                            </m.aside>
                        </>
                    )}
                </AnimatePresence>
            )}
        </>
    );
};

export default FilterSidebar;
