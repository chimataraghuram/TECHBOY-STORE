import {
    Cpu, Camera, Battery, Smartphone, HardDrive, Info,
    ShieldCheck, Layers, Wifi, Palette,
} from 'lucide-react';

// Themed, ordered groups matching the high-tech UI reference.
export const SPEC_GROUPS = [
    { 
        title: 'PERFORMANCE', 
        icon: Cpu, 
        iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
        keys: ['Processor', 'GPU'] 
    },
    { 
        title: 'DISPLAY', 
        icon: Smartphone, 
        iconBg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        keys: ['Display', 'Screen', 'Resolution', 'Refresh Rate'] 
    },
    { 
        title: 'CAMERA', 
        icon: Camera, 
        iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        keys: ['Rear Camera', 'Camera', 'Selfie Camera', 'Video'] 
    },
    { 
        title: 'BATTERY & CHARGING', 
        icon: Battery, 
        iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        keys: ['Battery', 'Charging', 'Charger'] 
    },
    { 
        title: 'MEMORY', 
        icon: HardDrive, 
        iconBg: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
        keys: ['RAM', 'Storage', 'ROM'] 
    },
    { 
        title: 'SOFTWARE', 
        icon: ShieldCheck, 
        iconBg: 'bg-red-500/10 text-red-400 border border-red-500/20',
        keys: ['Operating System', 'OS', 'Software Updates', 'UI'] 
    },
    { 
        title: 'DESIGN & DURABILITY', 
        icon: Layers, 
        iconBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
        keys: ['Build', 'Weight', 'Dimensions', 'Water Resistance'] 
    },
    { 
        title: 'CONNECTIVITY', 
        icon: Wifi, 
        iconBg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
        keys: ['Connectivity', 'Network', '5G', 'Bluetooth', 'NFC'] 
    },
    { 
        title: 'COLOURS', 
        icon: Palette, 
        iconBg: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
        keys: ['Colors', 'Colours'] 
    },
];

export const iconForLabel = (label = '') => {
    const l = label.toLowerCase();
    if (l.includes('process') || l.includes('chip') || l.includes('gpu')) return Cpu;
    if (l.includes('camera')) return Camera;
    if (l.includes('battery') || l.includes('charging')) return Battery;
    if (l.includes('display') || l.includes('screen')) return Smartphone;
    if (l.includes('memory') || l.includes('ram') || l.includes('storage')) return HardDrive;
    if (l.includes('software') || l.includes('operating') || l.includes('os')) return ShieldCheck;
    if (l.includes('build') || l.includes('weight') || l.includes('design')) return Layers;
    if (l.includes('connect') || l.includes('wifi') || l.includes('network')) return Wifi;
    if (l.includes('color') || l.includes('colour')) return Palette;
    return Info;
};

// Normalise product specs into a clean key-value map
export const buildSpecMap = (product) => {
    if (product?.specs && typeof product.specs === 'object' && Object.keys(product.specs).length > 0) {
        return product.specs;
    }
    const map = {};
    if (!product?.description) return map;
    product.description
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((spec) => {
            const idx = spec.indexOf(':');
            if (idx > 0) { 
                map[spec.slice(0, idx).trim()] = spec.slice(idx + 1).trim(); 
                return; 
            }
            const lower = spec.toLowerCase();
            let label = 'Feature';
            if (/(snapdragon|dimensity|bionic|exynos|tensor|chip|a19|a18)/.test(lower)) label = 'Processor';
            else if (/(mp|camera)/.test(lower)) label = 'Rear Camera';
            else if (/(mah|battery)/.test(lower)) label = 'Battery';
            else if (/(hz|amoled|oled|lcd|display|retina)/.test(lower)) label = 'Display';
            else if (/(gb|ram|rom|storage)/.test(lower)) label = 'Memory';
            else if (/(charging| w )/.test(lower)) label = 'Charging';
            map[label] = spec;
        });
    return map;
};

// Group the specs into structured themed cards for the full spec sheet
export const buildSpecGroups = (product) => {
    const entries = Object.entries(buildSpecMap(product));
    const used = new Set();
    const groups = SPEC_GROUPS.map((group) => {
        const rows = [];
        group.keys.forEach((key) => {
            const found = entries.find(([k]) => k.toLowerCase() === key.toLowerCase() && !used.has(k));
            if (found) {
                used.add(found[0]);
                rows.push({ label: key, value: String(found[1]) });
            }
        });
        return { ...group, rows };
    }).filter((group) => group.rows.length);

    const remaining = entries.filter(([k]) => !used.has(k));
    if (remaining.length) {
        groups.push({ 
            title: 'ADDITIONAL INFO', 
            icon: Info, 
            iconBg: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
            rows: remaining.map(([k, v]) => ({ label: k, value: String(v) })) 
        });
    }
    return groups;
};

// Build the 6 prominent structured spec cards seen in the reference
export const buildSixGridHighlights = (product) => {
    const map = buildSpecMap(product);
    
    // 1. Processor
    const proc = map['Processor'] || map['Chip'] || 'Flagship Processor';
    
    // 2. Display
    const disp = map['Display'] || '6.7" 120Hz OLED Display';
    
    // 3. Camera
    const cam = map['Rear Camera'] || map['Camera'] || '50MP OIS Triple Camera';
    
    // 4. Battery & Charging
    const bat = map['Battery'] || '5000mAh';
    const charging = map['Charging'] || '';
    
    // 5. Memory: RAM & Storage
    const ram = map['RAM'] || '8GB';
    const storage = map['Storage'] || '256GB';
    
    // 6. Connectivity
    const conn = map['Connectivity'] || '5G · Wi-Fi 7 · Bluetooth 5.4 · NFC';

    return {
        processor: { label: 'PROCESSOR', value: proc },
        display: { label: 'DISPLAY', value: disp },
        camera: { label: 'REAR CAMERA', value: cam },
        battery: { label: 'BATTERY', value: bat, extra: charging },
        memory: { label: 'MEMORY', ram, storage },
        connectivity: { label: 'CONNECTIVITY', value: conn }
    };
};

export const buildHighlights = (product, limit = 4) => {
    const entries = Object.entries(buildSpecMap(product));
    const KEY_HIGHLIGHTS = ['Processor', 'Display', 'Rear Camera', 'Camera', 'Battery'];
    return KEY_HIGHLIGHTS
        .map((key) => {
            const found = entries.find(([k]) => k.toLowerCase() === key.toLowerCase());
            return found ? { label: key === 'Camera' ? 'Rear Camera' : key, value: String(found[1]) } : null;
        })
        .filter(Boolean)
        .slice(0, limit);
};
