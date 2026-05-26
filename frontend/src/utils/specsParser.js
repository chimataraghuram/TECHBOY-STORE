/**
 * Specs Parser Utility for TechBoy Store
 * Extracts structured parameters from raw phone descriptions and calculates scores.
 */

export const parseSpecs = (description = '') => {
    const specs = {
        chip: '—',
        display: '—',
        camera: '—',
        battery: '—',
        charging: '—',
        ram: '—',
        storage: '—'
    };

    if (!description) return specs;

    const parts = description.split('|');
    parts.forEach(part => {
        const colonIndex = part.indexOf(':');
        if (colonIndex !== -1) {
            const key = part.substring(0, colonIndex).trim().toLowerCase();
            const val = part.substring(colonIndex + 1).trim();
            
            if (key.includes('chip') || key.includes('processor')) {
                specs.chip = val;
            } else if (key.includes('display') || key.includes('screen')) {
                specs.display = val;
            } else if (key.includes('camera')) {
                specs.camera = val;
            } else if (key.includes('battery')) {
                specs.battery = val;
            } else if (key.includes('charging')) {
                specs.charging = val;
            } else if (key.includes('ram')) {
                specs.ram = val;
            } else if (key.includes('storage')) {
                specs.storage = val;
            }
        } else {
            const trimmed = part.trim();
            if (/^\d+mAh/i.test(trimmed)) {
                specs.battery = trimmed;
            } else if (/\d+Hz/i.test(trimmed)) {
                specs.display = trimmed;
            } else if (/ram/i.test(trimmed)) {
                specs.ram = trimmed;
            }
        }
    });

    // Extract charging speed from battery string if it contains it (e.g. "5000mAh 44W")
    if (specs.battery !== '—' && specs.charging === '—') {
        const wattMatch = specs.battery.match(/(\d+W)/i);
        if (wattMatch) {
            specs.charging = wattMatch[1];
            specs.battery = specs.battery.replace(/\s*\d+W/i, '').trim();
        }
    }

    return specs;
};

/**
 * Calculates a dynamic Value Score (1.0 to 10.0) based on phone price and specifications.
 */
export const calculateValueScore = (phone) => {
    if (!phone) return '0.0';
    const price = phone.price || 0;
    const desc = (phone.description || '').toLowerCase();
    const tag = (phone.tag || '').toLowerCase();

    // 1. Performance Rating (1 - 10)
    let perf = 5.0;
    if (desc.includes('snapdragon 8') || desc.includes('apple a18') || desc.includes('apple a17') || desc.includes('dimensity 9300') || desc.includes('dimensity 9400')) {
        perf = 9.8;
    } else if (desc.includes('apple a16') || desc.includes('apple a15') || desc.includes('snapdragon 8 gen 1') || desc.includes('dimensity 9200') || desc.includes('dimensity 9000')) {
        perf = 9.0;
    } else if (desc.includes('snapdragon 7') || desc.includes('dimensity 8200') || desc.includes('dimensity 8100') || desc.includes('dimensity 7300')) {
        perf = 8.2;
    } else if (desc.includes('snapdragon 6') || desc.includes('dimensity 7000') || desc.includes('helio g99')) {
        perf = 7.0;
    } else if (desc.includes('helio g91') || desc.includes('helio g88') || desc.includes('helio g85')) {
        perf = 5.5;
    } else {
        // Fallback based on price tiers
        if (price > 80000) perf = 9.8;
        else if (price > 50000) perf = 9.0;
        else if (price > 25000) perf = 7.8;
        else if (price > 12000) perf = 6.8;
        else perf = 5.5;
    }

    if (tag.includes('gaming')) perf += 0.5;

    // 2. Camera Rating (1 - 10)
    let camera = 5.0;
    if (tag.includes('camera') || tag.includes('beast')) {
        camera = 9.2;
    } else {
        if (price > 80000) camera = 9.6;
        else if (price > 50000) camera = 8.8;
        else if (price > 25000) camera = 7.8;
        else if (price > 12000) camera = 6.8;
        else camera = 5.8;
    }

    if (desc.includes('ois')) camera += 0.5;
    if (desc.includes('telephoto') || desc.includes('optical zoom') || desc.includes('periscope')) camera += 0.8;
    if (desc.includes('hasselblad') || desc.includes('zeiss') || desc.includes('leica')) camera += 0.6;
    camera = Math.min(10.0, camera);

    // 3. Battery & Charging Rating (1 - 10)
    let battery = 6.0;
    const mahMatch = desc.match(/(\d+)mah/);
    if (mahMatch) {
        const mah = parseInt(mahMatch[1]);
        if (mah >= 6000) battery = 9.6;
        else if (mah >= 5500) battery = 9.0;
        else if (mah >= 5000) battery = 8.4;
        else if (mah >= 4500) battery = 7.6;
        else battery = 7.0;
    } else {
        if (price > 50000) battery = 8.0;
        else battery = 8.4; // lower capacity in flagships sometimes, budget has big batteries
    }

    // Charging speed bonus
    const wattMatch = desc.match(/(\d+)w/);
    if (wattMatch) {
        const watt = parseInt(wattMatch[1]);
        if (watt >= 100) battery += 0.8;
        else if (watt >= 67) battery += 0.5;
        else if (watt >= 33) battery += 0.2;
    }
    battery = Math.min(10.0, battery);

    // 4. Display Rating (1 - 10)
    let display = 6.0;
    if (desc.includes('amoled') || desc.includes('oled')) {
        display = 8.5;
    } else {
        display = 7.0;
    }
    if (desc.includes('120hz') || desc.includes('144hz') || desc.includes('promotion')) {
        display += 1.0;
    }
    display = Math.min(10.0, display);

    // Dynamic Value Score math:
    // A budget phone (e.g. 15K) with 7.5 average specs gets a high score (9.4).
    // A premium flagship (e.g. 120K) with 9.8 average specs gets a solid score (8.9) but lower value-for-money.
    const avgSpecs = (perf + camera + battery + display) / 4;
    
    let priceFactor = 1.0;
    if (price < 15000) {
        priceFactor = 1.35; // high value multiplier for budget
    } else if (price < 30000) {
        priceFactor = 1.25;
    } else if (price < 50000) {
        priceFactor = 1.12;
    } else if (price < 85000) {
        priceFactor = 0.98;
    } else {
        priceFactor = 0.88; // flagships have premium overhead
    }

    let valScore = avgSpecs * priceFactor;
    
    // Normalize value score to be strictly between 6.5 and 9.8
    valScore = Math.min(9.8, Math.max(6.5, valScore));
    
    return valScore.toFixed(1);
};
