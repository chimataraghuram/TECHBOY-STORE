const fs = require('fs');

// --- 1. NotificationSystem.jsx ---
let notifText = fs.readFileSync('frontend/src/components/NotificationSystem.jsx', 'utf8');

// Replace CURRENT_LIVE_ALERTS with hook logic
const currentLiveAlertsStr = 'export const CURRENT_LIVE_ALERTS = [...PREDEFINED_NOTIFICATIONS];';
const hookLogic = `export let current9 = [];
let listeners = [];

export const refreshAlerts = () => {
    const shuffled = [...PREDEFINED_NOTIFICATIONS].sort(() => 0.5 - Math.random());
    const selected9 = shuffled.slice(0, 9);
    selected9.sort((a, b) => b.pct - a.pct); // highest discount first
    current9 = selected9.map((item, index) => ({
        ...item,
        rank: index + 1
    }));
    listeners.forEach(l => l([...current9]));
};

refreshAlerts();
setInterval(refreshAlerts, 20000); // 20s interval

export const useLiveAlerts = () => {
    const [alerts, setAlerts] = useState(current9);
    useEffect(() => {
        listeners.push(setAlerts);
        return () => {
            listeners = listeners.filter(l => l !== setAlerts);
        };
    }, []);
    return alerts;
};`;
notifText = notifText.replace(currentLiveAlertsStr, hookLogic);

// Replace state and useEffect inside NotificationSystem
const oldUseEffect = `    // Initial load and rotation logic
    useEffect(() => {
        setActiveNotifications(CURRENT_LIVE_ALERTS);
        setHasUnread(true);
        
        // Delay initial animation slightly so user notices it
        const initTimeout = setTimeout(() => {
            // Trigger bell vibration - Big Animation
            setIsVibrating(true);
            setTimeout(() => setIsVibrating(false), 2500); // Vibrate for 2.5 seconds
            
            // Trigger Toast Alert
            setToastNotification(CURRENT_LIVE_ALERTS[0]); // Show the first one as a toast
            setTimeout(() => setToastNotification(null), 6000); // Hide toast after 6 seconds
        }, 3000);

        return () => {
            clearTimeout(initTimeout);
        };
    }, []);`;

const newUseEffect = `    const liveAlerts = useLiveAlerts();
    
    // Initial load and rotation logic
    useEffect(() => {
        const top2 = liveAlerts.slice(0, 2).map(a => ({...a, unread: true}));
        setActiveNotifications(top2);
        setHasUnread(true);
        
        const initTimeout = setTimeout(() => {
            setIsVibrating(true);
            setTimeout(() => setIsVibrating(false), 2500);
            
            setToastNotification(top2[0]);
            setTimeout(() => setToastNotification(null), 6000);
        }, 500);

        return () => clearTimeout(initTimeout);
    }, [liveAlerts]);`;

// Need to safely remove old activeNotifications state if it interferes, but it's fine
notifText = notifText.replace(oldUseEffect, newUseEffect);

// And update the activeNotifications state default
notifText = notifText.replace('const [activeNotifications, setActiveNotifications] = useState([]);', 'const [activeNotifications, setActiveNotifications] = useState([]);'); // keeping it same, useEffect will handle it

// Ensure activeNotifications in render only uses 2, but useEffect already slices it!
fs.writeFileSync('frontend/src/components/NotificationSystem.jsx', notifText);


// --- 2. TechBoyTrends.jsx ---
let trendsText = fs.readFileSync('frontend/src/components/TechBoyTrends.jsx', 'utf8');

trendsText = trendsText.replace(
    "import { PREDEFINED_NOTIFICATIONS, CURRENT_LIVE_ALERTS } from './NotificationSystem';",
    "import { useLiveAlerts } from './NotificationSystem';"
);

trendsText = trendsText.replace(
    "const TechBoyTrends = () => {",
    "const TechBoyTrends = () => {\n  const liveAlerts = useLiveAlerts();"
);

trendsText = trendsText.replace(
    "{CURRENT_LIVE_ALERTS.map(phone => (",
    "{liveAlerts.map(phone => ("
);

// Add rank badge
const pctBadgeStr = `{/* pct badge */}
              <div className="tbt-drop-pct-badge" style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(22, 163, 74, 0.2)', color: '#4ade80', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', zIndex: 10 }}>
                ↓ {phone.pct}%
              </div>`;

const newBadgesStr = `{/* rank badge */}
              <div className="tbt-rank-badge" style={{ position: 'absolute', top: '12px', left: '12px', background: 'linear-gradient(45deg, #16a34a, #15803d)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', zIndex: 10, border: '1px solid #4ade80' }}>
                🔥 #{phone.rank} HIGHEST DISCOUNT
              </div>
              {/* pct badge */}
              <div className="tbt-drop-pct-badge" style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(22, 163, 74, 0.2)', color: '#4ade80', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', zIndex: 10 }}>
                ↓ {phone.pct}%
              </div>`;

trendsText = trendsText.replace(pctBadgeStr, newBadgesStr);

fs.writeFileSync('frontend/src/components/TechBoyTrends.jsx', trendsText);
