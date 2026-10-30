/**
 * Canvas generator for creating beautiful branded smartphone deal cards
 * that users can download as an image or share directly to social media.
 */

export const generateDealCardImage = async (product, options = {}) => {
    if (!product) return null;

    const width = 1200;
    const height = 630; // standard social landscape (1.91:1) / twitter / whatsapp banner
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Sleek Dark Cyber Background with Tech Gradients
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#060609');
    bgGrad.addColorStop(0.5, '#0b0b14');
    bgGrad.addColorStop(1, '#050508');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle ambient glow circles
    const redGlow = ctx.createRadialGradient(250, 180, 20, 250, 180, 420);
    redGlow.addColorStop(0, 'rgba(255, 13, 45, 0.22)');
    redGlow.addColorStop(1, 'rgba(255, 13, 45, 0)');
    ctx.fillStyle = redGlow;
    ctx.fillRect(0, 0, width, height);

    const blueGlow = ctx.createRadialGradient(980, 480, 30, 980, 480, 380);
    blueGlow.addColorStop(0, 'rgba(59, 130, 246, 0.16)');
    blueGlow.addColorStop(1, 'rgba(59, 130, 246, 0)');
    ctx.fillStyle = blueGlow;
    ctx.fillRect(0, 0, width, height);

    // Subtle grid lines for high-tech look
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 40; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Outer border with neon red accent
    ctx.strokeStyle = 'rgba(255, 20, 50, 0.45)';
    ctx.lineWidth = 3;
    roundRect(ctx, 16, 16, width - 32, height - 32, 28);
    ctx.stroke();

    // 2. Top Header Brand Bar
    // Logo & Brand Name
    ctx.fillStyle = '#ff1a3c';
    roundRect(ctx, 50, 48, 38, 38, 10);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 22px system-ui, -apple-system, sans-serif';
    ctx.fillText('TB', 55, 75);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 24px system-ui, -apple-system, sans-serif';
    ctx.fillText('TECHBOY STORE', 100, 74);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '600 13px system-ui, -apple-system, sans-serif';
    ctx.fillText('VERIFIED SMARTPHONE DEALS', 100, 94);

    // Right Badge: Live Best Price
    ctx.fillStyle = 'rgba(255, 13, 45, 0.18)';
    roundRect(ctx, width - 260, 48, 210, 42, 21);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 13, 45, 0.5)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, width - 260, 48, 210, 42, 21);
    ctx.stroke();

    // Pulsing dot
    ctx.fillStyle = '#ff1f3d';
    ctx.beginPath();
    ctx.arc(width - 240, 69, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff4d6d';
    ctx.font = '800 13px system-ui, -apple-system, sans-serif';
    ctx.fillText('LIVE PRICE TRACK', width - 225, 74);

    // 3. Left Section: Phone Product Image Frame
    const imgBoxX = 55;
    const imgBoxY = 130;
    const imgBoxW = 400;
    const imgBoxH = 440;

    // Image card container backdrop
    ctx.fillStyle = 'rgba(15, 15, 24, 0.85)';
    roundRect(ctx, imgBoxX, imgBoxY, imgBoxW, imgBoxH, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, imgBoxX, imgBoxY, imgBoxW, imgBoxH, 24);
    ctx.stroke();

    // Try loading the phone image onto canvas
    const imgSrc = options.imageSrc || product.image;
    if (imgSrc) {
        try {
            await drawProductImage(ctx, imgSrc, imgBoxX + 25, imgBoxY + 25, imgBoxW - 50, imgBoxH - 50);
        } catch {
            drawFallbackPhoneIcon(ctx, imgBoxX + imgBoxW / 2, imgBoxY + imgBoxH / 2);
        }
    } else {
        drawFallbackPhoneIcon(ctx, imgBoxX + imgBoxW / 2, imgBoxY + imgBoxH / 2);
    }

    // Category / Tag pill on top of image
    if (product.category || product.tag) {
        const tagText = (product.tag ? product.tag.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim() : product.category) || 'Flagship';
        ctx.fillStyle = 'rgba(255, 13, 45, 0.9)';
        roundRect(ctx, imgBoxX + 16, imgBoxY + 16, 170, 32, 16);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 12px system-ui, -apple-system, sans-serif';
        ctx.fillText(tagText.toUpperCase(), imgBoxX + 30, imgBoxY + 37);
    }

    // 4. Right Section: Phone Info & Key Specs
    const infoX = 490;

    // Brand Name
    ctx.fillStyle = 'rgba(255, 100, 120, 0.9)';
    ctx.font = '800 14px system-ui, -apple-system, sans-serif';
    ctx.fillText((product.brand || 'SMARTPHONE').toUpperCase(), infoX, 158);

    // Phone Name (wrapped if long)
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px system-ui, -apple-system, sans-serif';
    const nameLines = wrapText(ctx, product.name || 'Smartphone', 640);
    let curY = 198;
    nameLines.slice(0, 2).forEach(line => {
        ctx.fillText(line, infoX, curY);
        curY += 40;
    });

    // Price Block
    const price = Number(product.price || 0);
    const origPrice = Math.round(price * 1.18); // simulated retail MRP
    const discountPct = Math.round(((origPrice - price) / origPrice) * 100);

    curY += 8;
    ctx.fillStyle = '#ff2a4a';
    ctx.font = '900 46px system-ui, -apple-system, sans-serif';
    const priceStr = `₹${price.toLocaleString('en-IN')}`;
    ctx.fillText(priceStr, infoX, curY);

    const priceWidth = ctx.measureText(priceStr).width;

    // MRP Strikethrough
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '700 24px system-ui, -apple-system, sans-serif';
    const mrpStr = `₹${origPrice.toLocaleString('en-IN')}`;
    ctx.fillText(mrpStr, infoX + priceWidth + 18, curY - 5);

    // Strikethrough line
    const mrpWidth = ctx.measureText(mrpStr).width;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(infoX + priceWidth + 16, curY - 13);
    ctx.lineTo(infoX + priceWidth + 18 + mrpWidth, curY - 13);
    ctx.stroke();

    // Discount Pill
    if (discountPct > 0) {
        const discX = infoX + priceWidth + mrpWidth + 36;
        ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
        roundRect(ctx, discX, curY - 32, 85, 30, 8);
        ctx.fill();
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
        ctx.lineWidth = 1;
        roundRect(ctx, discX, curY - 32, 85, 30, 8);
        ctx.stroke();

        ctx.fillStyle = '#4ade80';
        ctx.font = '800 13px system-ui, -apple-system, sans-serif';
        ctx.fillText(`${discountPct}% OFF`, discX + 13, curY - 12);
    }

    // 5. Spec Highlights Grid (4 Pills)
    const specs = parseDescriptionSpecs(product.description, product.specs);
    const specItems = [
        { label: 'PROCESSOR', val: specs.chip || 'Flagship' },
        { label: 'DISPLAY', val: specs.display || '120Hz AMOLED' },
        { label: 'CAMERA', val: specs.camera || 'AI Pro' },
        { label: 'BATTERY', val: specs.battery || '5000mAh' },
    ];

    curY += 36;
    const gridCols = 2;
    const colW = 310;
    const rowH = 68;

    specItems.forEach((item, i) => {
        const col = i % gridCols;
        const row = Math.floor(i / gridCols);
        const bx = infoX + col * (colW + 18);
        const by = curY + row * (rowH + 12);

        // Card bg
        ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
        roundRect(ctx, bx, by, colW, rowH, 14);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        roundRect(ctx, bx, by, colW, rowH, 14);
        ctx.stroke();

        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = '700 11px system-ui, -apple-system, sans-serif';
        ctx.fillText(item.label, bx + 16, by + 25);

        // Value (truncated if too long)
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 15px system-ui, -apple-system, sans-serif';
        const truncatedVal = truncateString(item.val, 26);
        ctx.fillText(truncatedVal, bx + 16, by + 49);
    });

    // 6. Bottom Call to Action Bar
    const footerY = height - 70;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '600 14px system-ui, -apple-system, sans-serif';
    ctx.fillText('🔗 Compare & track price at techboy-store.vercel.app', infoX, footerY + 18);

    // Amazon & Flipkart Availability tags
    ctx.fillStyle = 'rgba(255, 153, 0, 0.2)';
    roundRect(ctx, width - 260, footerY - 2, 95, 28, 8);
    ctx.fill();
    ctx.fillStyle = '#ff9900';
    ctx.font = '800 11px system-ui, -apple-system, sans-serif';
    ctx.fillText('AMAZON', width - 245, footerY + 16);

    ctx.fillStyle = 'rgba(40, 116, 240, 0.2)';
    roundRect(ctx, width - 150, footerY - 2, 95, 28, 8);
    ctx.fill();
    ctx.fillStyle = '#2874f0';
    ctx.font = '800 11px system-ui, -apple-system, sans-serif';
    ctx.fillText('FLIPKART', width - 138, footerY + 16);

    return canvas;
};

// Helper: Download generated canvas as a PNG
export const downloadDealCard = async (product) => {
    const canvas = await generateDealCardImage(product);
    if (!canvas) return;
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (product.name || 'phone-deal').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.href = url;
    a.download = `techboy-deal-${safeName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Helper: Web Share API with image file if supported, fallback to share URL
export const shareDealImage = async (product, shareUrl) => {
    try {
        const canvas = await generateDealCardImage(product);
        if (canvas && navigator.canShare) {
            const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
            if (blob) {
                const safeName = (product.name || 'deal').toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const file = new File([blob], `techboy-${safeName}.png`, { type: 'image/png' });
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: `${product.name} - ₹${Number(product.price || 0).toLocaleString('en-IN')}`,
                        text: `Check out this deal on ${product.name} at ₹${Number(product.price || 0).toLocaleString('en-IN')} on TechBoy Store!`,
                        url: shareUrl,
                        files: [file]
                    });
                    return { success: true, method: 'files' };
                }
            }
        }

        // Native share with text + link
        if (navigator.share) {
            await navigator.share({
                title: `${product.name} - ₹${Number(product.price || 0).toLocaleString('en-IN')}`,
                text: `🔥 Hot Deal: ${product.name} at ₹${Number(product.price || 0).toLocaleString('en-IN')}!\nCompare specs and track price on TechBoy Store:\n`,
                url: shareUrl
            });
            return { success: true, method: 'native' };
        }
    } catch (e) {
        if (e.name !== 'AbortError') {
            console.error('Share error:', e);
        }
    }
    return { success: false };
};

// Helper: Social share URL generators
export const getSocialShareLinks = (product, shareUrl) => {
    const priceStr = `₹${Number(product?.price || 0).toLocaleString('en-IN')}`;
    const title = `${product?.name || 'Smartphone'} at ${priceStr}`;
    const text = `🔥 Check out this verified deal on ${title} with full specs and live price tracking on TechBoy Store!`;

    return {
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}&hashtags=TechBoyStore,SmartphoneDeals,TechDeals`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };
};

/* Internal canvas drawing utilities */

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function truncateString(str = '', maxLen = 30) {
    if (str.length <= maxLen) return str;
    return str.substring(0, maxLen - 3) + '...';
}

function parseDescriptionSpecs(description = '', rawSpecs = {}) {
    const res = {
        chip: rawSpecs?.Processor || '',
        display: rawSpecs?.Display || '',
        camera: rawSpecs?.['Rear Camera'] || rawSpecs?.Camera || '',
        battery: rawSpecs?.Battery || '',
    };

    if ((!res.chip || !res.display) && description) {
        const parts = description.split('|');
        parts.forEach(part => {
            const [k, v] = part.split(':').map(s => s && s.trim());
            if (k && v) {
                const kl = k.toLowerCase();
                if (!res.chip && (kl.includes('chip') || kl.includes('processor'))) res.chip = v;
                if (!res.display && (kl.includes('display') || kl.includes('screen'))) res.display = v;
                if (!res.camera && kl.includes('camera')) res.camera = v;
                if (!res.battery && kl.includes('battery')) res.battery = v;
            }
        });
    }

    return res;
}

function drawProductImage(ctx, src, x, y, maxW, maxH) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            // Keep aspect ratio
            const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
            const w = img.naturalWidth * scale;
            const h = img.naturalHeight * scale;
            const px = x + (maxW - w) / 2;
            const py = y + (maxH - h) / 2;

            // Soft shadow under phone
            ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
            ctx.shadowBlur = 24;
            ctx.shadowOffsetY = 12;

            ctx.drawImage(img, px, py, w, h);

            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;
            resolve();
        };
        img.onerror = reject;
        img.src = src;
    });
}

function drawFallbackPhoneIcon(ctx, cx, cy) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    roundRect(ctx, cx - 60, cy - 100, 120, 200, 18);
    ctx.stroke();

    ctx.fillStyle = '#ff2a4a';
    ctx.font = '800 14px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TECHBOY DEAL', cx, cy);
    ctx.textAlign = 'start';
}
