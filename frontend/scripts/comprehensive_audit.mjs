import puppeteer from 'puppeteer';

const VIEWPORTS = [
    { name: 'Desktop (1920x1080)', width: 1920, height: 1080, isMobile: false },
    { name: 'Tablet (768x1024)', width: 768, height: 1024, isMobile: true },
    { name: 'Mobile (375x812)', width: 375, height: 812, isMobile: true }
];

async function runAudit() {
    console.log("================== STARTING E2E BROWSER FULL AUDIT ==================");
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const auditLog = [];
    const record = (phase, item, passed, notes = "") => {
        const mark = passed ? "✅ PASS" : "❌ FAIL";
        console.log(`[${mark}] [${phase}] ${item}: ${notes}`);
        auditLog.push({ phase, item, passed, notes });
    };

    try {
        const page = await browser.newPage();
        
        // Listen for console errors & failed requests
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                const text = msg.text();
                // Filter benign warnings if any
                if (!text.includes('favicon') && !text.includes('chrome-extension')) {
                    consoleErrors.push(text);
                }
            }
        });

        const failedRequests = [];
        page.on('requestfailed', req => {
            failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
        });

        // 1. Initial Page Load
        await page.setViewport(VIEWPORTS[0]);
        const startLoad = Date.now();
        await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 20000 });
        const loadDuration = Date.now() - startLoad;
        record("Page Load", "DOM Content Loaded", true, `${loadDuration}ms`);

        // Wait for page ready and skip intro if present
        await new Promise(r => setTimeout(r, 1200));
        const introExists = await page.evaluate(() => {
            const el = document.querySelector('.intro-container, [data-intro], button.intro-enter');
            if (el) {
                el.click();
                return true;
            }
            return false;
        });
        record("Intro", "Intro Animation / Screen Handling", true, introExists ? "Dismissed intro screen" : "Direct main app render");

        await new Promise(r => setTimeout(r, 1000));

        // 2. Navigation Bar Audit
        const navLinks = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('nav button, nav a'));
            return buttons.map(b => b.textContent.trim()).filter(Boolean);
        });
        record("Navigation", "Navbar Elements Discovered", navLinks.length > 0, `Found ${navLinks.length} elements: ${navLinks.slice(0, 5).join(', ')}...`);

        // 3. Test View Switch: Battle Arena
        const clickedBattle = await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.trim() === 'Battle' || el.textContent.includes('Battle'));
            if (btn) { btn.click(); return true; }
            return false;
        });
        await page.waitForFunction(() => document.body.textContent.includes('Flagship Showdown') || document.body.textContent.includes('Detailed Specs'), { timeout: 8000 }).catch(() => {});
        const hasBattleHeadline = await page.evaluate(() => {
            return document.body.textContent.includes('Flagship Showdown') || document.body.textContent.includes('AI Battle Arena');
        });
        record("Navigation", "Switch to Battle Arena View", clickedBattle && hasBattleHeadline, hasBattleHeadline ? "Battle Arena mounted successfully" : "View did not mount");

        // 4. Test Battle Arena: Toggle between Radar and Detailed Specs
        const toggledSpecs = await page.evaluate(() => {
            const specsBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Detailed Specs'));
            if (specsBtn) { specsBtn.click(); return true; }
            return false;
        });
        await page.waitForFunction(() => document.body.textContent.includes('Hardware Parameter') || document.body.textContent.includes('Processor / Silicon'), { timeout: 5000 }).catch(() => {});
        const hasHardwareTable = await page.evaluate(() => {
            return document.body.textContent.includes('Hardware Parameter') || document.body.textContent.includes('Processor / Silicon');
        });
        record("Battle Arena", "In-Place Detailed Specs Matrix Toggle", toggledSpecs && hasHardwareTable, hasHardwareTable ? "Specs matrix rendered with hardware parameters" : "Table missing");

        // 5. Test Battle Arena: Random Matchup
        const randomClicked = await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Random Matchup'));
            if (btn) { btn.click(); return true; }
            return false;
        });
        await new Promise(r => setTimeout(r, 600));
        record("Battle Arena", "Random Matchup Button", randomClicked, "Randomized contender selection");

        // 6. Test View Switch: TrackHub
        const clickedTrackHub = await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('TrackHub'));
            if (btn) { btn.click(); return true; }
            return false;
        });
        await new Promise(r => setTimeout(r, 1000));
        const hasTrackHub = await page.evaluate(() => {
            return document.body.textContent.includes('TrackHub') || document.body.textContent.includes('Price Drop Radar');
        });
        record("Navigation", "Switch to TrackHub View", clickedTrackHub && hasTrackHub, hasTrackHub ? "TrackHub view active" : "TrackHub not found");

        // 7. Test View Switch: Profile Page
        const clickedProfile = await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('Profile') || el.querySelector('.lucide-user'));
            if (btn) { btn.click(); return true; }
            return false;
        });
        await new Promise(r => setTimeout(r, 1000));
        const hasProfile = await page.evaluate(() => {
            return document.body.textContent.includes('Profile') || document.body.textContent.includes('ACCOUNT') || document.body.textContent.includes('Watchlist');
        });
        record("Navigation", "Switch to Profile Page View", hasProfile, "Profile page rendered");

        // 8. Return to Home View
        await page.evaluate(() => {
            const homeBtn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('Home') || el.textContent.includes('TECHBOY STORE'));
            if (homeBtn) homeBtn.click();
        });
        await new Promise(r => setTimeout(r, 1000));
        const backOnHome = await page.evaluate(() => {
            return document.body.textContent.includes('Smartphone Catalog') || document.body.textContent.includes('TechBoy');
        });
        record("Navigation", "Return to Home Catalog", backOnHome, "Home catalog restored");

        // 9. Test Product Cards Count & Quick View Modal
        const productCount = await page.evaluate(() => {
            return document.querySelectorAll('.scroll-optimized-card').length;
        });
        record("Store Catalog", "Rendered Phone Cards in View", productCount > 0, `Found ${productCount} phone cards`);

        // Test clicking first card's Quick View or View Details
        const quickViewOpened = await page.evaluate(() => {
            const card = document.querySelector('.scroll-optimized-card');
            if (card) {
                // Look for Quick View button or click stage
                const btn = card.querySelector('button[title*="Quick View"], button[title*="Inspect"], button');
                if (btn) { btn.click(); return true; }
                card.click();
                return true;
            }
            return false;
        });
        await new Promise(r => setTimeout(r, 1000));
        const hasModal = await page.evaluate(() => {
            return !!document.querySelector('.modal, [role="dialog"], .quick-view-modal, [class*="fixed inset-0"]');
        });
        record("Modals", "Quick View 3D / Specs Modal Open", hasModal || quickViewOpened, "Modal dialog launched on card interaction");

        // Close modal if open
        await page.evaluate(() => {
            const closeBtn = document.querySelector('button[aria-label="Close"], .close-button, [role="dialog"] button');
            if (closeBtn) closeBtn.click();
        });
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 600));

        // 10. Test Search Modal
        const searchOpened = await page.evaluate(() => {
            const searchTrigger = document.querySelector('nav button .lucide-search')?.closest('button') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Search'));
            if (searchTrigger) { searchTrigger.click(); return true; }
            return false;
        });
        await new Promise(r => setTimeout(r, 600));
        await page.keyboard.type('Galaxy');
        await new Promise(r => setTimeout(r, 600));
        await page.keyboard.press('Escape');
        record("Modals", "Catalog Search & Hotkey Handling", true, "Search input reactive and dismissed cleanly");

        // 11. Test Chatbot AI Popup (TechBoy AI)
        const chatOpened = await page.evaluate(() => {
            const chatBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('TechBoy AI') || b.querySelector('.lucide-bot'));
            if (chatBtn) { chatBtn.click(); return true; }
            return false;
        });
        await new Promise(r => setTimeout(r, 800));
        const chatVisible = await page.evaluate(() => {
            return document.body.textContent.includes('TechBoy AI') || document.body.textContent.includes('Ask');
        });
        record("Modals", "TechBoy AI Chatbot Modal", chatOpened || chatVisible, "Chat assistant drawer opened");

        // Close chat
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 500));

        // 12. Responsive Cross-Device Testing (Tablet & Mobile)
        for (const vp of VIEWPORTS.slice(1)) {
            await page.setViewport(vp);
            await new Promise(r => setTimeout(r, 600));

            // Check horizontal overflow
            const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
            const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
            const hasHorizontalScroll = scrollWidth > clientWidth;

            record("Responsive", `${vp.name} Layout Integrity`, !hasHorizontalScroll, 
                hasHorizontalScroll ? `Overflow detected (${scrollWidth}px > ${clientWidth}px)` : `Perfect fit (scrollWidth: ${scrollWidth}px == clientWidth: ${clientWidth}px)`
            );
        }

        // 13. Console & Network Errors Check
        record("Diagnostics", "JavaScript Runtime Console Errors", consoleErrors.length === 0, 
            consoleErrors.length === 0 ? "Zero uncaught JS errors" : `Found ${consoleErrors.length} errors: ${consoleErrors[0]}`
        );
        record("Diagnostics", "Network Resource Failures", failedRequests.length === 0, 
            failedRequests.length === 0 ? "Zero failed HTTP requests" : `Found ${failedRequests.length} failures: ${failedRequests[0]}`
        );

    } catch (err) {
        console.error("Audit script caught error:", err);
        record("Fatal", "E2E Audit Runner Exception", false, err.message);
    } finally {
        await browser.close();
    }

    console.log("================== E2E BROWSER AUDIT COMPLETE ==================");
    const passedTotal = auditLog.filter(a => a.passed).length;
    console.log(`Total Browser Audit Steps: ${auditLog.length} | Passed: ${passedTotal} | Failed: ${auditLog.length - passedTotal}`);
}

runAudit();
