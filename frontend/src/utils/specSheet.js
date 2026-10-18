import {
    Cpu, Camera, Battery, Smartphone, HardDrive, Info,
    ShieldCheck, Layers, Wifi, Palette,
} from 'lucide-react';

// Themed, ordered groups used to render the modern full-spec sheet.
export const SPEC_GROUPS = [
    { title: 'Performance', icon: Cpu, keys: ['Processor', 'GPU'] },
    { title: 'Display', icon: Smartphone, keys: ['Display'] },
    { title: 'Camera', icon: Camera, keys: ['Rear Camera', 'Camera', 'Selfie Camera', 'Video'] },
    { title: 'Battery & Charging', icon: Battery, keys: ['Battery', 'Charging'] },
    { title: 'Memory', icon: HardDrive, keys: ['RAM', 'Storage'] },
    { title: 'Software', icon: ShieldCheck, keys: ['Operating System', 'Software Updates'] },
    { title: 'Design & Durability', icon: Layers, keys: ['Build', 'Weight'] },
    { title: 'Connectivity', icon: Wifi, keys: ['Connectivity', 'Network'] },
    { title: 'Colours', icon: Palette, keys: ['Colors', 'Colours'] },
];

const KEY_HIGHLIGHTS = ['Processor', 'Display', 'Rear Camera', 'Camera', 'Battery'];

export const iconForLabel = (label = '') => {
    const l = label.toLowerCase();
    if (l.includes('process') || l.includes('chip') || l.includes('gpu')) return Cpu;
    if (l.includes('camera')) return Camera;
    if (l.includes('battery') || l.includes('charging')) return Battery;
    if (l.includes('display')) return Smartphone;
    if (l.includes('memory') || l.includes('ram') || l.includes('storage')) return HardDrive;
    if (l.includes('software') || l.includes('operating')) return ShieldCheck;
    if (l.includes('build') || l.includes('weight')) return Layers;
    if (l.includes('connect')) return Wifi;
    if (l.includes('color') || l.includes('colour')) return Palette;
    return Info;
};

// Normalise a product into a label -> value spec map, falling back to parsing
// the pipe-separated description when structured specs are unavailable.
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
            if (idx > 0) { map[spec.slice(0, idx).trim()] = spec.slice(idx + 1).trim(); return; }
            const lower = spec.toLowerCase();
            let label = 'Feature';
            if (/(snapdragon|dimensity|bionic|exynos|tensor|chip)/.test(lower)) label = 'Processor';
            else if (/(mp|camera)/.test(lower)) label = 'Rear Camera';
            else if (/(mah|battery)/.test(lower)) label = 'Battery';
            else if (/(hz|amoled|oled|lcd|display)/.test(lower)) label = 'Display';
            else if (/(gb|ram|rom|storage)/.test(lower)) label = 'Memory';
            else if (/(charging| w )/.test(lower)) label = 'Charging';
            map[label] = spec;
        });
    return map;
};

// Group the full spec map into ordered, themed sections for the modern sheet.
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
        groups.push({ title: 'More', icon: Info, rows: remaining.map(([k, v]) => ({ label: k, value: String(v) })) });
    }
    return groups;
};

// Four headline specs surfaced next to price/hero content.
export const buildHighlights = (product, limit = 4) => {
    const entries = Object.entries(buildSpecMap(product));
    return KEY_HIGHLIGHTS
        .map((key) => {
            const found = entries.find(([k]) => k.toLowerCase() === key.toLowerCase());
            return found ? { label: key === 'Camera' ? 'Rear Camera' : key, value: String(found[1]) } : null;
        })
        .filter(Boolean)
        .slice(0, limit);
};
