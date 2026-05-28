/**
 * Image Resolver Utility for TechBoy Store
 * Maps phone names/brands dynamically to curated, high-quality Unsplash image URLs
 * to prevent broken image links when local assets are missing.
 */

const IMAGES = {
    iphone_premium: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80", // iPhone 15/16/17 Pro
    iphone_standard: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=80", // iPhone base
    samsung_ultra: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80", // S-Ultra/S-Plus
    samsung_foldable: "https://images.unsplash.com/photo-1678850654160-5a3d7b884c77?w=500&auto=format&fit=crop&q=80", // Fold/Flip
    samsung_mid: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&auto=format&fit=crop&q=80", // A/M Series
    pixel: "https://images.unsplash.com/photo-1614275490022-777e53f191ba?w=500&auto=format&fit=crop&q=80", // Pixel 9/9a
    nothing: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=500&auto=format&fit=crop&q=80", // Nothing Phone
    oneplus: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80", // OnePlus
    gaming: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80", // iQOO / Poco / Asus ROG
    generic_phone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80" // Generic premium smartphone fallback
};

export const resolveProductImage = (imgSrc, name = '') => {
    const n = name.toLowerCase();
    const src = (imgSrc || '').toLowerCase();

    // If it's already a full HTTP url (not pointing to local public/images), return it
    if (imgSrc && (imgSrc.startsWith('http://') || imgSrc.startsWith('https://')) && !imgSrc.includes('127.0.0.1') && !imgSrc.includes('localhost')) {
        return imgSrc;
    }

    // Map by model name keywords
    if (n.includes('iphone')) {
        if (n.includes('pro') || n.includes('max')) {
            return IMAGES.iphone_premium;
        }
        return IMAGES.iphone_standard;
    }

    if (n.includes('galaxy')) {
        if (n.includes('fold') || n.includes('flip')) {
            return IMAGES.samsung_foldable;
        }
        if (n.includes('ultra') || n.includes('s26') || n.includes('s25')) {
            return IMAGES.samsung_ultra;
        }
        return IMAGES.samsung_mid;
    }

    if (n.includes('pixel')) {
        return IMAGES.pixel;
    }

    if (n.includes('nothing')) {
        return IMAGES.nothing;
    }

    if (n.includes('oneplus')) {
        return IMAGES.oneplus;
    }

    if (n.includes('iqoo') || n.includes('poco')) {
        return IMAGES.gaming;
    }

    // Map by image path string keywords
    if (src.includes('apple') || src.includes('iphone')) {
        return IMAGES.iphone_standard;
    }
    if (src.includes('samsung')) {
        if (src.includes('flip') || src.includes('fold')) {
            return IMAGES.samsung_foldable;
        }
        return IMAGES.samsung_mid;
    }
    if (src.includes('pixel')) {
        return IMAGES.pixel;
    }
    if (src.includes('nothing')) {
        return IMAGES.nothing;
    }
    if (src.includes('oneplus')) {
        return IMAGES.oneplus;
    }
    if (src.includes('iqoo') || src.includes('poco')) {
        return IMAGES.gaming;
    }

    return IMAGES.generic_phone;
};
