<div align="center">

  <img src="frontend/images/logos/new-logo.jpg" alt="TechBoy Logo" width="120" style="border-radius: 50%; box-shadow: 0 0 25px rgba(255, 31, 61, 0.5); border: 2px solid #ff1f3d;">

  # <span style="color: #ff1f3d;">TECHBOY STORE</span>
  
  **The Next-Generation AI Smartphone Concierge & Live Deals Discovery Hub**

  [![Live Demo](https://img.shields.io/badge/Live-Demo-ff1f3d?style=for-the-badge&logoColor=white)](https://techboy-store.vercel.app/)
  [![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-white?style=for-the-badge&logo=github&logoColor=black)](https://github.com/chimataraghuram/TECHBOY-STORE)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://opensource.org/licenses/MIT)

  > `⚡ Unbiased, Live Data-Driven Smartphone Discovery & Price Tracking`  
  > `🤖 Conversational RAG AI with Multi-Turn Intent Scoring & Budget Extraction`  
  > `🎯 Predictive "Price Drop Radar" with All-Time Low Confidence Scoring`  
  > `📧 Transactional Email Engine via Resend API (Security Logins & Drop Alerts)`

  **An ultra-modern, full-stack smartphone shopping experience engineered to revolutionize device discovery. Blending glassmorphic cyberpunk aesthetics, 60fps GPU micro-animations, real-time analytics, and an intelligent NVIDIA NIM + RAG concierge, TECHBOY STORE delivers a zero-compromise discovery journey.**

</div>

---

## 🌐 Live Demo
Experience the premium tech shopping journey yourself: [https://techboy-store.vercel.app/](https://techboy-store.vercel.app/)

> "We cut through the marketing noise to bring you raw specs, smart comparisons, and AI recommendations tailored exactly to your wallet."

---

## 🖼️ Project Showcase

<div align="center">
  <h3>🚀 Hero Experience & Live Deals</h3>
  <p>An immersive gateway featuring 3D particle physics, neon typography, dual CTA quick-jumps to products and live trends, and fluid Framer Motion transitions.</p>
  <img src="https://placehold.co/800x400/0a0a12/ff1f3d?text=Hero+Dynamic+Dashboard" width="800" style="border-radius: 12px; border: 1px solid rgba(255, 31, 61, 0.25);">
  
  <br /><br />
  
  <h3>🤖 RAG-Powered AI Concierge</h3>
  <p>Compact, responsive assistant optimized for mobile, tablet, and desktop. Retrieves live catalog specs with budget parsing, multi-intent scoring, and deterministic fallback.</p>
  <img src="https://placehold.co/800x400/0a0a12/ff1f3d?text=RAG+AI+Chatbot+Assistant" width="800" style="border-radius: 12px; border: 1px solid rgba(255, 31, 61, 0.25);">

  <br /><br />
  
  <h3>🎯 Predictive Price Drop Radar</h3>
  <p>Instant AI buy-wait signal for every smartphone: BUY NOW alerts for all-time lows (≥18% drop), GOOD DEAL markers (≥8% drop), and WAIT & TRACK alerts with confidence scores.</p>
  <img src="https://placehold.co/800x400/0a0a12/ff1f3d?text=AI+Price+Drop+Radar" width="800" style="border-radius: 12px; border: 1px solid rgba(255, 31, 61, 0.25);">
  
  <br /><br />
  
  <h3>⚖️ Head-to-Head Comparison Engine</h3>
  <p>A frosted-glass overlay that dissects devices side-by-side, analyzing processors, camera arrays, display refresh rates, and battery metrics instantly.</p>
  <img src="https://placehold.co/800x400/0a0a12/ff1f3d?text=Comparison+Engine+Modal" width="800" style="border-radius: 12px; border: 1px solid rgba(255, 31, 61, 0.25);">
  
  <br /><br />
  
  <h3>🔐 Secure Auth & Transactional Resend Emails</h3>
  <p>Google OAuth via Firebase + Django REST API authentication, protected by automated branded HTML emails for welcomes, login alerts, and price drops.</p>
  <img src="https://placehold.co/800x400/0a0a12/ff1f3d?text=Premium+Identity+System" width="800" style="border-radius: 12px; border: 1px solid rgba(255, 31, 61, 0.25);">
</div>

---

## ✨ Features

| Icon | Feature | Description |
| :--- | :--- | :--- |
| 🤖 | **Catalog RAG Chatbot** | Server-side retrieval ranks the live TechBoy catalog before NVIDIA NIM Llama 3.1 generates answers with budget extraction, keeping recommendations grounded in stored prices and specs. |
| 🎯 | **AI Price Drop Radar** | Real-time buy/wait indicators across product cards and deal modals (`BUY NOW`, `GOOD DEAL`, `WAIT & TRACK`) with calculated confidence ratings. |
| 📧 | **Resend Email Engine** | Enterprise-grade transactional emails for account welcomes, security login alerts with IP/timestamp tracking, and instant price drop triggers. |
| 📱 | **Analyst Picks & Specs** | Carefully curated smartphone tiers with unified filtering (Brand, Budget, 5G, Camera, RAM) and 5-point mini spec grids on every card. |
| ⚖️ | **Smart Comparison** | Head-to-head evaluation tool designed to stack devices against each other, comparing everything from chipsets to fast-charging wattage. |
| 🌐 | **Dynamic 3D UI & 60fps Micro-Animations** | Visual excellence using Three.js particle backgrounds, GPU-accelerated micro-animations, and responsive glassmorphism across desktop, tablet, and mobile. |
| 📈 | **30-Day Price Trend Charts** | Interactive historical price tracking graphs showing market trends, all-time lows, and price drops across major retailers. |
| 🔐 | **Firebase + Django REST Auth** | Google sign-in through Firebase Authentication paired with token-based Django REST API security and personalized profiles. |
| 🔔 | **Real-Time Price Alerts** | Guest and signed-in alert subscriptions with duplicate suppression, target thresholds, and automated alert dispatches. |

---

## 🛠️ Tech Stack

### Frontend
- **React 19 & Vite** - High-performance reactive rendering with ultra-fast builds and HMR
- **Tailwind CSS & Vanilla Micro-Animations** - Cyberpunk neon theme, glassmorphism, and GPU-accelerated CSS animations (`animations.css`)
- **Framer Motion & Three.js** - Smooth 60fps layout transitions, interactive modals, and 3D ambient particle stages
- **Lucide Icons** - Clean, modern SVG iconography throughout all controls

### Backend (Production-Grade)
- **Django 6 & Django REST Framework (DRF)** - High-stability API architecture with decoupled service layers
- **RAG Concierge & Multi-Intent Parsing** - Contextual catalog retrieval paired with NVIDIA NIM Llama 3.1 and deterministic fallbacks
- **Resend SDK & Email Service** - Branded, responsive HTML transactional emails with security tracking and SMTP fallback
- **Redis & In-Memory Caching** - Multi-worker query and RAG response caching for low latency
- **SQLite / PostgreSQL** - Indexed relational database modeling for products, price histories, alerts, and analytics
- **Gunicorn** - High-concurrency production WSGI server

---

## 📂 Project Structure

```text
TECHBOY-STORE/
├── backend/                # Django REST API (Production Setup)
│   ├── api/                
│   │   ├── services/       # Decoupled Services (email_service, rag_service, alert_service)
│   │   ├── migrations/      # Versioned database schema changes
│   │   ├── management/      # Custom Django management commands
│   │   ├── models.py       # Optimized DB Models with Indexing
│   │   ├── views.py        # Thin ViewSet Layer with Caching & Auth
│   │   ├── serializers.py  # Advanced Data Transform Layer
│   │   └── exceptions.py   # Global Unified JSON Error Handler
│   ├── core/               # Central Config (Settings, Cache, Email, Logging)
│   └── requirements.txt    # Python dependencies (django, drf, resend, redis)
├── frontend/               # React Frontend (Vite)
│   ├── src/                    
│   │   ├── components/     # Modular UI (ChatPopup, PriceDropRadar, ProductCard, etc.)
│   │   ├── animations.css  # GPU micro-animations for cards, buttons & scrolling
│   │   ├── App.jsx         # Root layout with responsive navigation & modals
│   │   └── App.css         # Cyberpunk/Glassmorphic design system
│   ├── public/             # Static Assets & PWA manifest
│   └── package.json        # Frontend dependencies
├── images/                 # Categorized Project Assets (Logos, Heroes, etc.)
├── workflows/              # Automation Workflows (e.g., n8n Price Drop)
└── README.md               # Production Documentation
```

---

## 🛣️ Future Roadmap
- [x] **AI Chatbot**: NVIDIA NIM LLM + RAG hybrid catalog grounding with budget extraction.
- [x] **Price Drop Radar**: Predictive AI buy-or-wait recommendations with confidence scores.
- [x] **Transactional Emails**: Resend API integration for security login alerts and price drop notifications.
- [x] **Global Price Alerts**: Multi-channel alerts letting users track hardware price depreciation.
- [x] **User Profiles & Watchlists**: Save, track, and manage smartphone preferences.
- [ ] **Battle Arena**: Interactive side-by-side benchmark scoring and AI-determined device winner.
- [ ] **Exchange Value Calculator**: Instant trade-in bonus estimation for old smartphones.

---

## 🤝 Contributing
1. **Fork** the repository.
2. Create your **Feature Branch** (`git checkout -b feature/AmazingFeature`).
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4. **Push** to the branch (`git push origin feature/AmazingFeature`).
5. Open a **Pull Request**.

---

## 📜 License
Distributed under the **MIT License**. See `LICENSE` for more information.  
*Note: Please give appropriate credit if you use this UI template.*

---

## 👨‍💻 Author
**Chimata Raghuram**  
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/chimataraghuram)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/chimataraghuram)

<div align="center">
  <br />
  <b>COOKED BY RAGHU</b> ❤️
</div>
