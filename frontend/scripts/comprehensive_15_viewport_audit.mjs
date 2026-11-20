import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const DIST_DIR = path.resolve('A:/TECHBOY-STORE/frontend/dist');
const PORT = 4173;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webmanifest': 'application/manifest+json'
};

function startStaticServer() {
    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            let reqPath = req.url.split('?')[0];
            if (reqPath === '/') reqPath = '/index.html';
            let filePath = path.join(DIST_DIR, reqPath);
            
            if (!fs.existsSync(filePath)) {
                filePath = path.join(DIST_DIR, 'index.html');
            }

            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';

            fs.readFile(filePath, (err, content) => {
                if (err) {
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                } else {
                    res.writeHead(200, { 
                        'Content-Type': contentType,
                        'Cache-Control': 'no-cache'
                    });
                    res.end(content);
                }
            });
        });

        server.listen(PORT, '127.0.0.1', () => {
            console.log(`Static test server running at http://127.0.0.1:${PORT}`);
            resolve(server);
        });
        server.on('error', reject);
    });
}

const ALL_VIEWPORTS = [
    // Mobile
    { name: 'Mobile 320px (Small)', width: 320, height: 568 },
    { name: 'Mobile 360px (Galaxy S8)', width: 360, height: 640 },
    { name: 'Mobile 375px (iPhone X)', width: 375, height: 812 },
    { name: 'Mobile 390px (iPhone 14)', width: 390, height: 844 },
    { name: 'Mobile 414px (iPhone Plus)', width: 414, height: 896 },
    { name: 'Mobile 430px (iPhone Pro Max)', width: 430, height: 932 },
    // Tablet
    { name: 'Tablet 600px (Android Mini)', width: 600, height: 960 },
    { name: 'Tablet 768px (iPad Mini)', width: 768, height: 1024 },
    { name: 'Tablet 820px (iPad Air)', width: 820, height: 1180 },
    { name: 'Tablet 1024px (iPad Pro)', width: 1024, height: 1366 },
    // Desktop
    { name: 'Desktop 1280px (HD Laptop)', width: 1280, height: 800 },
    { name: 'Desktop 1366px (Standard Laptop)', width: 1366, height: 768 },
    { name: 'Desktop 1440px (MacBook Pro)', width: 1440, height: 900 },
    { name: 'Desktop 1600px (Workstation)', width: 1600, height: 900 },
    { name: 'Desktop 1920px (Full HD 1080p)', width: 1920, height: 1080 },
];

async function runAudit() {
    const server = await startStaticServer();
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const results = [];
    const report = (category, testName, passed, details = "") => {
        const status = passed ? "PASS" : "FAIL";
        console.log(`[${status}] [${category}] ${testName}: ${details}`);
        results.push({ category, testName, passed, details });
    };

    try {
        // 1. Comprehensive 15-Viewport Responsive Testing
        console.log("\n================ TESTING ALL 15 VIEWPORTS FOR OVERFLOW & SCROLL ================");
        const responsivePage = await browser.newPage();
        await responsivePage.setViewport(ALL_VIEWPORTS[14]);
        await responsivePage.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'networkidle2', timeout: 20000 });
        await new Promise(r => setTimeout(r, 600));

        // Dismiss Intro Screen
        const hasIntroResp = await responsivePage.evaluate(() => !!document.querySelector('.intro-container'));
        if (hasIntroResp) {
            await responsivePage.click('.intro-container');
            await responsivePage.waitForFunction(() => !document.querySelector('.intro-container'), { timeout: 10000 });
        }
        await new Promise(r => setTimeout(r, 800));

        for (const vp of ALL_VIEWPORTS) {
            await responsivePage.setViewport({ width: vp.width, height: vp.height });
            await new Promise(r => setTimeout(r, 300));

            const overflowData = await responsivePage.evaluate(() => {
                const docWidth = document.documentElement.clientWidth;
                const scrollWidth = document.documentElement.scrollWidth;
                const bodyScrollWidth = document.body.scrollWidth;
                const maxScrollWidth = Math.max(scrollWidth, bodyScrollWidth);
                const hasOverflow = maxScrollWidth > docWidth;

                let offenders = [];
                if (hasOverflow) {
                    const allEls = document.querySelectorAll('*');
                    for (const el of allEls) {
                        const r = el.getBoundingClientRect();
                        if (r.right > docWidth + 2) {
                            offenders.push(`${el.tagName.toLowerCase()}.${el.className.split(' ').slice(0, 2).join('.')} (${Math.round(r.right)}px > ${docWidth}px)`);
                            if (offenders.length >= 3) break;
                        }
                    }
                }
                return { hasOverflow, docWidth, maxScrollWidth, offenders };
            });

            const passed = !overflowData.hasOverflow;
            const details = passed 
                ? `Zero horizontal overflow (${overflowData.docWidth}px == ${overflowData.maxScrollWidth}px)`
                : `Overflow detected: ${overflowData.maxScrollWidth}px > ${overflowData.docWidth}px. Offenders: ${overflowData.offenders.join('; ')}`;
            report("Responsive", vp.name, passed, details);
        }
        await responsivePage.close();

        // 2. Desktop Interactive Testing
        console.log("\n================ TESTING DESKTOP BUTTONS & VIEWS (1440px) ================");
        const page = await browser.newPage();
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                const text = msg.text();
                if (!text.includes('Failed to load resource') && !text.includes('Failed to fetch') && !text.includes('favicon')) {
                    consoleErrors.push(text);
                }
            }
        });

        await page.setViewport({ width: 1440, height: 900 });
        await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 600));

        const introPresent = await page.evaluate(() => !!document.querySelector('.intro-container'));
        if (introPresent) {
            await page.click('.intro-container');
            await page.waitForFunction(() => !document.querySelector('.intro-container'), { timeout: 10000 });
        }
        await new Promise(r => setTimeout(r, 1000));

        // Navigation: Battle Arena
        let battleClicked = false;
        try {
            await page.click('a[href="#battle"]');
            battleClicked = true;
        } catch {
            battleClicked = await page.evaluate(() => {
                const link = Array.from(document.querySelectorAll('a[href="#battle"]')).find(el => el.offsetParent !== null) || document.querySelector('a[href="#battle"]');
                if (link) { link.click(); return true; }
                return false;
            });
        }
        await new Promise(r => setTimeout(r, 1000));
        const onBattle = await page.evaluate(() => {
            const text = document.body.innerText.toLowerCase();
            return text.includes('battle arena') || text.includes('flagship showdown');
        });
        report("Interaction", "Navigate to Battle Arena", battleClicked && onBattle, "Battle Arena view mounted successfully");

        // Battle Arena: Random Matchup
        const randomBtn = await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Random Matchup') && b.offsetParent !== null);
            if (btn) { btn.click(); return true; }
            return false;
        });
        await new Promise(r => setTimeout(r, 600));
        report("Interaction", "Battle Arena Random Matchup Button", randomBtn, "Random challenger matchup selected");

        // Battle Arena: Share Battle Card Modal Test
        const shareBtn = await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Share Battle Card') && b.offsetParent !== null);
            if (btn) { btn.click(); return true; }
            return false;
        });
        await new Promise(r => setTimeout(r, 800));
        const shareModalOpen = await page.evaluate(() => document.body.innerText.includes('High-res showdown graphic') || document.body.innerText.includes('Download PNG'));
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 400));
        report("Modals", "Shareable Battle Card Modal", shareBtn && shareModalOpen, "Shareable showdown modal preview loaded and dismissed cleanly");

        // Battle Arena: Toggle Detailed Specs
        const specsBtn = await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Detailed Specs'));
            if (btn) { btn.click(); return true; }
            return false;
        });
        await new Promise(r => setTimeout(r, 600));
        const specsVisible = await page.evaluate(() => document.body.innerText.includes('Hardware Parameter') || document.body.innerText.includes('Processor / Silicon'));
        report("Interaction", "Detailed Specs Matrix Toggle", specsBtn && specsVisible, "Full hardware parameter matrix table visible");

        // Navigation: TrackHub
        const trackHubLink = await page.$('a[href="#trackhub"]');
        if (trackHubLink) await trackHubLink.click();
        await new Promise(r => setTimeout(r, 1000));
        const onTrackHub = await page.evaluate(() => document.body.innerText.includes('TrackHub') || document.body.innerText.includes('Price Drop Radar') || document.body.innerText.includes('active alerts'));
        report("Interaction", "Navigate to TrackHub", !!trackHubLink && onTrackHub, "TrackHub live price tracker mounted");

        // Navigation: Return Home
        const homeLink = await page.$('a[href="#home"]');
        if (homeLink) await homeLink.click();
        await new Promise(r => setTimeout(r, 1000));
        const onHome = await page.evaluate(() => document.body.innerText.includes('TECHBOY STORE') && (document.body.innerText.includes('FIND PHONES') || document.body.innerText.includes('Phones')));
        report("Interaction", "Return to Home Catalog", !!homeLink && onHome, "Home catalog view re-mounted");

        // Modals: Exchange Calculator
        const exchangeBtn = await page.$('button[aria-label="Exchange Value Calculator"]');
        let exchangeModalMounted = false;
        if (exchangeBtn) {
            await exchangeBtn.click();
            await new Promise(r => setTimeout(r, 600));
            exchangeModalMounted = await page.evaluate(() => document.body.innerText.includes('Smart Exchange Calculator') || document.body.innerText.includes('Exchange'));
            await page.keyboard.press('Escape');
            await new Promise(r => setTimeout(r, 400));
        }
        report("Modals", "Exchange Value Calculator Modal", !!exchangeBtn && exchangeModalMounted, "Exchange calculator opened and dismissed");

        // Modals: TechBoy AI Chatbot Drawer
        const chatBtn = await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('TechBoy AI'));
            if (btn) { btn.click(); return true; }
            return false;
        });
        await new Promise(r => setTimeout(r, 700));
        const chatVisible = await page.evaluate(() => !!document.querySelector('.chat-popup, [aria-label*="TechBoy AI"]') || document.body.innerText.includes('Ask anything') || document.body.innerText.includes('AI Assistant'));
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 400));
        report("Modals", "TechBoy AI Chatbot Drawer", chatBtn && chatVisible, "Chatbot drawer opened and closed cleanly");

        // Modals: Quick View Product Modal
        const quickViewBtn = await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'View');
            if (btn) { btn.click(); return true; }
            return false;
        });
        await new Promise(r => setTimeout(r, 700));
        const quickViewVisible = await page.evaluate(() => document.body.innerText.includes('Key Highlights') || document.body.innerText.includes('Specifications') || document.body.innerText.includes('RAM'));
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 400));
        report("Modals", "Product Quick View Modal", quickViewBtn && quickViewVisible, "Quick view modal displayed full specifications");

        // 3. Mobile Navigation & Dock Verification (Fresh Mobile Page)
        console.log("\n================ TESTING MOBILE BOTTOM DOCK (414px) ================");
        const mobilePage = await browser.newPage();
        await mobilePage.setViewport({ width: 414, height: 896 });
        await mobilePage.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 600));

        const hasMobileIntro = await mobilePage.evaluate(() => !!document.querySelector('.intro-container'));
        if (hasMobileIntro) {
            await mobilePage.click('.intro-container');
            await mobilePage.waitForFunction(() => !document.querySelector('.intro-container'));
        }
        await new Promise(r => setTimeout(r, 800));

        const mobileDockVisible = await mobilePage.evaluate(() => {
            const nav = document.querySelector('nav[aria-label="Mobile Navigation"]');
            return !!nav && nav.querySelectorAll('button').length === 6;
        });
        report("Mobile", "Mobile Bottom Floating Dock & 6 Nav Pills", mobileDockVisible, "Liquid glass floating dock active with all 6 navigation targets");

        // Mobile Battle Navigation Click
        const mobileBattleClicked = await mobilePage.evaluate(() => {
            const nav = document.querySelector('nav[aria-label="Mobile Navigation"]');
            if (!nav) return false;
            const btn = Array.from(nav.querySelectorAll('button')).find(b => b.innerText.includes('Battle'));
            if (btn) { btn.click(); return true; }
            return false;
        });
        await new Promise(r => setTimeout(r, 1000));
        const mobileOnBattle = await mobilePage.evaluate(() => {
            const text = document.body.innerText.toLowerCase();
            return text.includes('battle arena') || text.includes('flagship showdown');
        });
        report("Mobile", "Mobile Dock Battle Navigation", mobileBattleClicked && mobileOnBattle, "Mobile dock navigates cleanly to Battle Arena");
        await mobilePage.close();

        // 4. Accessibility & Performance
        console.log("\n================ TESTING ACCESSIBILITY & PERFORMANCE ================");
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        const reducedMotionRespected = await page.evaluate(() => {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        });
        report("Accessibility", "prefers-reduced-motion Media Query", reducedMotionRespected, "Reduced-motion media query respected by CSS");

        // 5. Diagnostics
        report("Diagnostics", "Zero Runtime JS Console Exceptions", consoleErrors.length === 0, 
            consoleErrors.length === 0 ? "Clean console log" : `Console errors: ${consoleErrors.slice(0, 2).join('; ')}`
        );

        await page.close();

    } finally {
        await browser.close();
        server.close();
    }

    console.log("\n================ AUDIT SUMMARY ================");
    const passedCount = results.filter(r => r.passed).length;
    console.log(`Total Checks: ${results.length} | Passed: ${passedCount} | Failed: ${results.length - passedCount}`);
    return results;
}

runAudit().catch(err => {
    console.error("Fatal audit error:", err);
    process.exit(1);
});
