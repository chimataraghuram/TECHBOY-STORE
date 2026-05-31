import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Bell, TrendingDown, Rocket, Flame, Star, Scale, TrendingUp, Cpu, Battery, Camera } from 'lucide-react';
import '../redline.css'; // Make sure styles are pulled in

export const PREDEFINED_NOTIFICATIONS = [
  {
    id: 1,
    type: 'pick',
    icon: Star,
    title: 'Analyst Pick',
    desc: 'Tecno Spark 30C is a top pick',
    time: 'Just now',
    unread: true,
    name: 'Tecno Spark 30C',
    specs: 'Chip: Helio G88 | Display: 6.67" 90Hz IPS | RAM: 8GB | Battery: 5000mAh',
    current: 8499,
    prev: 10499,
    pct: 19,
    savings: 2000,
    image: '/images/phones/tecno-spark-30c.png',
    buyLink: 'https://www.amazon.in/s?k=Tecno+Spark+30C'
  },
  {
    id: 2,
    type: 'trending',
    icon: Flame,
    title: 'Trending Now',
    desc: 'Redmi 13C 5G is trending',
    time: '15 mins ago',
    unread: true,
    name: 'Redmi 13C 5G',
    specs: 'Camera: 50MP AI | Chip: Dimensity 6100+ | Display: 6.74" 90Hz | Network: 5G',
    current: 9299,
    prev: 11299,
    pct: 18,
    savings: 2000,
    image: '/images/phones/redmi-13c-5g.png',
    buyLink: 'https://www.amazon.in/s?k=Redmi+13C+5G'
  },
  {
    id: 3,
    type: 'price_drop',
    icon: TrendingDown,
    title: 'Price Drop',
    desc: 'Samsung Galaxy M07 price dropped by ₹2,000',
    time: '1 hour ago',
    unread: true,
    name: 'Samsung Galaxy M07',
    specs: 'OS: One UI 7 | Display: 6.7" 120Hz LCD | Chip: Helio G99 | OS Updates: 6 major',
    current: 9499,
    prev: 11499,
    pct: 17,
    savings: 2000,
    image: '/images/phones/samsung-galaxy-m07.jpg',
    buyLink: 'https://www.amazon.in/s?k=Samsung+Galaxy+M07'
  },
  {
    id: 4,
    type: 'launch',
    icon: Rocket,
    title: 'New Launch',
    desc: 'Realme C75 now available',
    time: '3 hours ago',
    unread: true,
    name: 'Realme C75',
    specs: 'Chip: Helio G91 | Battery: 6000mAh 45W | Camera: 50MP | Display: 6.74" 90Hz',
    current: 9999,
    prev: 11999,
    pct: 17,
    savings: 2000,
    image: '/images/phones/realme-c75.jpg',
    buyLink: 'https://www.amazon.in/s?k=Realme+C75'
  },
  {
    id: 5,
    type: 'pick',
    icon: Star,
    title: 'Analyst Pick',
    desc: 'Infinix Hot 50i is a top pick',
    time: '4 hours ago',
    unread: true,
    name: 'Infinix Hot 50i',
    specs: 'RAM: 8GB | Storage: 128GB | Battery: 5000mAh | Display: 6.7" 90Hz',
    current: 7499,
    prev: 9499,
    pct: 21,
    savings: 2000,
    image: '/images/phones/infinix-hot-50i.jpg',
    buyLink: 'https://www.amazon.in/s?k=Infinix+Hot+50i'
  },
  {
    id: 6,
    type: 'trending',
    icon: Flame,
    title: 'Trending Now',
    desc: 'iQOO Z9 5G is trending',
    time: '5 hours ago',
    unread: true,
    name: 'iQOO Z9 5G',
    specs: 'Chip: Snapdragon 7 Gen 3 | Display: 6.78" 144Hz AMOLED | RAM: 8GB LPDDR5 | Battery: 5000mAh 44W',
    current: 17999,
    prev: 20999,
    pct: 14,
    savings: 3000,
    image: '/images/phones/iqoo-z9-5g.jpg',
    buyLink: 'https://www.amazon.in/s?k=iQOO+Z9+5G'
  },
  {
    id: 7,
    type: 'price_drop',
    icon: TrendingDown,
    title: 'Price Drop',
    desc: 'Redmi Note 14 5G price dropped by ₹3,000',
    time: '8 hours ago',
    unread: true,
    name: 'Redmi Note 14 5G',
    specs: 'Camera: 108MP main | Display: 6.67" 120Hz AMOLED | Chip: Dimensity 7025 | Battery: 5500mAh',
    current: 18999,
    prev: 21999,
    pct: 14,
    savings: 3000,
    image: '/images/phones/redmi-note-14-5g.jpg',
    buyLink: 'https://www.amazon.in/s?k=Redmi+Note+14+5G'
  },
  {
    id: 8,
    type: 'launch',
    icon: Rocket,
    title: 'New Launch',
    desc: 'Samsung Galaxy A26 5G now available',
    time: 'Yesterday',
    unread: true,
    name: 'Samsung Galaxy A26 5G',
    specs: 'OS: One UI 7 + Galaxy AI | Display: 6.6" Super AMOLED | Camera: 50MP OIS | Updates: 4 yrs OS + 5 sec',
    current: 19999,
    prev: 22999,
    pct: 13,
    savings: 3000,
    image: '/images/phones/samsung-galaxy-a26-5g.jpg',
    buyLink: 'https://www.amazon.in/s?k=Samsung+Galaxy+A26+5G'
  },
  {
    id: 9,
    type: 'pick',
    icon: Star,
    title: 'Analyst Pick',
    desc: 'Nothing Phone (3a) is a top pick',
    time: 'Just now',
    unread: true,
    name: 'Nothing Phone (3a)',
    specs: 'Chip: Snapdragon 7s Gen 3 | Camera: 50MP triple | Display: 6.77" AMOLED 120Hz | Design: Glyph interface',
    current: 19999,
    prev: 22999,
    pct: 13,
    savings: 3000,
    image: '/images/phones/nothing-phone-3a.jpg',
    buyLink: 'https://www.amazon.in/s?k=Nothing+Phone+3a'
  },
  {
    id: 10,
    type: 'trending',
    icon: Flame,
    title: 'Trending Now',
    desc: 'vivo T5x 5G is trending',
    time: '15 mins ago',
    unread: true,
    name: 'vivo T5x 5G',
    specs: 'Chip: Dimensity 7300 | Battery: 6500mAh | Display: 6.72" 120Hz | Network: 5G',
    current: 18999,
    prev: 21999,
    pct: 14,
    savings: 3000,
    image: '/images/phones/vivo-t5x-5g.jpg',
    buyLink: 'https://www.amazon.in/s?k=vivo+T5x+5G'
  },
  {
    id: 11,
    type: 'price_drop',
    icon: TrendingDown,
    title: 'Price Drop',
    desc: 'iQOO Neo 10R price dropped by ₹5,000',
    time: '1 hour ago',
    unread: true,
    name: 'iQOO Neo 10R',
    specs: 'Chip: Snapdragon 8s Gen 3 | Display: 6.78" 144Hz AMOLED | Cooling: Vapor chamber + Q2 | BGMI: Stable 90fps',
    current: 27999,
    prev: 32999,
    pct: 15,
    savings: 5000,
    image: '/images/phones/iqoo-neo-10r.jpg',
    buyLink: 'https://www.amazon.in/s?k=iQOO+Neo+10R'
  },
  {
    id: 12,
    type: 'launch',
    icon: Rocket,
    title: 'New Launch',
    desc: 'Google Pixel 9a now available',
    time: '3 hours ago',
    unread: true,
    name: 'Google Pixel 9a',
    specs: 'Camera: 48MP + Google AI | Chip: Tensor G4 | Display: 6.3" OLED 120Hz | Updates: 7 years',
    current: 29999,
    prev: 34999,
    pct: 14,
    savings: 5000,
    image: '/images/phones/google-pixel-9a.jpg',
    buyLink: 'https://www.amazon.in/s?k=Google+Pixel+9a'
  },
  {
    id: 13,
    type: 'pick',
    icon: Star,
    title: 'Analyst Pick',
    desc: 'Nothing Phone (3a) Pro is a top pick',
    time: '4 hours ago',
    unread: true,
    name: 'Nothing Phone (3a) Pro',
    specs: 'OS: Nothing OS 3.0 | Design: Unique Glyph UI | Camera: 50MP triple | Chip: Snapdragon 7s Gen 3',
    current: 25999,
    prev: 29999,
    pct: 13,
    savings: 4000,
    image: '/images/phones/nothing-phone-3a.jpg',
    buyLink: 'https://www.amazon.in/s?k=Nothing+Phone+3a+Pro'
  },
  {
    id: 14,
    type: 'trending',
    icon: Flame,
    title: 'Trending Now',
    desc: 'Realme GT 7T is trending',
    time: '5 hours ago',
    unread: true,
    name: 'Realme GT 7T',
    specs: 'Chip: Snapdragon 8s Gen 3 | Charging: 120W SuperVOOC | Display: 6.78" 144Hz AMOLED | Camera: 50MP Sony IMX',
    current: 26999,
    prev: 31999,
    pct: 16,
    savings: 5000,
    image: '/images/phones/realme-gt7t.webp',
    buyLink: 'https://www.amazon.in/s?k=Realme+GT+7T'
  },
  {
    id: 15,
    type: 'price_drop',
    icon: TrendingDown,
    title: 'Price Drop',
    desc: 'POCO F7 5G price dropped by ₹4,000',
    time: '8 hours ago',
    unread: true,
    name: 'POCO F7 5G',
    specs: 'Chip: Snapdragon 8s Gen 3 | RAM: 12GB LPDDR5X | Battery: 6000mAh 90W | Storage: 256GB',
    current: 24999,
    prev: 28999,
    pct: 14,
    savings: 4000,
    image: '/images/phones/poco-f7-5g.jpg',
    buyLink: 'https://www.amazon.in/s?k=POCO+F7+5G'
  },
  {
    id: 16,
    type: 'launch',
    icon: Rocket,
    title: 'New Launch',
    desc: 'OnePlus Nord CE 5 now available',
    time: 'Yesterday',
    unread: true,
    name: 'OnePlus Nord CE 5',
    specs: 'OS: OxygenOS 15 | Updates: 4 years OS | Build: Premium glass | Resale: Strong',
    current: 28710,
    prev: 33710,
    pct: 15,
    savings: 5000,
    image: '/images/phones/oneplus-nord-ce5.png',
    buyLink: 'https://www.amazon.in/s?k=OnePlus+Nord+CE+5'
  },
  {
    id: 17,
    type: 'pick',
    icon: Star,
    title: 'Analyst Pick',
    desc: 'POCO X8 Pro Max is a top pick',
    time: 'Just now',
    unread: true,
    name: 'POCO X8 Pro Max',
    specs: 'Chip: Snapdragon 8 Gen 3 | Display: 6.73" 144Hz AMOLED | RAM: 16GB LPDDR5X | Cooling: Vapor chamber',
    current: 42999,
    prev: 49999,
    pct: 14,
    savings: 7000,
    image: '/images/phones/poco-x8-pro-max.jpg',
    buyLink: 'https://www.flipkart.com/search?q=POCO+X8+Pro'
  },
  {
    id: 18,
    type: 'trending',
    icon: Flame,
    title: 'Trending Now',
    desc: 'vivo V70 FE is trending',
    time: '15 mins ago',
    unread: true,
    name: 'vivo V70 FE',
    specs: 'Camera: 50MP ZEISS OIS | Portrait: ZEISS tuning | Chip: Dimensity 9200 | Display: 6.73" AMOLED 120Hz',
    current: 37088,
    prev: 43088,
    pct: 14,
    savings: 6000,
    image: '/images/phones/vivo-v70-fe.jpg',
    buyLink: 'https://www.amazon.in/s?k=vivo+V70+FE'
  },
  {
    id: 19,
    type: 'price_drop',
    icon: TrendingDown,
    title: 'Price Drop',
    desc: 'Samsung Galaxy A37 5G price dropped by ₹6,000',
    time: '1 hour ago',
    unread: true,
    name: 'Samsung Galaxy A37 5G',
    specs: 'OS: One UI 7 + Galaxy AI | Display: 6.5" Super AMOLED | Camera: 50MP OIS | Updates: 4 OS + 5 sec yrs',
    current: 34999,
    prev: 40999,
    pct: 15,
    savings: 6000,
    image: '/images/phones/samsung-galaxy-a37-5g.jpg',
    buyLink: 'https://www.amazon.in/s?k=Samsung+Galaxy+A37+5G'
  },
  {
    id: 20,
    type: 'launch',
    icon: Rocket,
    title: 'New Launch',
    desc: 'OnePlus Nord 6 now available',
    time: '3 hours ago',
    unread: true,
    name: 'OnePlus Nord 6',
    specs: 'Chip: Snapdragon 8s Gen 4 | Display: 6.77" ProXDR 120Hz | Charging: 100W SUPERVOOC | Build: Glass + aluminum',
    current: 35999,
    prev: 41999,
    pct: 14,
    savings: 6000,
    image: '/images/phones/oneplus-nord-6.jpg',
    buyLink: 'https://www.amazon.in/s?k=OnePlus+Nord+6'
  },
  {
    id: 21,
    type: 'pick',
    icon: Star,
    title: 'Analyst Pick',
    desc: 'Realme GT 7 Pro is a top pick',
    time: '4 hours ago',
    unread: true,
    name: 'Realme GT 7 Pro',
    specs: 'Chip: Snapdragon 8 Elite | Charging: 120W SuperVOOC | Camera: 50MP triple | Display: 6.78" 144Hz AMOLED',
    current: 37999,
    prev: 43999,
    pct: 14,
    savings: 6000,
    image: '/images/phones/realme-gt7-pro.jpg',
    buyLink: 'https://www.amazon.in/s?k=Realme+GT+7+Pro'
  },
  {
    id: 22,
    type: 'trending',
    icon: Flame,
    title: 'Trending Now',
    desc: 'iQOO 13 5G is trending',
    time: '5 hours ago',
    unread: true,
    name: 'iQOO 13 5G',
    specs: 'Chip: Snapdragon 8 Elite | Display: 6.82" 144Hz LTPO | RAM: 16GB LPDDR5X | Cooling: Q2 supercomputing chip',
    current: 47999,
    prev: 55999,
    pct: 14,
    savings: 8000,
    image: '/images/phones/iqoo-13-5g.jpg',
    buyLink: 'https://www.amazon.in/s?k=iQOO+13+5G'
  },
  {
    id: 23,
    type: 'price_drop',
    icon: TrendingDown,
    title: 'Price Drop',
    desc: 'vivo V70 price dropped by ₹7,000',
    time: '8 hours ago',
    unread: true,
    name: 'vivo V70',
    specs: 'Camera: 50MP ZEISS triple | Portrait: 85mm lens | Chip: Dimensity 9300 | Battery: 5500mAh 90W',
    current: 45999,
    prev: 52999,
    pct: 13,
    savings: 7000,
    image: '/images/phones/vivo-v70.jpg',
    buyLink: 'https://www.amazon.in/s?k=vivo+V70'
  },
  {
    id: 24,
    type: 'launch',
    icon: Rocket,
    title: 'New Launch',
    desc: 'Samsung Galaxy A57 5G now available',
    time: 'Yesterday',
    unread: true,
    name: 'Samsung Galaxy A57 5G',
    specs: 'OS: One UI 7 + Galaxy AI | Camera: 200MP | Display: 6.5" 120Hz AMOLED | Updates: 4 OS + 5 sec yrs',
    current: 51860,
    prev: 59860,
    pct: 13,
    savings: 8000,
    image: '/images/phones/samsung-galaxy-a57-5g.jpg',
    buyLink: 'https://www.amazon.in/s?k=Samsung+Galaxy+A57+5G'
  },
  {
    id: 25,
    type: 'pick',
    icon: Star,
    title: 'Analyst Pick',
    desc: 'OnePlus 13R is a top pick',
    time: 'Just now',
    unread: true,
    name: 'OnePlus 13R',
    specs: 'Chip: Snapdragon 8 Gen 3 | Battery: 6000mAh 80W | Camera: 50MP Hasselblad | Display: 6.78" AMOLED 120Hz',
    current: 42999,
    prev: 49999,
    pct: 14,
    savings: 7000,
    image: '/images/phones/oneplus-13r.jpg',
    buyLink: 'https://www.amazon.in/s?k=OnePlus+13R'
  },
  {
    id: 26,
    type: 'trending',
    icon: Flame,
    title: 'Trending Now',
    desc: 'OnePlus 13 is trending',
    time: '15 mins ago',
    unread: true,
    name: 'OnePlus 13',
    specs: 'Chip: Snapdragon 8 Elite | Display: 6.82" LTPO3 120Hz | Cooling: Cryoflux system | Battery: 6000mAh 100W',
    current: 58999,
    prev: 67999,
    pct: 13,
    savings: 9000,
    image: '/images/phones/oneplus-13.jpg',
    buyLink: 'https://www.amazon.in/s?k=OnePlus+13'
  },
  {
    id: 27,
    type: 'price_drop',
    icon: TrendingDown,
    title: 'Price Drop',
    desc: 'Google Pixel 9 Pro price dropped by ₹9,000',
    time: '1 hour ago',
    unread: true,
    name: 'Google Pixel 9 Pro',
    specs: 'Camera: 50MP triple + AI | Video: 8K Pro Video | Chip: Tensor G4 | Updates: 7 years guaranteed',
    current: 59999,
    prev: 68999,
    pct: 13,
    savings: 9000,
    image: '/images/phones/google-pixel-9-pro.jpg',
    buyLink: 'https://www.amazon.in/s?k=Google+Pixel+9+Pro'
  },
  {
    id: 28,
    type: 'launch',
    icon: Rocket,
    title: 'New Launch',
    desc: 'Samsung Galaxy S25 now available',
    time: '3 hours ago',
    unread: true,
    name: 'Samsung Galaxy S25',
    specs: 'OS: One UI 7 + Galaxy AI | Chip: Snapdragon 8 Elite | Display: 6.2" QHD+ 120Hz | Updates: 7 OS updates',
    current: 68107,
    prev: 79107,
    pct: 14,
    savings: 11000,
    image: '/images/phones/samsung-galaxy-s25.jpg',
    buyLink: 'https://www.amazon.in/s?k=Samsung+Galaxy+S25'
  },
  {
    id: 29,
    type: 'pick',
    icon: Star,
    title: 'Analyst Pick',
    desc: 'Samsung Galaxy S26+ is a top pick',
    time: '4 hours ago',
    unread: true,
    name: 'Samsung Galaxy S26+',
    specs: 'Chip: SD 8 Elite Gen 5 | Display: 6.7" QHD+ AMOLED | Cooling: 29% vapor upgrade | Battery: 4900mAh',
    current: 89999,
    prev: 103999,
    pct: 13,
    savings: 14000,
    image: '/images/phones/samsung-galaxy-s26-plus.jpg',
    buyLink: 'https://www.amazon.in/s?k=Samsung+Galaxy+S26+Plus'
  },
  {
    id: 30,
    type: 'trending',
    icon: Flame,
    title: 'Trending Now',
    desc: 'Apple iPhone 17 is trending',
    time: '5 hours ago',
    unread: true,
    name: 'Apple iPhone 17',
    specs: 'Camera: 48MP + 48MP ultrawide | Chip: Apple A19 | Video: 4K 120fps Cinematic | OS: iOS 26',
    current: 82900,
    prev: 95900,
    pct: 14,
    savings: 13000,
    image: '/images/phones/apple-iphone-17.jpg',
    buyLink: 'https://www.amazon.in/s?k=Apple+iPhone+17'
  }
];

export let current9 = [];
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
};

const NotificationSystem = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeNotifications, setActiveNotifications] = useState([]);
    const [hasUnread, setHasUnread] = useState(false);
    const [isVibrating, setIsVibrating] = useState(false);
    const [toastNotification, setToastNotification] = useState(null);
    const panelRef = useRef(null);

    const liveAlerts = useLiveAlerts();
    
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
    }, [liveAlerts]);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const togglePanel = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setHasUnread(false);
            // Mark all active as read
            setActiveNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        }
    };
    
    const handleNotificationClick = (notifId) => {
        // Close dropdown
        setIsOpen(false);
        // Navigate/Scroll to specific alert in Trends
        const targetAlert = document.getElementById(`trend-alert-${notifId}`);
        if (targetAlert) {
            targetAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Temporary highlight effect
            const originalShadow = targetAlert.style.boxShadow;
            const originalBorder = targetAlert.style.borderColor;
            targetAlert.style.transition = 'all 0.3s ease-out';
            targetAlert.style.boxShadow = '0 0 30px rgba(255, 50, 50, 0.8)';
            targetAlert.style.borderColor = 'rgba(255, 50, 50, 0.9)';
            
            setTimeout(() => {
                targetAlert.style.boxShadow = originalShadow;
                targetAlert.style.borderColor = originalBorder;
            }, 2000);
        } else {
            // Fallback to trends section
            const trendsSection = document.getElementById('trends');
            if (trendsSection) {
                trendsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="navbar-notification-container" ref={panelRef}>
            <button 
                className={`bell-btn premium-bell ${isVibrating ? 'vibrating-big' : ''}`} 
                onClick={togglePanel}
                title="TechBoy Updates"
                aria-label="TechBoy Updates"
            >
                <Bell size={18} className={isVibrating ? 'bell-icon-glow' : ''} />
                {hasUnread && <span className="bell-pulse-dot big-pulse"></span>}
            </button>

            {/* BIG TOAST ALERT */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {toastNotification && (
                        <m.div
                            className="notification-toast glass-card"
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 50, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            onClick={() => handleNotificationClick(toastNotification.id)}
                        >
                            <div className="toast-icon-wrapper" style={{ overflow: 'hidden', padding: 0, background: 'transparent', border: 'none', width: '40px', height: '40px', flexShrink: 0 }}>
                                <img src={toastNotification.image} alt="alert" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} onError={(e) => { e.target.src = '/images/phones/apple-iphone-17-pro.jpg'; }} />
                            </div>
                            <div className="toast-content">
                                <h4>{toastNotification.title}</h4>
                                <p>{toastNotification.desc}</p>
                            </div>
                            <div className="toast-action">
                                <span>View Trends ➔</span>
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            <AnimatePresence>
                {isOpen && (
                    <m.div 
                        className="alerts-dropdown premium-notification-panel"
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                        <div className="alerts-dropdown-header notification-header">
                            <h4>TechBoy Updates</h4>
                            <span className="live-indicator"><span className="pulse-circle"></span> Live</span>
                        </div>

                        <div className="notification-list">
                            {activeNotifications.length === 0 ? (
                                <div className="alerts-empty-state">
                                    <p>No new updates right now.</p>
                                </div>
                            ) : (
                                activeNotifications.map((notif) => (
                                    <div 
                                        key={notif.id} 
                                        className={`notification-item ${notif.unread ? 'unread' : ''}`}
                                        onClick={() => handleNotificationClick(notif.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="notif-icon-wrapper" style={{ overflow: 'hidden', padding: 0, background: 'transparent', border: 'none' }}>
                                            <img src={notif.image} alt="alert" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} onError={(e) => { e.target.src = '/images/phones/apple-iphone-17-pro.jpg'; }} />
                                        </div>
                                        <div className="notif-content">
                                            <div className="notif-title-row">
                                                <h5>{notif.title}</h5>
                                                <span className="notif-time">{notif.time}</span>
                                            </div>
                                            <p>{notif.desc}</p>
                                        </div>
                                        {notif.unread && <div className="unread-dot"></div>}
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <div className="notification-footer">
                            <p>Powered by TechBoy AI Intelligence</p>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationSystem;
