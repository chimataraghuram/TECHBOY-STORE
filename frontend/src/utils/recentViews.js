// Utility for tracking and loading recently viewed smartphones in localStorage

const RECENTLY_VIEWED_KEY = 'tb_recently_viewed';
const MAX_RECENT_ITEMS = 8;

export const recordRecentView = (product) => {
    if (!product || !product.id) return;
    try {
        const stored = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
        const filtered = stored.filter(item => item.id !== product.id);
        const itemToSave = {
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price || product.current_price,
            original_price: product.original_price,
            image: product.image,
            viewedAt: Date.now()
        };
        const updated = [itemToSave, ...filtered].slice(0, MAX_RECENT_ITEMS);
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('tb_recently_viewed_updated'));
    } catch (e) {
        console.warn('Failed to record recently viewed phone', e);
    }
};

export const getRecentlyViewed = () => {
    try {
        return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
    } catch {
        return [];
    }
};

export const clearRecentlyViewed = () => {
    try {
        localStorage.removeItem(RECENTLY_VIEWED_KEY);
        window.dispatchEvent(new Event('tb_recently_viewed_updated'));
    } catch (e) {}
};
