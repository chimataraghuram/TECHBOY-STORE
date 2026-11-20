import { resolveProductImage } from './imageResolver';

/**
 * High-definition Canvas generator for AI Battle Arena Showdown Cards.
 * Creates an ultra-premium 1200x675 (16:9) graphic comparing two smartphones.
 */

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

function truncateString(str = '', maxLen = 28) {
    if (str.length <= maxLen) return str;
    return str.substring(0, maxLen - 3) + '...';
}

function loadPhoneImage(src) {
    return new Promise((resolve) => {
        if (!src) return resolve(null);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

export const generateBattleCardImage = async (phoneA, phoneB, scoresA, scoresB, verdict) => {
    if (!phoneA || !phoneB) return null;

    const width = 1200;
    const height = 675; // Standard 16:9 social landscape
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Sleek Cyber Dark Background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#06060a');
    bgGrad.addColorStop(0.5, '#0c0c16');
    bgGrad.addColorStop(1, '#050508');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Ambient radial glow behind Challenger A (Red) and Challenger B (Cyan)
    const redGlow = ctx.createRadialGradient(260, 260, 20, 260, 260, 360);
    redGlow.addColorStop(0, 'rgba(239, 68, 68, 0.22)');
    redGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = redGlow;
    ctx.fillRect(0, 0, width, height);

    const cyanGlow = ctx.createRadialGradient(940, 260, 20, 940, 260, 360);
    cyanGlow.addColorStop(0, 'rgba(6, 182, 212, 0.22)');
    cyanGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = cyanGlow;
    ctx.fillRect(0, 0, width, height);

    // High-tech subtle grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
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

    // Outer neon border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    roundRect(ctx, 16, 16, width - 32, height - 32, 26);
    ctx.stroke();

    // 2. Top Header Brand Bar
    // Logo Icon
    ctx.fillStyle = '#ff1a3c';
    roundRect(ctx, 45, 42, 38, 38, 10);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 20px system-ui, -apple-system, sans-serif';
    ctx.fillText('TB', 51, 68);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 22px system-ui, -apple-system, sans-serif';
    ctx.fillText('TECHBOY STORE', 95, 62);

    ctx.fillStyle = '#ff4d6d';
    ctx.font = '800 11px system-ui, -apple-system, sans-serif';
    ctx.fillText('AI BATTLE ARENA SHOWDOWN', 95, 78);

    // Top Right: Engine Badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    roundRect(ctx, width - 260, 42, 215, 36, 18);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    roundRect(ctx, width - 260, 42, 215, 36, 18);
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(width - 242, 60, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '800 11.5px system-ui, -apple-system, sans-serif';
    ctx.fillText('TRAINED v2.4 SPEC ENGINE', width - 228, 64);

    // 3. Load Phone Images in Parallel
    const srcA = resolveProductImage(phoneA?.image, phoneA?.name);
    const srcB = resolveProductImage(phoneB?.image, phoneB?.name);
    const [imgA, imgB] = await Promise.all([loadPhoneImage(srcA), loadPhoneImage(srcB)]);

    const winnerKey = scoresA.overall > scoresB.overall ? 'A' : scoresB.overall > scoresA.overall ? 'B' : 'TIE';

    // 4. Challenger A Card (Left)
    const cardAY = 100;
    const cardAW = 470;
    const cardAH = 310;
    const cardAX = 45;

    ctx.fillStyle = 'rgba(15, 15, 24, 0.75)';
    roundRect(ctx, cardAX, cardAY, cardAW, cardAH, 22);
    ctx.fill();
    ctx.strokeStyle = winnerKey === 'A' ? 'rgba(239, 68, 68, 0.7)' : 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = winnerKey === 'A' ? 2.5 : 1;
    roundRect(ctx, cardAX, cardAY, cardAW, cardAH, 22);
    ctx.stroke();

    // Winner Crown / Badge A
    if (winnerKey === 'A') {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        roundRect(ctx, cardAX + 16, cardAY + 16, 120, 28, 14);
        ctx.fill();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = 1;
        roundRect(ctx, cardAX + 16, cardAY + 16, 120, 28, 14);
        ctx.stroke();
        ctx.fillStyle = '#fca5a5';
        ctx.font = '800 12px system-ui, -apple-system, sans-serif';
        ctx.fillText('👑 WINNER', cardAX + 30, cardAY + 35);
    } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        roundRect(ctx, cardAX + 16, cardAY + 16, 130, 28, 14);
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '800 11.5px system-ui, -apple-system, sans-serif';
        ctx.fillText('CHALLENGER 1', cardAX + 28, cardAY + 35);
    }

    // Phone A Image Stage
    const stageAW = 160;
    const stageAH = 200;
    const stageAX = cardAX + 20;
    const stageAY = cardAY + 55;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    roundRect(ctx, stageAX, stageAY, stageAW, stageAH, 18);
    ctx.fill();

    if (imgA) {
        const scale = Math.min((stageAW - 24) / imgA.naturalWidth, (stageAH - 24) / imgA.naturalHeight);
        const iw = imgA.naturalWidth * scale;
        const ih = imgA.naturalHeight * scale;
        const ipx = stageAX + (stageAW - iw) / 2;
        const ipy = stageAY + (stageAH - ih) / 2;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 18;
        ctx.drawImage(imgA, ipx, ipy, iw, ih);
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }

    // Phone A Details
    const textAX = stageAX + stageAW + 20;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '800 12px system-ui, -apple-system, sans-serif';
    ctx.fillText((phoneA?.brand || 'SMARTPHONE').toUpperCase(), textAX, cardAY + 75);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 20px system-ui, -apple-system, sans-serif';
    ctx.fillText(truncateString(phoneA?.name || '', 18), textAX, cardAY + 105);

    ctx.fillStyle = '#ef4444';
    ctx.font = '900 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(`₹${Number(phoneA?.price || 0).toLocaleString('en-IN')}`, textAX, cardAY + 145);

    // Score Pill A
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    roundRect(ctx, textAX, cardAY + 175, 140, 50, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, textAX, cardAY + 175, 140, 50, 14);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 11px system-ui, -apple-system, sans-serif';
    ctx.fillText('OVERALL SCORE', textAX + 16, cardAY + 196);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 22px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${scoresA.overall}`, textAX + 16, cardAY + 218);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 12px system-ui, -apple-system, sans-serif';
    ctx.fillText('/100', textAX + 58, cardAY + 218);

    // 5. Center VS Badge
    const centerCX = width / 2;
    const centerCY = cardAY + cardAH / 2;

    const vsGrad = ctx.createRadialGradient(centerCX, centerCY, 5, centerCX, centerCY, 42);
    vsGrad.addColorStop(0, '#ef4444');
    vsGrad.addColorStop(0.6, '#dc2626');
    vsGrad.addColorStop(1, '#991b1b');

    ctx.fillStyle = vsGrad;
    ctx.beginPath();
    ctx.arc(centerCX, centerCY, 38, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(centerCX, centerCY, 38, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VS', centerCX, centerCY + 8);
    ctx.textAlign = 'start';

    // 6. Challenger B Card (Right)
    const cardBW = 470;
    const cardBH = 310;
    const cardBX = width - cardBW - 45;
    const cardBY = 100;

    ctx.fillStyle = 'rgba(15, 15, 24, 0.75)';
    roundRect(ctx, cardBX, cardBY, cardBW, cardBH, 22);
    ctx.fill();
    ctx.strokeStyle = winnerKey === 'B' ? 'rgba(6, 182, 212, 0.7)' : 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = winnerKey === 'B' ? 2.5 : 1;
    roundRect(ctx, cardBX, cardBY, cardBW, cardBH, 22);
    ctx.stroke();

    // Winner Crown / Badge B
    if (winnerKey === 'B') {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
        roundRect(ctx, cardBX + 16, cardBY + 16, 120, 28, 14);
        ctx.fill();
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
        ctx.lineWidth = 1;
        roundRect(ctx, cardBX + 16, cardBY + 16, 120, 28, 14);
        ctx.stroke();
        ctx.fillStyle = '#67e8f9';
        ctx.font = '800 12px system-ui, -apple-system, sans-serif';
        ctx.fillText('👑 WINNER', cardBX + 30, cardBY + 35);
    } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        roundRect(ctx, cardBX + 16, cardBY + 16, 130, 28, 14);
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '800 11.5px system-ui, -apple-system, sans-serif';
        ctx.fillText('CHALLENGER 2', cardBX + 28, cardBY + 35);
    }

    // Phone B Image Stage
    const stageBW = 160;
    const stageBH = 200;
    const stageBX = cardBX + 20;
    const stageBY = cardBY + 55;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    roundRect(ctx, stageBX, stageBY, stageBW, stageBH, 18);
    ctx.fill();

    if (imgB) {
        const scale = Math.min((stageBW - 24) / imgB.naturalWidth, (stageBH - 24) / imgB.naturalHeight);
        const iw = imgB.naturalWidth * scale;
        const ih = imgB.naturalHeight * scale;
        const ipx = stageBX + (stageBW - iw) / 2;
        const ipy = stageBY + (stageBH - ih) / 2;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 18;
        ctx.drawImage(imgB, ipx, ipy, iw, ih);
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }

    // Phone B Details
    const textBX = stageBX + stageBW + 20;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '800 12px system-ui, -apple-system, sans-serif';
    ctx.fillText((phoneB?.brand || 'SMARTPHONE').toUpperCase(), textBX, cardBY + 75);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 20px system-ui, -apple-system, sans-serif';
    ctx.fillText(truncateString(phoneB?.name || '', 18), textBX, cardBY + 105);

    ctx.fillStyle = '#06b6d4';
    ctx.font = '900 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(`₹${Number(phoneB?.price || 0).toLocaleString('en-IN')}`, textBX, cardBY + 145);

    // Score Pill B
    ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
    roundRect(ctx, textBX, cardBY + 175, 140, 50, 14);
    ctx.fill();
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, textBX, cardBY + 175, 140, 50, 14);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 11px system-ui, -apple-system, sans-serif';
    ctx.fillText('OVERALL SCORE', textBX + 16, cardBY + 196);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 22px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${scoresB.overall}`, textBX + 16, cardBY + 218);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 12px system-ui, -apple-system, sans-serif';
    ctx.fillText('/100', textBX + 58, cardBY + 218);

    // 7. Bottom Section: 5 Comparison Stat Bars & Verdict
    const bottomY = 430;
    const bottomH = 205;
    ctx.fillStyle = 'rgba(10, 10, 18, 0.9)';
    roundRect(ctx, 45, bottomY, width - 90, bottomH, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    roundRect(ctx, 45, bottomY, width - 90, bottomH, 20);
    ctx.stroke();

    // Verdict Headline
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 16px system-ui, -apple-system, sans-serif';
    ctx.fillText(verdict?.headline || 'Flagship Benchmark Showdown', 70, bottomY + 36);

    // 5 Categories Comparison Bars
    const catList = [
        { label: 'Gaming & Chip', a: scoresA.perf, b: scoresB.perf },
        { label: 'Camera Optics', a: scoresA.cam, b: scoresB.cam },
        { label: 'Battery Life', a: scoresA.bat, b: scoresB.bat },
        { label: 'Display & Hz', a: scoresA.disp, b: scoresB.disp },
        { label: 'Value / MRP', a: scoresA.val, b: scoresB.val }
    ];

    const barStartY = bottomY + 58;
    const barSpacing = 24;

    catList.forEach((cat, idx) => {
        const curY = barStartY + idx * barSpacing;

        // Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 11.5px system-ui, -apple-system, sans-serif';
        ctx.fillText(cat.label, 70, curY + 10);

        // Bar Track
        const trackX = 220;
        const trackW = 700;
        const trackH = 10;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        roundRect(ctx, trackX, curY + 2, trackW, trackH, 5);
        ctx.fill();

        // Left Fill (A) - Red
        const halfW = trackW / 2;
        const fillAW = (cat.a / 100) * halfW;
        ctx.fillStyle = '#ef4444';
        roundRect(ctx, trackX + halfW - fillAW, curY + 2, fillAW, trackH, 5);
        ctx.fill();

        // Right Fill (B) - Cyan
        const fillBW = (cat.b / 100) * halfW;
        ctx.fillStyle = '#06b6d4';
        roundRect(ctx, trackX + halfW, curY + 2, fillBW, trackH, 5);
        ctx.fill();

        // Value numbers
        ctx.font = '800 11.5px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.textAlign = 'right';
        ctx.fillText(`${cat.a}`, trackX - 10, curY + 11);

        ctx.fillStyle = '#06b6d4';
        ctx.textAlign = 'left';
        ctx.fillText(`${cat.b}`, trackX + trackW + 10, curY + 11);
        ctx.textAlign = 'start';
    });

    // 8. Footer Watermark & Deep Link
    ctx.fillStyle = '#64748b';
    ctx.font = '700 12px system-ui, -apple-system, sans-serif';
    ctx.fillText('techboy-store.vercel.app', width - 260, bottomY + bottomH - 24);

    return canvas;
};

export const downloadBattleCard = async (phoneA, phoneB, scoresA, scoresB, verdict) => {
    const canvas = await generateBattleCardImage(phoneA, phoneB, scoresA, scoresB, verdict);
    if (!canvas) return;

    const slugA = (phoneA?.name || 'phone-a').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const slugB = (phoneB?.name || 'phone-b').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filename = `techboy-battle-${slugA}-vs-${slugB}.png`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const shareBattleImage = async (phoneA, phoneB, scoresA, scoresB, verdict, shareUrl) => {
    const canvas = await generateBattleCardImage(phoneA, phoneB, scoresA, scoresB, verdict);
    if (!canvas) return;

    const slugA = (phoneA?.name || 'phone-a').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const slugB = (phoneB?.name || 'phone-b').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filename = `techboy-battle-${slugA}-vs-${slugB}.png`;

    return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
            if (!blob) return resolve(false);
            const file = new File([blob], filename, { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: `${phoneA.name} vs ${phoneB.name} - AI Battle Arena`,
                        text: `${verdict?.headline || 'Smartphone Showdown'} on TechBoy Store!`,
                        url: shareUrl || window.location.href,
                        files: [file]
                    });
                    resolve(true);
                } catch {
                    resolve(false);
                }
            } else {
                // Fallback to direct download
                downloadBattleCard(phoneA, phoneB, scoresA, scoresB, verdict);
                resolve(true);
            }
        }, 'image/png');
    });
};

export const getBattleSocialShareLinks = (phoneA, phoneB, verdict, shareUrl) => {
    const title = `${phoneA?.name} vs ${phoneB?.name} Showdown`;
    const summary = `${verdict?.headline || 'Smartphone Battle Showdown'} on TechBoy Store: ${shareUrl}`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(`${title} — ${verdict?.headline || 'Who wins?'}\n${shareUrl}`);

    return {
        whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(title)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    };
};
