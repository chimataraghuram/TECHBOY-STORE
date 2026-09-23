/**
 * Image Resolver Utility for TechBoy Store
 * Resolves phone images to authentic local product cutouts in /images/phones/
 */

const LOCAL_PHONE_MAP = {
    'tecno-spark-30c': '/images/phones/tecno-spark-30c.png',
    'redmi-13c-5g': '/images/phones/redmi-13c-5g.png',
    'samsung-galaxy-m07': '/images/phones/samsung-galaxy-m07.png',
    'realme-c75': '/images/phones/realme-c75.png',
    'infinix-hot-50i': '/images/phones/infinix-hot-50i.png',
    'iqoo-z9-5g': '/images/phones/iqoo-z9-5g.png',
    'redmi-note-14-5g': '/images/phones/redmi-note-14-5g.png',
    'samsung-galaxy-a26-5g': '/images/phones/samsung-galaxy-a26-5g.png',
    'nothing-phone-3a': '/images/phones/nothing-phone-3a.png',
    'nothing-phone-3a-pro': '/images/phones/nothing-phone-3a-pro.png',
    'oneplus-nord-ce5': '/images/phones/oneplus-nord-ce5.png',
    'vivo-t5x-5g': '/images/phones/vivo-t5x-5g.png',
    'poco-x8-pro-max': '/images/phones/poco-x8-pro-max.png',
    'samsung-galaxy-a37-5g': '/images/phones/samsung-galaxy-a37-5g.png',
    'realme-gt7t': '/images/phones/realme-gt7t.png',
    'iqoo-neo-10r': '/images/phones/iqoo-neo-10r.png',
    'oneplus-nord-6': '/images/phones/oneplus-nord-6.png',
    'vivo-v70-fe': '/images/phones/vivo-v70-fe.png',
    'google-pixel-9a': '/images/phones/google-pixel-9a.png',
    'samsung-galaxy-a57-5g': '/images/phones/samsung-galaxy-a57-5g.png',
    'poco-f7-5g': '/images/phones/poco-f7-5g.png',
    'oneplus-13r': '/images/phones/oneplus-13r.png',
    'vivo-v70': '/images/phones/vivo-v70.png',
    'iqoo-13-5g': '/images/phones/iqoo-13-5g.png',
    'samsung-galaxy-s25': '/images/phones/samsung-galaxy-s25.png',
    'apple-iphone-15': '/images/phones/apple-iphone-15.png',
    'google-pixel-9-pro': '/images/phones/google-pixel-9-pro.png',
    'realme-gt7-pro': '/images/phones/realme-gt7-pro.png',
    'oneplus-13': '/images/phones/oneplus-13.png',
    'apple-iphone-16': '/images/phones/apple-iphone-16.png',
    'samsung-galaxy-s26': '/images/phones/samsung-galaxy-s26.png',
    'samsung-galaxy-s26-plus': '/images/phones/samsung-galaxy-s26-plus.png',
    'samsung-galaxy-s26-ultra': '/images/phones/samsung-galaxy-s26-ultra.png',
    'apple-iphone-16-pro-max': '/images/phones/apple-iphone-16-pro-max.png',
    'apple-iphone-15-pro-max': '/images/phones/apple-iphone-15-pro-max.png',
    'samsung-galaxy-z-flip-7': '/images/phones/samsung-galaxy-z-flip-7.png',
    'samsung-galaxy-z-fold-7': '/images/phones/samsung-galaxy-z-fold-7.png',
    'apple-iphone-17': '/images/phones/apple-iphone-17.png',
    'apple-iphone-17-pro': '/images/phones/apple-iphone-17-pro.png',
    'apple-iphone-17-pro-max': '/images/phones/apple-iphone-17-pro-max.png'
};

const DEFAULT_FALLBACK = '/images/phones/apple-iphone-16-pro-max.png';

export const resolveProductImage = (imgSrc, name = '') => {
    // 1. If it's already a local path starting with /images/phones, normalize to .png
    if (imgSrc && imgSrc.startsWith('/images/phones/')) {
        return imgSrc.replace(/\.(jpg|jpeg|webp)$/i, '.png');
    }

    // 2. Try to match by normalized product name
    const n = (name || '').toLowerCase().trim();
    if (n) {
        const slug = n.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // Exact slug match
        if (LOCAL_PHONE_MAP[slug]) {
            return LOCAL_PHONE_MAP[slug];
        }

        // Partial match
        for (const [key, path] of Object.entries(LOCAL_PHONE_MAP)) {
            if (slug.includes(key) || key.includes(slug)) {
                return path;
            }
        }

        // Brand-specific intelligent fallback
        if (n.includes('iphone 17') || n.includes('iphone 16') || n.includes('iphone 15') || n.includes('iphone')) {
            if (n.includes('pro') || n.includes('max')) return '/images/phones/apple-iphone-16-pro-max.png';
            return '/images/phones/apple-iphone-16.png';
        }
        if (n.includes('galaxy') || n.includes('samsung')) {
            if (n.includes('ultra') || n.includes('s26')) return '/images/phones/samsung-galaxy-s26-ultra.png';
            if (n.includes('flip') || n.includes('fold')) return '/images/phones/samsung-galaxy-z-fold-7.png';
            if (n.includes('m07')) return '/images/phones/samsung-galaxy-m07.png';
            return '/images/phones/samsung-galaxy-a26-5g.png';
        }
        if (n.includes('pixel')) {
            if (n.includes('pro')) return '/images/phones/google-pixel-9-pro.png';
            return '/images/phones/google-pixel-9a.png';
        }
        if (n.includes('oneplus')) {
            if (n.includes('13r')) return '/images/phones/oneplus-13r.png';
            if (n.includes('13')) return '/images/phones/oneplus-13.png';
            return '/images/phones/oneplus-nord-6.png';
        }
        if (n.includes('nothing')) {
            return '/images/phones/nothing-phone-3a.png';
        }
        if (n.includes('realme')) {
            if (n.includes('gt')) return '/images/phones/realme-gt7-pro.png';
            return '/images/phones/realme-c75.png';
        }
        if (n.includes('redmi') || n.includes('xiaomi')) {
            if (n.includes('note')) return '/images/phones/redmi-note-14-5g.png';
            return '/images/phones/redmi-13c-5g.png';
        }
        if (n.includes('tecno')) {
            return '/images/phones/tecno-spark-30c.png';
        }
        if (n.includes('infinix')) {
            return '/images/phones/infinix-hot-50i.png';
        }
        if (n.includes('iqoo')) {
            if (n.includes('13')) return '/images/phones/iqoo-13-5g.png';
            return '/images/phones/iqoo-z9-5g.png';
        }
        if (n.includes('poco')) {
            if (n.includes('x8')) return '/images/phones/poco-x8-pro-max.png';
            return '/images/phones/poco-f7-5g.png';
        }
        if (n.includes('vivo')) {
            if (n.includes('v70')) return '/images/phones/vivo-v70.png';
            return '/images/phones/vivo-t5x-5g.png';
        }
    }

    // 3. If local path starting with "/", return it
    if (imgSrc && imgSrc.startsWith('/')) {
        return imgSrc;
    }

    // 4. If full external URL and not generic unsplash fallback
    if (imgSrc && (imgSrc.startsWith('http://') || imgSrc.startsWith('https://')) && !imgSrc.includes('photo-1511707171634')) {
        return imgSrc;
    }

    return DEFAULT_FALLBACK;
};
