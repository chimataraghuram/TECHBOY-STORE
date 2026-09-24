// Utility for generating and reading shareable smartphone deal links with deep-linking

export const slugifyPhone = (name = '') => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

export const getShareablePhoneUrl = (product) => {
    if (!product) return window.location.origin;
    const slug = slugifyPhone(product.name || `phone-${product.id}`);
    const url = new URL(window.location.origin + window.location.pathname);
    url.hash = `phone=${slug}`;
    return url.toString();
};

export const copyPhoneShareLink = async (product) => {
    const url = getShareablePhoneUrl(product);
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(url);
            return { success: true, url };
        }
    } catch (e) {}

    // Fallback for older browsers
    try {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return { success: true, url };
    } catch (err) {
        return { success: false, url };
    }
};

export const getPhoneSlugFromHash = () => {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash || '';
    const match = hash.match(/phone=([a-z0-9-]+)/i);
    return match ? match[1] : null;
};
